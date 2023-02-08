document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content loaded");

    let defaultUrls = [
        "://zoom.us/postattendee",
        "://zoom.us/j/",
        "://.zoom.us/j/",
        "://zoom.us/s/",
        "://.zoom.us/s/",
        "://.slack.com/archives/",
        "://.webex.com/webappng/sites/*/meeting/info/",
        "://.webex.com/wbxmjs/joinservice/",
        "://teams.microsoft.com/dl/launcher/launcher.html*"
    ];
    let defaultTime = 10;

    // Set defaults
    chrome.storage.sync.set({ code: defaultUrls.join("\n") });
    chrome.storage.sync.set({ time: defaultTime });

    // Show the defaults
    let originalTime, originalCode;
    chrome.storage.sync.get(["time", "code"], function (data) {
        originalTime = data.time;
        originalCode = data.code;

        document.getElementById("time").value = data.time;

        let code = data.code;
        if (code) {
            document.getElementById("textarea").value = code;
            updateLineNumbers();
        }
    });

    function updateLineNumbers() {
        let lineNumbers = document.querySelector(".line-numbers");
        let numberOfLines = textarea.value.split("\n").length;
        lineNumbers.innerHTML = Array(numberOfLines)
            .fill("<span></span>")
            .join("");
    }


    console.log("Attach event listeners")
    let textarea = document.querySelector("#textarea");
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

    let saveBtn = document.getElementById("save");
    let saveCodeBtn = document.getElementById("save-code");
    saveBtn.setAttribute("disabled", "true");
    saveCodeBtn.setAttribute("disabled", "true");
    document.getElementById("time").addEventListener("input", function () {
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


    // Save time value on save button click
    document.getElementById("save").addEventListener("click", function () {
        let time = document.getElementById("time").value;
        chrome.storage.sync.set({ time: time }, function () {
            // Show a feedback to indicate successful save
            let feedback = "Time saved successfully!";
            document.getElementById("feedback").innerHTML = feedback;
        });
    });

    // Save code value on save code button click
    document.getElementById("save-code").addEventListener("click", function () {
        let code = document.getElementById("textarea").value;
        chrome.storage.sync.set({ code: code }, function () {
            document.getElementById("feedback").innerHTML = "Code saved.";
        });
    });

    // Reset time value to default on reset button click
    document.getElementById("reset").addEventListener("click", function () {
        chrome.storage.sync.set({ time: defaultTime }, function () {
            // Show a feedback to indicate successful reset
            let feedback = "Time reset to default successfully!";
            document.getElementById("feedback").innerHTML = feedback;
            // Update the value in the text field
            document.getElementById("time").value = defaultTime;
        });
    });
});