import React, { useState } from 'react';
import PhotoUpload from './components/PhotoUpload';
import CameraFeed from './components/CameraFeed';
import { saveAs } from 'file-saver';
import './App.css';

const App = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [uploadedPhotoName, setUploadedPhotoName] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(true);

  const handleFileUpload = (photo, photoName) => {
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
        <h2>上傳照片</h2>
        <PhotoUpload addPhoto={handleFileUpload} />
        {uploadedPhoto && <img src={uploadedPhoto} alt="Uploaded" />}
      </div>
      <div className="camera-feed">
        <h2>{showCamera ? '相機影像' : '拍照結果'}</h2>
        {showCamera ? (
          <CameraFeed addPhoto={handlePhotoCapture} />
        ) : (
          <div>
            <img src={capturedPhoto} alt="Captured" />
            <button onClick={handleShowCamera}>回到相機模式</button>
            <button onClick={handleSavePhoto}>保存照片</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
