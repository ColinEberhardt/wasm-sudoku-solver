const indexOfMaxValue = (a, t = i => i) =>
  a.reduce((iMax, x, i, arr) => (t(x) > t(arr[iMax]) ? i : iMax), 0);

const imgWrite = (src, dstCanvas) => {
  const tmp = new cv.Mat(src);
  if (tmp.type() === cv.CV_8UC1) {
    cv.cvtColor(tmp, tmp, cv.COLOR_GRAY2RGBA);
  } else if (tmp.type() === cv.CV_8UC3) {
    cv.cvtColor(tmp, tmp, cv.COLOR_RGB2RGBA);
  }
  const imgData = new ImageData(
    new Uint8ClampedArray(tmp.data),
    tmp.cols,
    tmp.rows
  );
  const ctx = dstCanvas.getContext("2d");
  dstCanvas.width = tmp.cols;
  dstCanvas.height = tmp.rows;
  ctx.putImageData(imgData, 0, 0);
  tmp.delete();
};

const imgRead = (canvas)=> {
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return cv.matFromImageData(imgData)
}

export { indexOfMaxValue, imgRead, imgWrite };
