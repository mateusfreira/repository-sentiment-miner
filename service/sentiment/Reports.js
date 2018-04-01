const config = require('config');
const Promise = require('bluebird');
const models = require("../../model/mongo/index.js");
const Developer = models.Developer;
const Pull = models.Pull;
const Project = models.Project;
const PullComments = models.PullComments;
const PullReviews = models.PullReviews;
const Commit = models.Commit;

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

function dayOfWeekSentiment(filter = {}) {
    return PullComments.aggregate(
        [{
                $match: filter,
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
        return Promise.all([
            dayOfWeekSentiment(Object.assign(filter, positiveFilter)), 
            dayOfWeekSentiment(Object.assign(filter, neutralFilter)),
            dayOfWeekSentiment(Object.assign(filter, negativeFilter))
        ]).spread((positive, neutral, nevative) => Object.assign({}, {
            positive,
            neutral,
            nevative
        }));
    }

    sentimentByType(filter = {}) {
        return Promise.props({
            pull: countSentimentByEntity(Pull, filter),
            comments: countSentimentByEntity(PullComments, filter),
            reviews: countSentimentByEntity(PullReviews, filter),
            commits: countSentimentByEntity(Commit, filter)
        });
    }
}

module.exports = new Reports();
