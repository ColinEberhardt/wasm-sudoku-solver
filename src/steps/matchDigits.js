import { indexOfMaxValue } from "./utils.js";

const TOTAL_CELLS = 9 * 9;
const IMAGE_WIDTH = 180;

let model;

const init = async () => {
  // await tf.setBackend("wasm");
  model = await tf.loadLayersModel("./training/my-model-3.json");
};

const getImageData = (src, x, y, width) => {
  const buffer = new Float32Array(width * width);
  let j = 0;
  for (let iy = y; iy < y + width; iy++) {
    for (let ix = x; ix < x + width; ix++) {
      buffer[j++] = src.data[ix + iy * IMAGE_WIDTH] / 255;
    }
  }
  return buffer;
};

const matchDigits = src => {
  const cellWidth = src.cols / 9;
  const cellSize = cellWidth * cellWidth;

  // extract the image data for each cell
  const testDataArray = new Float32Array(src.cols * src.rows);
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const x = (i % 9) * cellWidth,
      y = Math.floor(i / 9) * cellWidth;
    const buffer = getImageData(src, x, y, cellWidth);
    testDataArray.set(buffer, i * cellSize);
  }

  // create a tensor that contains the data for all our cells
  const testTensor = tf.tensor2d(testDataArray, [TOTAL_CELLS, cellSize]);
  const reshaped = testTensor.reshape([TOTAL_CELLS, cellWidth, cellWidth, 1]);

  // make our prediction
  const prediction = model.predict(reshaped).dataSync();

  let result = "";
  for (let i = 0; i < TOTAL_CELLS; i++) {
    // obtain the 11 predicted states of this cell
    const cellPrediction = Array.from(prediction).slice(i * 11, i * 11 + 11);
    const digit = indexOfMaxValue(cellPrediction);
    result += digit < 10 ? digit : ".";
  }
  return result;
};

export { matchDigits, init };
