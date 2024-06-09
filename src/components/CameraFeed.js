import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CameraFeed = ({ addPhoto }) => {
  const [isMobile, setIsMobile] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    addPhoto(imageSrc);
  };

  return (
    <div>
      {isMobile ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{
            facingMode: { exact: "environment" }
          }}
        />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
      )}
      <button onClick={capture}>拍照</button>
    </div>
  );
};

export default CameraFeed;
