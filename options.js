document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content loaded");
  let originalTime;
  let originalCode;

  const defaultUrls = [
    "*://*zoom.us/postattendee",
    "*://*.zoom.us/j/*",
    "*://*zoom.us/s/*",
    "*://*.zoom.us/s/*",
    "*://*.slack.com/archives/*",
    "*://*.webex.com/webappng/sites/*/meeting/info/*",
    "*://*.webex.com/wbxmjs/joinservice/*",
    "*://*teams.microsoft.com/dl/launcher/launcher.html*",
  ];
  const defaultTime = 10;

  // Set defaults
  chrome.storage.sync.set({ code: defaultUrls.join("\n") });
  chrome.storage.sync.set({ time: defaultTime });

  // Show the defaults
  chrome.storage.sync.get(["time", "code"], function (data) {
    originalTime = data.time;
    originalCode = data.code;
    timer.value = data.time;

    if (originalCode) {
      document.getElementById("textarea").value = originalCode;
      updateLineNumbers();
    }
  });

  function updateLineNumbers() {
    const lineNumbers = document.querySelector(".line-numbers");
    const numberOfLines = textarea.value.split("\n").length;
    lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
  }

  console.log("Attach event listeners");
  const textarea = document.querySelector("#textarea");
  textarea.addEventListener("keyup", (event) => {
    updateLineNumbers();
  });

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value =
        textarea.value.substring(0, start) +
        "\t" +
        textarea.value.substring(end);

      event.preventDefault();
    }
  });

  const saveBtn = document.getElementById("save");
  const saveCodeBtn = document.getElementById("save-code");
  const resetBtn = document.getElementById("reset");
  const timer = document.getElementById("time");

  saveBtn.setAttribute("disabled", "true");
  saveCodeBtn.setAttribute("disabled", "true");
  resetBtn.setAttribute("disabled", "true");

  timer.addEventListener("input", function () {
    if (originalTime !== this.value) {
      saveBtn.removeAttribute("disabled");
    } else {
      saveBtn.setAttribute("disabled", "true");
    }
  });

  textarea.addEventListener("input", function () {
    if (originalCode !== this.value) {
      saveCodeBtn.removeAttribute("disabled");
    } else {
      saveCodeBtn.setAttribute("disabled", "true");
    }
  });

  function toggleFeedbackBlock(feedback) {
    feedback.style.display = "block";
    setTimeout(function () {
      feedback.style.display = "none";
    }, 5000);
  }

  // Save time value on save button click
  saveBtn.addEventListener("click", function () {
    const time = timer.value;
    chrome.storage.sync.set({ time: time }, function () {
      // Show a feedback to indicate successful save
      saveBtn.setAttribute("disabled", "true");
      resetBtn.removeAttribute("disabled");
      toggleFeedbackBlock(document.getElementById("feedback-success"));
    });
  });

  // Save code value on save code button click
  saveCodeBtn.addEventListener("click", function () {
    const code = document.getElementById("textarea").value;
    chrome.storage.sync.set({ code: code }, function () {
      toggleFeedbackBlock(document.getElementById("feedback-success"));
    });
  });

  // Reset time value to default on reset button click
  resetBtn.addEventListener("click", function () {
    chrome.storage.sync.set({ time: defaultTime }, function () {
      // Show a feedback to indicate successful reset
      // Update the value in the text field
      timer.value = defaultTime;
      resetBtn.setAttribute("disabled", "true");
      toggleFeedbackBlock(document.getElementById("feedback-reset"));
    });
  });
});
