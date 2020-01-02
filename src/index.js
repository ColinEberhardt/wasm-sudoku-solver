import rescale from "./steps/rescale.js";
import threshold from "./steps/threshold.js";
import findSudokuGrid from "./steps/findSudokuGrid.js";
import copyAndProject from "./steps/copyAndProject.js";
import removeGridlines from "./steps/removeGridlines.js";
import renderDigits from "./steps/renderDigits.js";
import mergeImages from "./steps/mergeImages.js";
import { init as initSolverModule, solver } from "./steps/solver.js";
import {
  matchDigits,
  init as initTensorflowModel
} from "./steps/matchDigits.js";

import { imgRead, imgWrite } from "./steps/utils.js";

const videoTargetCanvas = document.getElementById("videoTargetCanvas");
const videoElement = document.getElementById("videoElement");
const tempCanvas = document.getElementById("tempCanvas");
const rangeElement = document.getElementById("range");

const startCamera = async () => {
  await navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode: "environment"
      }
    })
    .then(stream => {
      const videoSettings = stream.getVideoTracks()[0].getSettings();
      videoTargetCanvas.width = videoSettings.width;
      videoTargetCanvas.height = videoSettings.height;
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .catch(function(err) {
      console.log("An error occured! " + err);
    });
};

// creates a square from two points
// a = big, b = 0 - starts top-right
const square = (a, b) => [a, b, a, a, b, a, b, b];

const renderStep = (step, visibleStep, buffer) => {
  if (step === visibleStep) {
    imgWrite(buffer, tempCanvas);
    tempCanvas.style.display = "block";
    videoTargetCanvas.style.display = "none";
  }
};

const run = async (captureFromVideo = true) => {
  if (captureFromVideo) {
    videoTargetCanvas.getContext("2d").drawImage(videoElement, 0, 0);
  }

  tempCanvas.style.display = "none";
  videoTargetCanvas.style.display = "block";
  const showStep = Number(rangeElement.value);

  const imgBuffer = imgRead(videoTargetCanvas);

  // downsize to improve performance of CV processing
  const rescaledBuffer = rescale(imgBuffer, 500);
  threshold(rescaledBuffer);
  renderStep(0, showStep, rescaledBuffer);

  const { coords, countourBuffer } = findSudokuGrid(rescaledBuffer);
  renderStep(1, showStep, countourBuffer);

  if (!coords) {
    console.log("no grid found");
  } else {
    // NOTE: the dimensions of this canvas ensure that each sudoku cell
    // is 20 x 20 which matches the inputs for our digit recognition CNN
    const destCoords = square(180, 0);
    const projectedBuffer = copyAndProject(
      rescaledBuffer,
      coords,
      destCoords,
      new cv.Size(180, 180)
    );
    renderStep(2, showStep, projectedBuffer);

    removeGridlines(projectedBuffer);
    renderStep(3, showStep, projectedBuffer);

    const puzzle = matchDigits(projectedBuffer);
    // console.log(puzzle);

    let solution = solver(puzzle);
    if (solution.length === 0) return;

    solution = [...solution]
      .map((c, i) => (puzzle[i] === "." ? c : " "))
      .join("");
    const digitsBuffer = renderDigits(projectedBuffer, solution);
    renderStep(4, showStep, projectedBuffer);

    const projectedDigitsBuffer = copyAndProject(
      digitsBuffer,
      square(180, -2),
      coords,
      new cv.Size(rescaledBuffer.cols, rescaledBuffer.rows)
    );
    renderStep(4, showStep, projectedDigitsBuffer);

    // upscale to the size of the original
    const rescaledDigitBuffer = rescale(
      projectedDigitsBuffer,
      videoTargetCanvas.width
    );
    renderStep(5, showStep, projectedDigitsBuffer);

    // merge the digits
    mergeImages(rescaledDigitBuffer, videoTargetCanvas);

    projectedBuffer.delete();
    digitsBuffer.delete();
    projectedDigitsBuffer.delete();
    rescaledDigitBuffer.delete();
    countourBuffer.delete();
  }

  rescaledBuffer.delete();
  imgBuffer.delete();
  return;
};

cv["onRuntimeInitialized"] = async () => {
  await initSolverModule();
  await initTensorflowModel();

  const urlParams = new URLSearchParams(window.location.search);
  const testImage = urlParams.get("testImage");
  if (testImage) {
    const img = new Image();
    img.onload = function() {
      videoTargetCanvas.width = img.width;
      videoTargetCanvas.height = img.height;
      const ctx = videoTargetCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      setInterval(() => run(false), 100);
    };
    img.src = testImage;
  } else {
    await startCamera();
    setInterval(run, 100);
  }
};
