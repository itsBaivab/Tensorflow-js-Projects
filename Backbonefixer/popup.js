let isSlouching = false;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getSlouchStatus" }, function (response) {
    if (response && response.isSlouching) {
      document.getElementById("slouch-status").innerText = "Slouching";
      isSlouching = true;
    }
  });
});

document.getElementById("toggle-blur").addEventListener("click", function () {
  isSlouching = !isSlouching;
  const action = isSlouching ? "applyBlur" : "removeBlur";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action });
  });
  document.getElementById("slouch-status").innerText = isSlouching ? "Slouching" : "Not slouching";
});
