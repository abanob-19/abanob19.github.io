import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';

function WebCam() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      captureScreenshot();
    }, 10000); // take screenshot every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const captureScreenshot = async () => {
    const canvas = canvasRef.current;
    const webcam = webcamRef.current;
  
    console.log(webcam);
    console.log(webcamRef.current.videoWidth);
    // console.log(webcam.video.readyState);
  
    // if (webcam) {
    //   const videoSettings = webcam.videoWidth && webcam.videoHeight
    //     ? { videoWidth: webcam.videoWidth, videoHeight: webcam.videoHeight }
    //     : {};
  
    //   console.log("Webcam is defined");
    //   console.log("Canvas dimensions:", canvas.width, canvas.height);
    //   console.log("Video dimensions:", videoSettings.videoWidth, videoSettings.videoHeight);
  
    //   canvas.width = videoSettings.videoWidth;
    //   canvas.height = videoSettings.videoHeight;
  
    //   setTimeout( async () => {
    //     canvas.getContext('2d').drawImage(
    //       webcam,
    //       0,
    //       0,
    //       videoSettings.videoWidth,
    //       videoSettings.videoHeight
    //     );
    //     const dataURL = canvas.toDataURL('image/jpeg', 0.5);
  
    //     try {
    //       const response = await fetch('/student/saveScreenshot', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ screenshot: dataURL })
    //       });
    //       const result = await response.json();
    //       console.log(result);
    //     } catch (error) {
    //       console.error('Failed to save screenshot', error);
    //     }
    //   }, 500); // add a 500ms delay before taking the screenshot
    // } else {
    //   console.log("Webcam is not yet defined");
    // }
  };
  

  const startExam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamRef.current.srcObject = stream;
      webcamRef.current.play();
    } catch (error) {
      console.error('Failed to access webcam', error);
    }
  };

  return (
    <div>
      <button onClick={startExam}>Start Exam</button>
      <div>
        {screenshots.map((screenshot, index) => (
          <img key={index} src={screenshot} alt={`Screenshot ${index}`} />
        ))}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video ref={webcamRef} style={{ display: 'inline-block' }} />
    </div>
  );
}

export default WebCam;
