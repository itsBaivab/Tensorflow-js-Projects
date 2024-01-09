const MODEL_PATH = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4";
const EXAMPLE_IMG = document.getElementById("exampleImg");

let movenet = undefined;


console.count("script.js loaded");

async function loadAndRunModel() {
  movenet = await tf.loadGraphModel(MODEL_PATH, { fromTFHub: true });
  console.log("model loaded");

  let exampleInputTensor = tf.zeros([1, 192, 192, 3],'int32');

  let imageTensor = tf.browser.fromPixels(EXAMPLE_IMG);
  let cropStartPoint = [15,170,0];
  let cropSize = [345,345,3];
  let croppedTensor = tf.slice(imageTensor, cropStartPoint, cropSize);

  let resizedTensor = tf.image.resizeBilinear(croppedTensor, [192, 192],true).toInt();
  // console.log(resizedTensor.shape);
//   console.log(imageTensor.shape);


  
  let tesorOutput = movenet.predict(tf.expandDims(resizedTensor));
  let arrayOutput = await tesorOutput.array();
    console.log(arrayOutput);   

    // console.log("model runned");
  
}

loadAndRunModel();



