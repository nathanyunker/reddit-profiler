require('dotenv').config();
const Snoowrap = require('snoowrap');
const _ = require('lodash');

// Build Snoowrap and Snoostorm clients
const r = new Snoowrap({
    userAgent: 'reddit-profiler',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

exports.get_saved_posts = function(req, res) {
    const savedPosts = {};
    let statusCode = 200;
    let baseUri = `user/${process.env.REDDIT_USER}/saved?limit=100`;

    function getSavedPosts(startingPoint) {
        let uri = startingPoint ? baseUri + '&after=t3_' + startingPoint : baseUri;
    
        r._get({uri})
            .then(results => {
                _.forEach(results, result => {
                    const post = {
                        title: result.title,
                        subreddit: result.subreddit.display_name,
                        author: result.author.name,
                        permalink: result.permalink,
                        url: result.url
                    };

                    let subreddit = result.subreddit.display_name;
                    savedPosts[subreddit] = savedPosts[subreddit] || {};
                    savedPosts[subreddit][result.author.name] = post;
                })

                if (results.length == 100) {
                    console.log('Polling another page with this id', _.last(results).id);
                    getSavedPosts(_.last(results).id);
                } else {
                    res.json(statusCode, {"saved_posts": savedPosts});
                }
    
            })
            .catch(console.log)

    };

    getSavedPosts();
}