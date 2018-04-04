const _ = require("lodash");
const moment = require("moment");
const models = require("../../model/mongo/index.js");
const Pull = models.Pull;
const Commits = models.Commit;
const PullReviews = models.PullReviews;
const PullComments = models.PullComments;
const Developer = models.Developer;
const sentimentProperty = "sentistrength_new.wholeText.whole_text.scale";
const baseSentiment = {
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
    '0': 0,
    '-4': 0,
    '-3': 0,
    '-2': 0,
    '-1': 0,
};
const avg = (data) => {
    return _.sum(data) / data.length;
}
const std = (data) => {
    const _avg = avg(data);
    return Math.sqrt(_.sum(_.map(data, (i) => Math.pow((i - _avg), 2))) / data.length);
};
const sortCriteria = {
    "created_at": 1
};
const aggInteraction = (model, propertyName, dev) => model.find(devQuery(dev))
    .lean()
    .sort(sortCriteria)
    .then((interaction) => statsInteractions(interaction, propertyName, dev));

const buildStats = (data, isSentiment) => {
    const result = {
        max: _.max(data),
        min: _.min(data),
        avg: avg(data),
        std: std(data),
        sum: _.sum(data)
    };
    if (isSentiment) {
        result.negative = _.filter(data, d => d < 0).length;
        result.positive = _.filter(data, d => d > 0).length;
        result.neutral = _.filter(data, d => d === 0).length;
        result.count = data.length;
        result.percent_positive = result.positive / result.count;
        result.percent_negative = result.negative / result.count;
        result.percent_neutral = result.neutral / result.count;
        const setimentGroups = _.extend(_.clone(baseSentiment), _.chain(data)
            .map(n => (n && n.toString()) || '0')
            .groupBy()
            .mapValues('length')
            .value());
        _.assign(result, setimentGroups);
        result.sentimentsClass = _.chain(setimentGroups).values().filter(_ => _ > 0).value().length;
    }
    return result;
};
const statsInteractions = (interactions, name, dev) => {
    if (!_.isArray(interactions)) return {
        error: true
    };
    const byProject = _.chain(interactions).groupBy("_project").value();
    _.set(dev, `contribuitions.${name}`, {});
    const interaction = _.get(dev, `contribuitions.${name}`);
    interaction.general = buildStats([interactions.length]);
    interaction.byProject = buildStats(_.chain(byProject).values().map('length').value());
    interaction.byProject.data = _.mapValues(byProject, 'length');
    interaction.sentiment = {
        geral: buildStats(_.map(interactions, sentimentProperty), true),
        byProject: _.mapValues(byProject, interactions => buildStats(_.map(interactions, sentimentProperty, true))),
    };

    interaction.timing = {};
    if (interactions.length > 1) {
        const dates = interactions.map(i => {
            return i.created_at ? new Date(i.created_at) : moment(_.get(i, "commiter.date"), "ddd, DD MMM YYYY HHmmss ZZ").toDate()
        });
        const intervals = dates.map((d, i) => i === 0 ? 0 : d.getTime() - dates[i - 1].getTime()).filter(i => i !== 0);
        interaction.timing.intervals = buildStats(intervals);
    }
    return dev;

};
const devQuery = dev => {
    return {
        fromGitHub: {
            "$exists": false
        },
        $or: [{
            "user.login": dev.value.login
        }, {
            "author.login": dev.value.login
        }]
    };
};

const saveDeveloper = (dev) => {
    return new Promise((resolve, reject) => Developer.collection.update({
        "value.login": dev.value.login
    }, {
        $set: dev
    }, (e) => {
        if (e) return reject(e);
        else resolve(true);
    })).then(console.log);
};

async function processProfiles(page, perPage) {
    page = page || 0;
    perPage = perPage || 100;

    console.log(`Started ${page}, ${perPage}`);
    return Developer.find({
            processed: {
                $exists: false
            }
        }).limit(perPage)
        .skip(perPage * page)
        .sort({
            _id: 'asc'
        })
        .lean()
        .then((developers) => {
            return Promise.all(_.map(developers, (dev) => {
                console.log('processing:', dev.value.login);
                const pullPromise = aggInteraction(Pull, "pulls", dev);
                const commentsPromise = aggInteraction(PullComments, "comments", dev);
                const reviwesPromise = aggInteraction(PullReviews, "reviews", dev);
                const commitsPromise = aggInteraction(Commits, "commits", dev); //it is fine now 
                return Promise.all([pullPromise, reviwesPromise, commentsPromise, commitsPromise]).then(() => {
                    const interactions = ["pulls", "comments", "reviews"];
                    const allProjects = interactions.reduce((obj, interaction) => {
                        const interactionDataKey = `contribuitions.${interaction}`;
                        const interactionData = _.get(dev, interactionDataKey);
                        const byProject = _.get(interactionData, 'byProject.data', {});
                        _.set(interactionData, 'project_count', _.keys(byProject).length);
                        return _.assign(obj, byProject);
                    }, {});
                    dev.contribuitions.projects = _.keys(allProjects);
                    dev.contribuitions.project_count = dev.contribuitions.projects.length;
                    dev.contribuitions.sentiment = _.chain(dev.contribuitions)
                        .map("sentiment.geral")
                        .filter(_.identity)
                        .map(_.partialRight(_.pick, _.keys(baseSentiment)))
                        .reduce((a, c) => {
                            _.chain(c).keys().forEach((key) => {
                                if (!a[key]) a[key] = 0;
                                a[key] += c[key];
                            }).value();
                            return a;
                        })
                        .value();
                    dev.contribuitions.sentimentsClass = _.chain(dev.contribuitions.sentiment)
                        .values()
                        .filter(v => v > 0)
                        .value().length;
                    console.log(`Finishing the developer ${dev.value.login}`);
                    dev.processed = true;
                    return saveDeveloper(dev);
                })
            })).catch(console.error).then(() => developers)
        }).then((developers) => {
            if (developers.length != 0) {
                return processProfiles(++page, perPage);
            }
        }).then(() => {
            console.log("Success \o/");
        }).catch((e) => {
            console.error("Error :(", e);
        });
}

module.exports.processDevelopersProfile = processProfiles;
