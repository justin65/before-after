import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CameraFeed = ({ addPhoto, dimensions }) => {
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

  if (!dimensions) {
    return;
  }

  return (
    <div>
      {isMobile ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={dimensions.width ? dimensions.width : 200}
          height={dimensions.height > 100 ? dimensions.height - 100 : 200}
          videoConstraints={{
            facingMode: { exact: "environment" }
          }}
        />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={dimensions.width ? dimensions.width : 200}
          height={dimensions.height > 100 ? dimensions.height - 100 : 200}
        />
      )}
      <button onClick={capture}>拍照</button>
    </div>
  );
};

export default CameraFeed;
