// open links in new tab
document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});




// http://dana.land/articles/send-session-cookies-using-a-chrome-extension
// https://www.gmass.co/blog/send-cookie-cross-origin-xmlhttprequest-chrome-extension/
$.ajax({
  url: "http://localhost:8080/auth/user",
  type: "GET",
  xhrFields: {
    withCredentials: true
  },
}).done((resp) => {
  console.log(resp);
  if (resp.user !== null) {
    $("#loginLink").hide()
    $("#currentUserDisplay").text(`Logged in as ${resp.user.name}`)
  }
})