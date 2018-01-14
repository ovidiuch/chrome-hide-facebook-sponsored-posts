var INTERVAL_PERIOD = 500; // ms

var hideSuggestedPosts_apply = function() {
  var PARENT_CSS_MATCHER = "div[role*='article']";

  // only operate on the home page
  if(window.location.pathname != "/") { return; }

  function hide(selector, originalHtml) {
    console.groupCollapsed("Hidden content");
    console.log(originalHtml);
    console.groupEnd();
    return "<div class='hiddenPost'>&nbsp;</div>";
  }

  if(window.hideSuggestedPosts_hideLikes) {
    $("span:contains(' likes ')").parents(PARENT_CSS_MATCHER).html(hide).fadeOut(150);
    $("span:contains(' like ')").parents(PARENT_CSS_MATCHER).html(hide).fadeOut(150);
  }
  if(window.hideSuggestedPosts_hideEventLikes) {
    $("span:contains(' is interested in ')").parents(PARENT_CSS_MATCHER).html(hide).fadeOut(150);
  }
  if(window.hideSuggestedPosts_hideShares) {
    $("span:contains(' shared ')").parents(PARENT_CSS_MATCHER).html(hide).fadeOut(150);
  }

  // hide page suggestions — FB is using image sprites for sponsored labels on these
  // so we need to look for something else. In this case, the PageLineButton is the clue.
  $("button[class*=PageLikeButton]").parents(PARENT_CSS_MATCHER).html(hide).fadeOut(150)

  var feedContent = $(PARENT_CSS_MATCHER),
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
      $(el).fadeOut(150);
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
