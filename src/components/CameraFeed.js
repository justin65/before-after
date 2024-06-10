import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CameraFeed = ({ addPhoto, dimensions }) => {
  const [isMobile, setIsMobile] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
  }, []);

  const portraitImage = dimensions.width < dimensions.height;

  const width = dimensions.width > dimensions.height ? dimensions.width : dimensions.height;
  const height = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: portraitImage ? height : width,
      height: portraitImage ? width : height,
    });
    addPhoto(imageSrc);
  };

  if (!dimensions || !dimensions.width || !dimensions.height) {
    return;
  }
  const videoConstraints = {
    width,
    height,
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {isMobile ? (
        <div className="image-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={videoConstraints.width}
            height={videoConstraints.height}
            videoConstraints={{
              ...videoConstraints,
              facingMode: { exact: "environment" },
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      ) : (
        <div className="image-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={videoConstraints.width}
            height={videoConstraints.height}
            videoConstraints={videoConstraints}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
      <button onClick={capture}>拍照</button>
    </div>
  );
};

export default CameraFeed;
