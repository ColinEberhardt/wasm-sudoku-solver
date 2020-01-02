// width of the gridlines in pixels
const GRID_STROKE = 4;

const removeGridlines = buffer => {
  const width = buffer.cols;
  const white = new cv.Scalar(255, 255, 255, 255);
  for (let i = 0; i <= 9; i++) {
    const pos = Math.floor((i * (width - GRID_STROKE)) / 9);
    let roi = buffer.roi(new cv.Rect(pos, 0, GRID_STROKE, width));
    roi.setTo(white);
    roi.delete();
    roi = buffer.roi(new cv.Rect(0, pos, width, GRID_STROKE));
    roi.setTo(white);
    roi.delete();
  }
};

export default removeGridlines;
