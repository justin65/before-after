import React, { useState, useRef } from 'react';
import PhotoUpload from './components/PhotoUpload';
import CameraFeed from './components/CameraFeed';
import { saveAs } from 'file-saver';
import './App.css';

const App = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [uploadedPhotoName, setUploadedPhotoName] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const outerDivRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  const handleFileUpload = (photo, photoName,{ width, height }) => {
    setDimensions({ width, height });
    setUploadedPhoto(photo);
    setUploadedPhotoName(photoName);
  };

  const handlePhotoCapture = (photo) => {
    setCapturedPhoto(photo);
    setShowCamera(false);
  };

  const handleShowCamera = () => {
    setShowCamera(true);
    setCapturedPhoto(null);
  };

  const handleSavePhoto = () => {
    const blob = dataURItoBlob(capturedPhoto);
    const fileName = getModifiedFileName(uploadedPhotoName);
    saveAs(blob, fileName);
  };

  const handleMergePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const image1 = new Image();
    const image2 = new Image();

    image1.src = uploadedPhoto;
    image2.src = capturedPhoto;

    image1.onload = () => {
      image2.onload = () => {
        const width = image1.width / 2;
        const height = image1.height / 2;
        const portraitImage = width < height;
        
        if (portraitImage) {
          canvas.width = width * 2;
          canvas.height = height;
        } else {
          canvas.width = width;
          canvas.height = height * 2;
        }

        if (portraitImage) {
          context.drawImage(image1, 0, 0, width, height);
          context.drawImage(image2, width, 0, width, height);
        } else {
          context.drawImage(image1, 0, 0, width, height);
          context.drawImage(image2, 0, height, width, height);
        }

        const fileName = getModifiedFileName(uploadedPhotoName, '_concat');
        canvas.toBlob(blob => {
          saveAs(blob, fileName);
        }, 'image/jpeg');
      };
    };
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const getModifiedFileName = (fileName, postfix = '_after') => {
    const fileExtension = fileName.split('.').pop();
    const fileNameWithoutExtension = fileName.replace(`.${fileExtension}`, '');
    return `${fileNameWithoutExtension}${postfix}.${fileExtension}`;
  };

  return (
    <div className="app-container">
      <div className="photo-upload">
        <h2>Before</h2>
        <PhotoUpload addPhoto={handleFileUpload} />
        <div className="image-container">
          {uploadedPhoto && <img src={uploadedPhoto} alt="Uploaded" />}
        </div>
      </div>
      <div className="camera-feed" ref={outerDivRef}>
        <h2>After</h2>
        {showCamera ? (
          <CameraFeed addPhoto={handlePhotoCapture} dimensions={dimensions} />
        ) : (
          <>
            <div className="image-container">
              <img src={capturedPhoto} alt="Captured" />
            </div>
            <div>
              <button onClick={handleShowCamera}>回到相機模式</button>
              <button onClick={handleSavePhoto}>保存照片</button>
              <button onClick={handleMergePhoto}>合併照片</button>
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;
