import React, { useRef, useEffect } from "react";

const WIDTH = 500;
const HEIGHT = 500;
const MAX_PIXEL_IDX_W = WIDTH - 1;
const MAX_PIXEL_IDX_H = HEIGHT - 1;
const GRID_START = [-2,-2]; // grid starting point
const GRID_SIZE = [4,4]; // grid width, grid height
const MAX_ITER = 50;

function isBounded(cx, cy) {
  let x = 0, y = 0, iter = 0;
  while (x * x + y * y <= 4 && iter < MAX_ITER) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    iter++;
  }
  return iter === MAX_ITER;
}

const PointExplorer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(WIDTH, HEIGHT);
    const data = imageData.data;
    for (let px = 0; px < WIDTH; px++) {
      const x = GRID_START[0] + (px / MAX_PIXEL_IDX_W) * GRID_SIZE[0];

      for (let py = 0; py < HEIGHT; py++) {
        const y = GRID_START[1] + (py / MAX_PIXEL_IDX_H) * GRID_SIZE[1];
        const isBoundedValue = isBounded(x, y);

        const idx = 4 * (py * WIDTH + px);

        if (isBoundedValue) {
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 255;
        } else {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <div>
      <h2> Interactive Mathematical Explorer</h2>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ border: "1px solid #ccc" }} />
    </div>
  );
}

export default PointExplorer;