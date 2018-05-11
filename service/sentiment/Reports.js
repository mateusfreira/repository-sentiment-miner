const config = require('config');
const Promise = require('bluebird');
const models = require("../../model/mongo/index.js");
const Developer = models.Developer;
const Pull = models.Pull;
const Project = models.Project;
const PullComments = models.PullComments;
const PullReviews = models.PullReviews;
const Commit = models.Commit;
const _ = require('lodash');

const neutralFilter = {
    "sentistrength_new.wholeText.whole_text.scale": {
        $eq: 0
    }
};
const negativeFilter = {
    "sentistrength_new.wholeText.whole_text.scale": {
        $lt: 0
    }
};

const positiveFilter = {
    "sentistrength_new.wholeText.whole_text.scale": {
        $gt: 0
    }
};

function dayOfWeekSentiment($match = {}) {
    return PullComments.aggregate(
        [{
                $match: _.clone($match),
            },
            {
                $group: {
                    _id: {
                        $dayOfWeek: "$created_at"
                    },
                    sum: {
                        $sum: "$sentistrength_new.wholeText.whole_text.scale"
                    },
                    count: {
                        $sum: 1
                    },
                }
            }
        ]);
}

function countSentimentByEntity(model, filter) {
    return Promise.props({
        positive: model.count(Object.assign(filter, positiveFilter)),
        neutral: model.count(Object.assign(filter, neutralFilter)),
        negative: model.count(Object.assign(filter, negativeFilter)),
    });
}

class Reports {

    dayOfWeekSentiment(filter = {}) {
        return Promise.props({
            positive: dayOfWeekSentiment(Object.assign(filter, positiveFilter)),
            neutral: dayOfWeekSentiment(Object.assign(filter, neutralFilter)),
            negative: dayOfWeekSentiment(Object.assign(filter, negativeFilter))
        });
    }

    sentimentByType(filter = {}) {
        return Promise.props({
            pull: countSentimentByEntity(Pull, filter),
            comments: countSentimentByEntity(PullComments, filter),
            reviews: countSentimentByEntity(PullReviews, filter),
            commits: countSentimentByEntity(Commit, filter)
        });
    }

    worstAndTheBest(filter = {}, limit = 5) {
        return Promise.props({
            worst: PullComments.find(filter)
                .limit(limit)
                .sort({
                    "sentistrength_new.wholeText.whole_text.scale": 1,
                    "sentistrength_new.wholeText.whole_text.negative": 1,

                }),
            bests: PullComments.find(filter)
                .limit(limit)
                .sort({
                    "sentistrength_new.wholeText.whole_text.scale": -1,
                    "sentistrength_new.wholeText.whole_text.positive": -1,
                })
        });
    }

    mostSentimental(filter = {}, limit = 5) {
        return Developer.find(filter)
            .limit(limit)
            .sort({
                "contribuitions.sentimentsClass": -1
            });
    }

    onceContributors(project) {
        return Promise.props({
            once: Developer.count({
                [`contribuitions.pulls.byProject.data.${project}`]: {
                    $eq: 1
                }
            }),
            moreThanOnce: Developer.count({
                [`contribuitions.pulls.byProject.data.${project}`]: {
                    $gt: 1
                }
            }),
        });
    }
    swbRelevantChange(query) {
        const project = query._project;
        const hour = 2;
        const swbKey = `swb.${hour}.${project}`;
        const filter = {
            [swbKey]: {
                $exists: true
            }
        };
        return Developer.find(filter).lean().then(devs => {
            return {
                2: getSwbReportData(getSwbList(devs, 2, project)),
                4: getSwbReportData(getSwbList(devs, 4, project)),
                8: getSwbReportData(getSwbList(devs, 8, project)),
                16: getSwbReportData(getSwbList(devs, 16, project)),
            }
        });
    }
}

function getSwbReportData(data) {
    const onlyComment = data.filter(swb => swb.entity === 'comment');
    return {
        general: getRelevantChange(onlyComment, () => true),
        positive: getRelevantChange(onlyComment, swb => swb.commentSentiment > 0),
        negative: getRelevantChange(onlyComment, swb => swb.commentSentiment < 0),
    };
}

function getSwbList(devs, hour, project) {
    const swbKey = `swb.${hour}.${project}`;
    return _.map(devs, swbKey)
        .map(dev => Object.keys(dev).map(key => dev[key]))
        .reduce((agg, current) => agg.concat(current), [])
        .reduce((agg, current) => agg.concat(current), []);
}

function getRelevantChange(data, filter) {
    const filteredData = data.filter(filter).filter(filterDetectable);
    const relevantChange = filteredData.filter(filterRelevantChange);
    return {
        total: filteredData.length,
        changed: relevantChange.length,
        percent: relevantChange.length / filteredData.length
    };
}

function filterRelevantChange(swb) {
    return swb.result >= 1 || swb.result <= -1;
}

function filterDetectable(swb) {
    return hasInteraction(swb.swbBeforeComments) && hasInteraction(swb.swbAfterComments);
}

function hasInteraction(swbTime) {
    return Object.keys(swbTime).some(key => swbTime[key] > 0);
}

module.exports = new Reports();
