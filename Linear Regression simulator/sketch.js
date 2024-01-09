let x_vals = [];
let y_vals = [];

let m, b;

const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function setup() {
  createCanvas(800, 400);
  m = tf.variable(tf.scalar(random(1)));
  b = tf.variable(tf.scalar(random(1)));
}

function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function predict(x) {
  const xs = tf.tensor1d(x);
  const ys = xs.mul(m).add(b);
  return ys;
}

function mousePressed() {
  let x = map(mouseX, 0, width, 0, 1);
  let y = map(mouseY, 0, height, 1, 0);
  x_vals.push(x);
  y_vals.push(y);
}

function draw() {
  tf.tidy(() => {
    if (x_vals.length > 0) {
      const ys = tf.tensor1d(y_vals);
      optimizer.minimize(() => loss(predict(x_vals), ys));
    }
  });

  background(0);

  // Draw grid
  stroke(50);
  strokeWeight(1);
  for (let i = 1; i < 10; i++) {
    // Vertical lines
    line(i * width / 10, 0, i * width / 10, height);
    // Horizontal lines
    line(0, i * height / 10, width, i * height / 10);
  }

  // Draw animated points
  noStroke();
  fill(200, 100, 100);
  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], 0, 1, 0, width);
    let py = map(y_vals[i], 0, 1, height, 0);
    ellipse(px, py, 16, 16);

    // Display coordinates near the points
    fill(255);
    text(`(${x_vals[i].toFixed(2)}, ${y_vals[i].toFixed(2)})`, px + 10, py - 10);
  }

  // Draw regression line
  const lineX = [0, 1];
  const ys = tf.tidy(() => predict(lineX));
  let lineY = ys.dataSync();
  ys.dispose();

  let x1 = map(lineX[0], 0, 1, 0, width);
  let x2 = map(lineX[1], 0, 1, 0, width);

  let y1 = map(lineY[0], 0, 1, height, 0);
  let y2 = map(lineY[1], 0, 1, height, 0);

  strokeWeight(2);
  stroke(255, 200, 100);
  line(x1, y1, x2, y2);

  // Display the equation of the line
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(`y = ${m.dataSync()[0].toFixed(2)}x + ${b.dataSync()[0].toFixed(2)}`, 10, height - 10);
}
