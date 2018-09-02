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
    const titles = [];
    let statusCode = 200;
    let lastId = '';
    let uri = `user/${process.env.REDDIT_USER}/saved?limit=100`;

    function getSavedPosts(startingPoint) {
        uri = startingPoint ? uri + '&after=t3_' + startingPoint : uri;
    
        r._get({uri})
            .then(results => {
                _.forEach(results, result => {
                    titles.push(result.title);
                    lastId = result.id;
                })

                if (results.length == 100) {
                    console.log('Polling another page with this id', lastId);
                    getSavedPosts(lastId);
                } else {
                    res.json(statusCode, {"titles": titles});
                }
    
            })
            .catch(console.log)

    };

    getSavedPosts();
}