const threshold = (src) => {
  // convert to grayscale
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  // apply a threshold
  cv.adaptiveThreshold(src, src, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 10)
};

export default threshold;