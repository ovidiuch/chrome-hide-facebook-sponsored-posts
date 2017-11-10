var INTERVAL_PERIOD = 500; // ms

var hideSuggestedPosts = function() {
  $("span:contains('Suggested Post')").parents('.userContentWrapper').html("<div class='hiddenPost'>&nbsp;</div>");
  $("span:contains('Sponsored')").parents('.userContentWrapper').html("<div class='hiddenPost'>&nbsp;</div>");
};

window.setInterval(hideSuggestedPosts, INTERVAL_PERIOD);
