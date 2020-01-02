const copyAndProject = (src, srcCoords, dstCoords, dstSize) => {
  // TODO: make this a grayscale buffer
  const dst = cv.Mat.zeros(dstSize.width, dstSize.height, cv.CV_8UC3);

  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, srcCoords);
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, dstCoords);
  const perspectiveTransform = cv.getPerspectiveTransform(srcTri, dstTri);

  cv.warpPerspective(
    src,
    dst,
    perspectiveTransform,
    new cv.Size(dst.rows, dst.cols),
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  );

  return dst;
};

export default copyAndProject;