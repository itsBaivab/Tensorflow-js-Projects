let isSlouching = false;

async function loadMoveNetModel() {
  const model = await tf.loadGraphModel("https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4/model.json", { fromTFHub: true });
  return model;
}

async function detectSlouch(model) {
  const video = document.createElement("video");
  document.body.appendChild(video);

  const stream = await navigator.mediaDevices.getUserMedia({ 'video': {} });
  video.srcObject = stream;

  await video.play();

  const pose = await model.estimateSinglePose(video);
  const nose = pose.keypoints.find(point => point.part === 'nose');

  if (nose && nose.position.y > window.innerHeight / 2) {
    isSlouching = true;
    chrome.runtime.sendMessage({ action: "updateSlouchStatus", isSlouching });
  } else {
    isSlouching = false;
    chrome.runtime.sendMessage({ action: "updateSlouchStatus", isSlouching });
  }

  video.srcObject.getTracks().forEach(track => track.stop());
  video.remove();
}

const moveNetModel = loadMoveNetModel();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getSlouchStatus") {
    sendResponse({ isSlouching });
  } else if (request.action === "applyBlur") {
    // Implement blur logic here
    document.body.style.filter = "blur(5px)";
  } else if (request.action === "removeBlur") {
    document.body.style.filter = "none";
  }
});

moveNetModel.then(model => detectSlouch(model));
