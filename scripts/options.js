function save_options() {
  var keywords = document.getElementById('keywords').value,
      hideShares = document.getElementById('shares').checked,
      hideLikes = document.getElementById('likes').checked,
      hideEventLikes = document.getElementById('eventlikes').checked;

  chrome.storage.sync.set({
    keywords: keywords,
    hideShares: hideShares,
    hideLikes: hideLikes,
    hideEventLikes: hideEventLikes
  }, function() {
    $("#status")[0].innerHTML = "Options saved.";
    $("#status").fadeIn(400);
    setTimeout(function() {
      $("#status").fadeOut(1000);
    }, 2000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    keywords: null,
    hideShares: false,
    hideLikes: false,
    hideEventLikes: false
  }, function(items) {
    if(items.keywords) {
      $("#keywords").val(items.keywords);
    }
    $("#shares")[0].checked = items.hideShares;
    $("#likes")[0].checked = items.hideLikes;
    $("#eventlikes")[0].checked = items.hideEventLikes;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
