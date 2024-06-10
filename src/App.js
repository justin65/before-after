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

  const getModifiedFileName = (fileName) => {
    const fileExtension = fileName.split('.').pop();
    const fileNameWithoutExtension = fileName.replace(`.${fileExtension}`, '');
    return `${fileNameWithoutExtension}_after.${fileExtension}`;
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
