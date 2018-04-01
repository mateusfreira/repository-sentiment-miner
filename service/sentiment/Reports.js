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
    console.log($match)
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
}

module.exports = new Reports();
