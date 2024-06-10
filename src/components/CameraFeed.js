import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CameraFeed = ({ addPhoto, dimensions }) => {
  const [videoConstraints, setVideoConstraints] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
  }, []);

  useEffect(() => {
    const getUserMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            console.log('Actual resolution:', settings.width, 'x', settings.height);
            window.alert(`Actual resolution: ${settings.width} x ${settings.height}`);
            setVideoConstraints({
                // width: settings.height, // ??
                // height: settings.width,
                width: 3072,
                height: 4080,
            });
        } catch (err) {
            console.error('Error accessing user camera:', err);
        }
    };

    getUserMedia();
}, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    addPhoto(imageSrc);
  };

  if (!dimensions) {
    return;
  }

  if (!videoConstraints) {
    return;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {isMobile ? (
        <div className="image-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            forceScreenshotSourceSize
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
            screenshotQuality={1}
            forceScreenshotSourceSize
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
