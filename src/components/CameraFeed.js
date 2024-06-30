import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import CameraIcon from '@mui/icons-material/Camera';
import Button from '@mui/material/Button';

const CameraFeed = ({ addPhoto, dimensions, imgSize }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState(window.screen.orientation.type);
  const webcamRef = useRef(null);

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation.type);
    };

    window.screen.orientation.addEventListener('change', handleOrientationChange);

    return () => {
      window.screen.orientation.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
  }, []);

  const width = dimensions.width > dimensions.height ? dimensions.width : dimensions.height;
  const height = dimensions.width < dimensions.height ? dimensions.width : dimensions.height;

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: orientation.includes('portrait') ? height : width,
      height: orientation.includes('portrait') ? width : height,
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
            screenshotQuality={1}
            videoConstraints={{
              ...videoConstraints,
              facingMode: { exact: "environment" },
            }}
            style={{
              width: imgSize ? imgSize.width : '100%',
              height: imgSize ? imgSize.height : '100%',
              objectFit: 'fill',
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
            screenshotQuality={1}
            videoConstraints={videoConstraints}
            style={{
              width: imgSize ? imgSize.width : '100%',
              height: imgSize ? imgSize.height : '100%',
              objectFit: 'fill',
            }}
          />
        </div>
      )}
      <Button
        variant="contained"
        component="span"
        startIcon={<CameraIcon />}
        color="primary"
        onClick={capture}
        style={{ marginTop: 10 }}
      >
        拍照
      </Button>
    </div>
  );
};

export default CameraFeed;
