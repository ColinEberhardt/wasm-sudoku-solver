import { imgWrite, imgRead } from "./utils.js"

const TOTAL_CELLS = 9 * 9;

const renderDigits = (buffer, digits, digitColor = "black", backgroundColor = "white") => {

  const canvas = document.createElement("canvas");
  canvas.width = buffer.cols;
  canvas.height = buffer.rows;
  imgWrite(buffer, canvas);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = digitColor;
  ctx.font = "16px sans-serif";
  const cellWidth = canvas.width / 9;

  for (let i = 0; i < TOTAL_CELLS; i++) {
    const digit = digits[i];
    if (digit !== ".") {
      const x = (i % 9) * cellWidth,
        y = Math.floor(i / 9) * cellWidth;
      ctx.fillText(digit, x + 5, y + 15);
    }
  }

  return imgRead(canvas);
};

export default renderDigits;
