// resizes the given image, maintaining the aspect ration
const rescale = (src, targetWidth) => {
  const dst = new cv.Mat();
  const srcSize = src.size();
  const dstSize = new cv.Size(
    targetWidth,
    (srcSize.height * targetWidth) / srcSize.width
  );
  cv.resize(src, dst, dstSize);
  return dst;
};

export default rescale;
