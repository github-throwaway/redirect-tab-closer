document.getElementById("save").addEventListener("click", function () {
    let time = document.getElementById("time").value;
    chrome.storage.sync.set({ time: time }, function () {
        // Show a feedback to indicate successful save
        let feedback = "Time saved successfully!";
        document.getElementById("feedback").innerHTML = feedback;
    });
});

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("save-code").addEventListener("click", function () {
        let code = document.getElementById("textarea").value;
        console.log(code)
        chrome.storage.sync.set({ code: code }, function () {
            document.getElementById("feedback").innerHTML = "Code saved.";
        });
    });
});

document.getElementById("reset").addEventListener("click", function () {
    let defaultTime = 3;
    chrome.storage.sync.set({ time: defaultTime }, function () {
        // Show a feedback to indicate successful reset
        let feedback = "Time reset to default successfully!";
        document.getElementById("feedback").innerHTML = feedback;
        // Update the value in the text field
        document.getElementById("time").value = defaultTime;
    });
});

// Show the saved time in the text field
chrome.storage.sync.get("time", function (data) {
    document.getElementById("time").value = data.time;
});

chrome.storage.sync.get("code", function (data) {
    document.getElementById("textarea").value = data.code;
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded")
    let textarea = document.querySelector("#textarea");
    const lineNumbers = document.querySelector(".line-numbers");
    chrome.storage.sync.get("code", function (data) {
        let numberOfLines = data.code.split("\n").length;
        console.log(numberOfLines)
        lineNumbers.innerHTML = Array(numberOfLines)
            .fill("<span></span>")
            .join("");
    });

    textarea.addEventListener("keyup", (event) => {
        updateLineNumbers();
    });

    function updateLineNumbers() {
        let numberOfLines = textarea.value.split("\n").length;
        lineNumbers.innerHTML = Array(numberOfLines)
            .fill("<span></span>")
            .join("");
    }

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
});