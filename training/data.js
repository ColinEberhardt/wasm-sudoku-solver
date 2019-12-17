/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

// import * as tf from '@tensorflow/tfjs';

const WIDTH = 20,
  HEIGHT = 20;
const IMAGE_SIZE = WIDTH * HEIGHT;
const NUM_CLASSES = 11;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

export class MnistData {
  load() {}

  createDigit(number) {
    const angle = (Math.random() - 0.5) / 10;
    const p = val => val + (Math.random() - 0.5) * 2;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.font =
      `${p(16)}px ` +
      ["san serif", "arial", "Times", "Helvetica", "Georgia", "Tahoma", "Verana"][
        Math.floor(Math.random() * 7)
      ];
    ctx.textBaseline = "top";

    ctx.fillStyle = "black";

    ctx.translate(10, 10);
    ctx.rotate(angle);
    ctx.translate(-10, -10);

    if (number < 10) {
      ctx.fillText(number, p(6), p(3));
    }

    ctx.translate(10, 10);
    ctx.rotate(-angle);
    ctx.translate(-10, -10);

    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    const buffer = new Float32Array(IMAGE_SIZE);

    for (let j = 0; j < imageData.data.length / 4; j++) {
      buffer[j] = imageData.data[j * 4] / 255;
    }

    return buffer;
  }

  nextTestBatch(batchSize) {
    const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
    const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

    for (let i = 0; i < batchSize; i++) {
      const number = Math.floor(Math.random() * 11);
      const digit = this.createDigit(number);
      batchImagesArray.set(digit, i * IMAGE_SIZE);

      const label = new Array(NUM_CLASSES).fill(0);
      label[number] = 1;
      batchLabelsArray.set(label, i * NUM_CLASSES);
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

    return { xs, labels };
  }

  nextTrainBatch(batchSize) {
    return this.nextTestBatch(batchSize);
  }
}
