var INTERVAL_PERIOD = 200; // ms
var getSponsoredPosts = function() {
  var $sponsoredTags = $('ul.uiStreamHomepage .uiStreamAdditionalLogging');
  // Only return sponsored posts that have not yet been flagged
  return $sponsoredTags.parents('li.uiStreamStory:not(.sponsoredPost)');
};
var announceSponsoredPosts = function(callback) {
  var children;
  window.setInterval(function() {
    $posts = getSponsoredPosts();
    if ($posts.length) {
      callback($posts);
    }
  }, INTERVAL_PERIOD);
};
var injectSponsoredMention = function($post) {
  // Flag sponsored posts so they won't be matched by future searches
  $post.addClass('sponsoredPost');
  // Inject post mention bar with show button that reveals the original post
  $post.prepend(
    '<div class="sponsoredMention">' +
      '<a href="#" class="toggleMention">' +
        '<span class="show">Show ↓</span>' +
        '<span class="hide">Hide ↑</span>' +
      '</a> ' +
      'sponsored post' +
    '</div>'
  );
  var $sponsoredMention = $post.find('.sponsoredMention');
  $sponsoredMention.find('.toggleMention').click(function(e) {
    e.preventDefault();
    $post.toggleClass('revealedSponsoredPost');
  });
  // Add reference to sponsored subject
  var subjectAnchor = $post.find('.actorName a:first');
  if (!subjectAnchor.length) {
    subjectAnchor = $post.find('.uiAttachmentTitle a:first');
  }
  if (subjectAnchor.length) {
    $sponsoredMention.append(' from ');
    subjectAnchor.clone().appendTo($sponsoredMention);
  }
};
$.fn.hideSponsoredPost = function() {
  $(this).each(function(i, post) {
    injectSponsoredMention($(this));
  });
};
var totalCount = 0;
// Since there wasn't any obvious way to listen to news feed changes, we had
// to resort to a basic interval for checking whenever new items are loaded
// within the feed
announceSponsoredPosts(function($posts) {
  totalCount += $posts.length;
  console.log('Hid ' + $posts.length + ' more sponsored post. ' + totalCount + ' posts hidden so far.');
  $posts.hideSponsoredPost();
});