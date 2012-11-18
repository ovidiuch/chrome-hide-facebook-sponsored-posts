var INTERVAL_PERIOD = 50; // ms
var getHomepageList = function() {
  return $('ul.uiStreamHomepage');
};
var getSponsoredPosts = function(list) {
  var sponsoredTags = list.find('.uiStreamAdditionalLogging');
  return sponsoredTags.parents('li.uiStreamStory');
};
var announceSponsoredPosts = function(list, callback) {
  var children;
  window.setInterval(function() {
    posts = getSponsoredPosts(list);
    if (posts.length) {
      callback(posts, posts.length);
    }
  }, INTERVAL_PERIOD);
};
$(function() {
  var totalCount = 0;
  // Since there wasn't any obvious way to listen to news feed changes, we had
  // to resport to a basic interval for checking whenever new items are loaded
  // within the feed
  announceSponsoredPosts(getHomepageList(), function(posts, count) {
    totalCount += count;
    console.log('Hid ' + count + ' more sponsored post. ' + totalCount + ' posts hidden so far.');
    posts.remove();
  });
});