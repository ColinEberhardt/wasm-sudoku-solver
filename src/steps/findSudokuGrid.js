import { indexOfMaxValue } from "./utils.js";

const EPSILON = 10;

const arrayRotate = (arr, count) => {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
};

// takes an array of coordinates and rotate them to that the
// top-right corner comes first
const rotateTopRightFirst = coords => {
  // find the top left coord index.
  const pairs = [];
  for (let i = 0; i < 4; i++) {
    pairs[i] = [coords[i * 2], coords[i * 2 + 1]];
  }
  const bottomRight = indexOfMaxValue(pairs, p =>
    Math.sqrt(p[0] * p[0] + p[1] * p[1])
  );
  if (bottomRight !== 1) {
    const shift = -(1 - bottomRight);
    const newCoords = arrayRotate(coords, shift * 2);
    return newCoords;
  } else {
    return coords;
  }
};

const findSudokuGrid = src => {
  const countourImageBuffer = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

  // detect contours within the image
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    src,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  const color = index =>
    new cv.Scalar(
      (Math.sin(index) + 1.5) * 100,
      (Math.cos(index) + 1.5) * 100,
      0
    );

  // approximates each contour to polygon
  const rectangles = [];
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const approximatedContour = new cv.Mat();
    cv.approxPolyDP(contour, approximatedContour, EPSILON, true);

    // is it a rectangle contour?
    if (approximatedContour.size().height === 4) {
      rectangles.push({
        coord: Array.from(approximatedContour.data32S),
        area: cv.contourArea(approximatedContour)
      });
    }

    cv.drawContours(
      countourImageBuffer,
      contours,
      i,
      color(approximatedContour.size().height),
      1,
      cv.LINE_8,
      hierarchy,
      0
    );

    approximatedContour.delete();
  }

  contours.delete();
  hierarchy.delete();

  if (rectangles.length === 0) {
    return { countourImage: countourImageBuffer };
  }

  // find the largest rectangle
  const idx = indexOfMaxValue(rectangles, r => r.area);
  return {
    coords: rotateTopRightFirst(rectangles[idx].coord),
    countourBuffer: countourImageBuffer
  };
};

export default findSudokuGrid;
