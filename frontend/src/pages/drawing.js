import React, { useState, useRef,useEffect , useCallback } from 'react';
import styles from '../pages/Instructor.module.css'
 const Drawing = ({onUpdate}) => {
    const canvasRef1 = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
const [lastX, setLastX] = useState(0);
 const [lastY, setLastY] = useState(0);
 const [isErasing, setIsErasing] = useState(false); // Add state for eraser tool
 const startDrawing = useCallback((event) => {
    setIsDrawing(true);
    setLastX(event.offsetX);
    setLastY(event.offsetY);
   
  }, []);
  const draw = useCallback((event) => {
    if (!isDrawing) return;
    const canvas = canvasRef1.current;
    const context = canvas.getContext('2d');
    if (isErasing) { // Use different color or composite operation for eraser tool
        context.globalCompositeOperation = 'destination-out';
        context.strokeStyle = 'rgba(0,0,0,1)';
        context.lineWidth = 30;
      } else {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
      }
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
    setLastX(event.offsetX);
    setLastY(event.offsetY);
  }, [isDrawing, lastX, lastY,isErasing]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    onUpdate(canvasRef1.current.toDataURL());
    // const canvas = canvasRef1.current;
    // canvas.style.cursor = 'default';
  }, [onUpdate]);
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef1.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    onUpdate(canvasRef1.current.toDataURL());
  }, []);
  const toggleEraser = useCallback(() => {
    setIsErasing(!isErasing);
  }, [isErasing]);
  useEffect(() => {
    const canvas = canvasRef1.current;
    canvas.style.cursor = 'crosshair'
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDrawing);
    };
  }, [startDrawing, draw, endDrawing]);
  return (
    <div>
        <canvas ref={canvasRef1} width="500" height="500" style={styles.canvas1}/>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={toggleEraser}>{isErasing ? 'Disable Eraser' : 'Enable Eraser'}</button>
    </div>
    );
}
export default Drawing;