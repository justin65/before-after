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
            setVideoConstraints({
                width: settings.width,
                height: settings.height,
                facingMode: { exact: "environment" },
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
            ...videoConstraints,
            facingMode: { exact: "environment" },
          }}
        />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={dimensions.width ? dimensions.width : 100}
          height={dimensions.height > 100 ? dimensions.height - 100 : 100}
          videoConstraints={videoConstraints}
        />
      )}
      <button onClick={capture}>拍照</button>
    </div>
  );
};

export default CameraFeed;
