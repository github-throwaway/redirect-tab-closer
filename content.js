import { defaultUrls, defaultTime } from "./options.js";
chrome.storage.sync.get(["time", "code"], function (result) {
  console.log("Data retrieved in content script: ", result);
  const code = result.code || defaultUrls.join("\n");
  const time = result.time || defaultTime;

  console.log("Saved time:", time);
  console.log("Saved code:", code);

  const urls = code.split("\n").filter((url) => url);
  console.log(urls);
  const currentUrl = window.location.href;
  console.log(currentUrl);

  const match = urls.some((url) => {
    const pattern = new RegExp(url.replace(/\*/g, "[^ ]*"));
    return pattern.test(currentUrl);
  });
  console.log(match);

  if (match) {
    // Add a timer element to the page
    const timerElement = document.createElement("div");
    timerElement.id = "timer";
    timerElement.innerHTML = `<p class="countdown-title">Closing in: <span id="countdown" class="seconds">${time}</span> seconds</p>`;
    document.body.insertBefore(timerElement, document.body.firstChild);

    // Add two buttons to the timer element: "Close Now" and "Cancel"
    const closeButton = document.createElement("button");
    closeButton.id = "closeBtn";
    closeButton.innerHTML = "Close Now";
    closeButton.addEventListener("click", function () {
      chrome.runtime.sendMessage({}, function () {});
    });
    timerElement.appendChild(closeButton);

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancelBtn";
    cancelButton.innerHTML = "Cancel";
    cancelButton.addEventListener("click", function () {
      // Cancel the timer
      clearInterval(countdownInterval);
      document.body.removeChild(timerElement);
    });
    timerElement.appendChild(cancelButton);

    // Start the countdown timer
    let countdown = time;
    const countdownInterval = setInterval(function () {
      countdown--;
      document.getElementById("countdown").innerHTML = countdown;
      if (countdown === 0) {
        clearInterval(countdownInterval);
        chrome.runtime.sendMessage({}, function () {});
      }
    }, 1000);
  }
});
