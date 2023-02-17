chrome.storage.sync.get(['time', 'code'], function(result) {
  console.log('Data retrieved in content script: ', result);
  const code = result.code || '';
  const time = result.time || 3;

  console.log('Saved time:', time);
  console.log('Saved code:', code);

  const urls = code.split('\n').filter((url) => url);
  console.log(urls);
  const currentUrl = window.location.href;
  console.log(currentUrl);

  const match = urls.some((url) => {
    const pattern = new RegExp(url.replace(/\*/g, '[^ ]*'));
    return pattern.test(currentUrl);
  });
  console.log(match);

  if (match) {
    // Add a timer element to the page
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.style.justifyContent = 'center';
    timerElement.style.alignItems = 'center';
    timerElement.style.position = 'flex';
    timerElement.style.display = 'flex';
    timerElement.style.top = '0';
    timerElement.style.left = '0';
    timerElement.style.right = '0';
    timerElement.style.background = 'rgba(242, 242, 242, 0.5)';

    timerElement.style.height = '50px';
    timerElement.style.zIndex = '9999';

    timerElement.innerHTML = `<p style="margin: 0; padding: 0 10px; font-size: 20px;">Closing in: <span id="countdown" style="font-weight: bold;">${time}</span> seconds</p>`;
    document.body.insertBefore(timerElement, document.body.firstChild);

    // Add two buttons to the timer element: "Close Now" and "Cancel"
    const closeButton = document.createElement('button');
    closeButton.style.marginLeft = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.fontSize = '16px';
    closeButton.innerHTML = 'Close Now';
    closeButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({}, function() { });
    });
    timerElement.appendChild(closeButton);

    const cancelButton = document.createElement('button');
    cancelButton.style.marginLeft = '10px';
    cancelButton.style.padding = '5px 10px';
    cancelButton.style.fontSize = '16px';
    cancelButton.innerHTML = 'Cancel';
    cancelButton.addEventListener('click', function() {
      // Cancel the timer
      clearInterval(countdownInterval);
      document.body.removeChild(timerElement);
    });
    timerElement.appendChild(cancelButton);

    // Start the countdown timer
    let countdown = time;
    const countdownInterval = setInterval(function() {
      countdown--;
      document.getElementById('countdown').innerHTML = countdown;
      if (countdown === 0) {
        clearInterval(countdownInterval);
        chrome.runtime.sendMessage({}, function() { });
      }
    }, 1000);
  }
});
