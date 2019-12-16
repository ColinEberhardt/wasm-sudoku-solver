// taken from here:
// https://huningxin.github.io/opencv.js/samples/face-detection/index-wasm.html 

let imgElement = document.getElementById("imageSrc");

cv["onRuntimeInitialized"] = () => {
  let src = cv.imread(imgElement);
  let dst = cv.Mat.zeros(180, 180, cv.CV_8UC3);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(src, src, 150, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    src,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  const imgSize = src.size().width * src.size().height;

  // approximates each contour to polygon
  let poly = new cv.MatVector();
  for (let i = 0; i < contours.size(); ++i) {
    let tmp = new cv.Mat();
    let cnt = contours.get(i);

    cv.approxPolyDP(cnt, tmp, 3, true);

    if (tmp.size().height === 4) {
      if (cv.contourArea(tmp) / imgSize > 0.2) {
        poly.push_back(tmp);
      }
    }
    cnt.delete();
    tmp.delete();
  }

  // let color = new cv.Scalar(255, 255, 255);
  // for (let i = 0; i < poly.size(); ++i) {
  //   cv.drawContours(dst, poly, i, color, 1, 8, hierarchy, 0);
  // }

  // [421, 94, 455, 409, 54, 421, 84, 106]
  const b = poly.get(0).data32S;
  let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, b);
  let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [180, 0, 180, 180, 0, 180, 0, 0]);

  let M = cv.getPerspectiveTransform(srcTri, dstTri);


  let dsize = new cv.Size(dst.rows, dst.cols);

  cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
  // cv.imshow('tranform1', dst);


  cv.imshow("canvasOutput", dst);

  src.delete();
  dst.delete();
  hierarchy.delete();
  contours.delete();
  poly.delete();
};


/*

5 |8 7] 1
4l 9 |7
6 |7 1] 2
5 8/ 6 (1 7
1 |5 2| 9
71 4 |6
8 [3 o 4
3 | 5 | 8

*/