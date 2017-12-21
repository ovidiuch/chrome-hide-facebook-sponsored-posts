var INTERVAL_PERIOD = 750; // ms

var hideSuggestedPosts_apply = function() {
  // only operate on the home page
  if(window.location.pathname != "/") { return; }

  function hide(selector, originalHtml) {
    console.groupCollapsed("Hidden content");
    console.log(originalHtml);
    console.groupEnd();
    return "<div class='hiddenPost'>&nbsp;</div>";
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

  // hide page suggestions — FB is using image sprites for sponsored labels on these
  // so we need to look for something else. In this case, the PageLineButton is the clue. 
  $("button[class*=PageLikeButton]").parents('.userContentWrapper').html(hide)

  var feedContent = $(".userContentWrapper"),
      keywordRegexps = [],
      regexps = [/Suggested Post/, /Sponsored/];

  window.hideSuggestedPosts_keywords.forEach(function(keyword) {
    keyword = keyword.trim();
    if(keyword.length > 0) {
      // custom keywords become case-insensitive filters
      regexps.push(new RegExp(keyword, 'i'));
    }
  });

  feedContent.each(function(i,el) {
    var html = el.innerHTML,
        shouldHide = false;

    keywordRegexps.forEach(function(r) {
      if(html.match(r)) {
        shouldHide = true;
      }
    });

    regexps.forEach(function(r) {
      if(html.match(r)) {
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
    window.hideSuggestedPosts_hideShares = items.hideShares;
    window.hideSuggestedPosts_hideLikes = items.hideLikes;
    window.hideSuggestedPosts_hideEventLikes = items.hideEventLikes;
  });

window.setInterval(hideSuggestedPosts_apply, INTERVAL_PERIOD);
