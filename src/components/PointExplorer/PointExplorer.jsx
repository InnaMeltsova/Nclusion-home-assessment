import React, { useRef, useEffect, useState } from "react";
import "./PointExplorer.css";

const GRID_START = [-2,-2]; // grid starting point
const GRID_SIZE = [4,4]; // grid width, grid height

function isBounded(cx, cy, maxIter) {
  let x = 0, y = 0, iter = 0;
  while (x * x + y * y <= 4 && iter < maxIter) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    iter++;
  }
  return iter === maxIter;
}

const PointExplorer = () => {
  const canvasRef = useRef(null);
  const [resolution, setResolution] = useState(500);
  const [maxIter, setMaxIter] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  const WIDTH = resolution;
  const HEIGHT = resolution;
  const MAX_PIXEL_IDX_W = WIDTH - 1;
  const MAX_PIXEL_IDX_H = HEIGHT - 1;

  // Calculate the visible region based on zoom and pan
  const getVisibleRegion = () => {
    const baseSize = 4 / zoom;
    const centerX = pan.x;
    const centerY = pan.y;
    
    return {
      xMin: centerX - baseSize / 2,
      xMax: centerX + baseSize / 2,
      yMin: centerY - baseSize / 2,
      yMax: centerY + baseSize / 2
    };
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    setLoading(true);
    
    // Use setTimeout to allow UI to update before heavy calculation
    const timeoutId = setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(WIDTH, HEIGHT);
      const data = imageData.data;
      
      const region = getVisibleRegion();
      
      for (let px = 0; px < WIDTH; px++) {
        const x = region.xMin + (px / MAX_PIXEL_IDX_W) * (region.xMax - region.xMin);

        for (let py = 0; py < HEIGHT; py++) {
          const y = region.yMin + (py / MAX_PIXEL_IDX_H) * (region.yMax - region.yMin);
          const isBoundedValue = isBounded(x, y, maxIter);

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
      setLoading(false);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [resolution, maxIter, zoom, pan, WIDTH, HEIGHT, MAX_PIXEL_IDX_W, MAX_PIXEL_IDX_H]);

  const handleResolutionChange = (e) => {
    const value = parseInt(e.target.value);
    setResolution(value);
  };

  const handleMaxIterChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxIter(value);
  };

  const handleZoomChange = (e) => {
    const value = parseFloat(e.target.value);
    setZoom(value);
  };

  const handlePanXChange = (e) => {
    const value = parseFloat(e.target.value);
    setPan(prev => ({ ...prev, x: value }));
  };

  const handlePanYChange = (e) => {
    const value = parseFloat(e.target.value);
    setPan(prev => ({ ...prev, y: value }));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const region = getVisibleRegion();

  return (
    <div className="point-explorer">
      <h2>Interactive Mathematical Explorer</h2>
      
      <div className="controls-container">
        <div className="control-row">
          <label htmlFor="resolution" className="control-label">
            Resolution: {resolution}×{resolution}
          </label>
          <input
            id="resolution"
            type="range"
            min="100"
            max="1000"
            step="50"
            value={resolution}
            onChange={handleResolutionChange}
            className="control-slider"
          />
          <input
            type="number"
            min="100"
            max="1000"
            step="50"
            value={resolution}
            onChange={handleResolutionChange}
            className="control-input"
          />
        </div>

        <div className="control-row">
          <label htmlFor="maxIter" className="control-label">
            Max Iterations: {maxIter}
          </label>
          <input
            id="maxIter"
            type="range"
            min="10"
            max="200"
            step="10"
            value={maxIter}
            onChange={handleMaxIterChange}
            className="control-slider"
          />
          <input
            type="number"
            min="10"
            max="200"
            step="10"
            value={maxIter}
            onChange={handleMaxIterChange}
            className="control-input"
          />
        </div>

        <div className="control-row">
          <label htmlFor="zoom" className="control-label">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            id="zoom"
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className="control-slider"
          />
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className="control-input"
          />
        </div>

        <div className="pan-controls">
          <div className="pan-control">
            <label htmlFor="panX" className="pan-label">
              Pan X: {pan.x.toFixed(2)}
            </label>
            <input
              id="panX"
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={pan.x}
              onChange={handlePanXChange}
              className="control-slider"
            />
            <input
              type="number"
              min="-2"
              max="2"
              step="0.1"
              value={pan.x}
              onChange={handlePanXChange}
              className="control-input"
            />
          </div>
          
          <div className="pan-control">
            <label htmlFor="panY" className="pan-label">
              Pan Y: {pan.y.toFixed(2)}
            </label>
            <input
              id="panY"
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={pan.y}
              onChange={handlePanYChange}
              className="control-slider"
            />
            <input
              type="number"
              min="-2"
              max="2"
              step="0.1"
              value={pan.y}
              onChange={handlePanYChange}
              className="control-input"
            />
          </div>
        </div>

        <div className="reset-section">
          <button onClick={resetView} className="reset-button">
            Reset View
          </button>
          
          {loading && (
            <span className="calculating-indicator">
              Calculating...
            </span>
          )}
        </div>

        <div className="view-info">
          <strong>Current View:</strong> X: [{region.xMin.toFixed(3)}, {region.xMax.toFixed(3)}], 
          Y: [{region.yMin.toFixed(3)}, {region.yMax.toFixed(3)}]
        </div>
      </div>

      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          width={WIDTH} 
          height={HEIGHT} 
          className="canvas"
        />
      </div>
    </div>
  );
}

export default PointExplorer;