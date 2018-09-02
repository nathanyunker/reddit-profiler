module.exports = function(app) {
  let reddit = require('../controllers/redditController');

  app.route('/reddit-profiler/posts/saved')
    .get(reddit.get_saved_posts)
};
