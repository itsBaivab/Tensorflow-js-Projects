const status = document.getElementById('status');
if (status) {
  status.innerText = 'Loaded TensorFlow.js - version: ' + tf.version.tfjs;
}

const MODEL_PATH = 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/sqftToPropertyPrice/model.json';

let model = undefined;
console.log('Loading model...');
async function loadModel() {
  model = await tf.loadLayersModel(MODEL_PATH);
  model.summary();
  console.log('Model loaded');

  // Create a single input.
  const input = tf.tensor2d([870]);

  // Create a Batch of 3
  const inputBatch = tf.tensor2d([[500], [1100], [970]]);

  // Actually make the predictions for each batch.
  const result = model.predict(input);
  const resultBatch = model.predict(inputBatch);

  // Print the results.
  result.print();
  resultBatch.print();
  console.log('Prediction done');

  // Dispose of tensors and model when done.
  input.dispose();
  inputBatch.dispose();
  result.dispose();
  resultBatch.dispose();
  model.dispose();
}
