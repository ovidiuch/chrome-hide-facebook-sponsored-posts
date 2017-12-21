var INTERVAL_PERIOD = 750; // ms

var hideSuggestedPosts_apply = function() {
  // only operate on the home page
  if(window.location.pathname != "/") { return; }

  function hide(selector, originalHtml) {
    var h = encodeURIComponent(originalHtml);
      return "<div class='hiddenPost' data-original-html='" + h + "'>&nbsp;</div>";
  }

  if(window.hideSuggestedPosts_hideLikes) {
    $("span:contains(' likes ')").parents('.userContentWrapper').html(hide);
    $("span:contains(' like ')").parents('.userContentWrapper').html(hide);
  }
  if(window.hideSuggestedPosts_hideEventLikes) {
    $("span:contains(' is interested in ')").parents('.userContentWrapper').html(hide);
  }
  if(window.hideSuggestedPosts_hideShares) {
    $("span:contains(' shared ')").parents('.userContentWrapper').html(hide);
  }

  var feedContent = $(".userContentWrapper"),
      regexps = [];

  window.hideSuggestedPosts_keywords.forEach(function(keyword) {
    regexps.push(new RegExp(keyword.trim(), 'i'));
  });

  feedContent.each(function(i,el) {
    var html = el.innerHTML,
        shouldHide = false;

    regexps.forEach(function(regexp) {
      if(html.match(regexp)) {
        shouldHide = true;
      }
    });

    if(shouldHide) {
      el.innerHTML = hide(i, html);
    }
  });
};

chrome.storage.sync.get({
    keywords: null,
    hideShares: false,
    hideLikes: false,
    hideEventLikes: false
  }, function(items) {
    if(items.keywords) {
      window.hideSuggestedPosts_keywords = items.keywords.split(/[\s,;]+/);
    } else {
      window.hideSuggestedPosts_keywords = [];
    }
    window.hideSuggestedPosts_keywords.push('Suggested Post');
    window.hideSuggestedPosts_keywords.push('Sponsored');
    window.hideSuggestedPosts_hideShares = items.hideShares;
    window.hideSuggestedPosts_hideLikes = items.hideLikes;
    window.hideSuggestedPosts_hideEventLikes = items.hideEventLikes;
  });

window.setInterval(hideSuggestedPosts_apply, INTERVAL_PERIOD);
