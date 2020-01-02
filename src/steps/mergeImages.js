import { imgWrite } from "./utils.js";

const mergeImages = (src, dstCanvas) => {
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = dstCanvas.width;
  srcCanvas.height = dstCanvas.height;
  imgWrite(src, srcCanvas);

  const srcCtx = srcCanvas.getContext("2d");
  const dstCtx = dstCanvas.getContext("2d");

  const srcData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
  const dstData = dstCtx.getImageData(0, 0, dstCanvas.width, dstCanvas.height);
  const srcDataData = srcData.data;
  const dstDataData = dstData.data;
  for (let i = 0; i < srcDataData.length; i += 4) {
    // merge src image into dst
    if (srcDataData[i + 3] !== 0) {
      const a = srcDataData[i + 3] / 255; // higher when centre of digit
      const b = (255 - srcDataData[i + 3]) / 255;
      dstDataData[i] = a * 255 + b * dstDataData[i];
      dstDataData[i + 1] = b * dstDataData[i + 1];
      dstDataData[i + 2] = b * dstDataData[i + 2];
    }
  }
  dstCtx.putImageData(dstData, 0, 0);
};

export default mergeImages;
