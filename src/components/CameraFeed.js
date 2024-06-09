import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const CameraFeed = ({ addPhoto }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    addPhoto(imageSrc);
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
      />
      <button onClick={capture}>拍照</button>
    </div>
  );
};

export default CameraFeed;
