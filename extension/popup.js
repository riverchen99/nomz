// open links in new tab
document.addEventListener('DOMContentLoaded', () => {
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i += 1) {
    // eslint complains if we use the word "chrome"...
    (function () { // eslint-disable-line
      const ln = links[i];
      const location = ln.href;
      ln.onclick = function () {
        chrome.tabs.create({ active: true, url: location }); // eslint-disable-line
      };
    }());
  }
});


// http://dana.land/articles/send-session-cookies-using-a-chrome-extension
// https://www.gmass.co/blog/send-cookie-cross-origin-xmlhttprequest-chrome-extension/
$.ajax({
  url: 'https://cs130-nomz.herokuapp.com/auth/user',
  type: 'GET',
  xhrFields: {
    withCredentials: true,
  },
}).done((resp) => {
  console.log(resp);
  if (resp.user !== null) {
    $('#loginLink').hide();
    $('#currentUserDisplay').text(`Logged in as ${resp.user.name}`);
  }
});
