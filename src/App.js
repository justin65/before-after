import React, { useRef, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import Button from '@mui/material/Button';
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
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const handleFileUpload = (photo, photoName,{ width, height }) => {
    setDimensions({ width, height });
    setUploadedPhoto(photo);
    setUploadedPhotoName(photoName);
  };

  useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setImgSize({ width, height });
        }
      });

      resizeObserver.observe(imgElement);

      // Clean up observer on unmount
      return () => {
        resizeObserver.unobserve(imgElement);
      };
    }
  }, [uploadedPhoto]);

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
    const borderWidth = 20;

    image1.onload = () => {
      image2.onload = () => {
        const width = image1.width / 2;
        const height = image1.height / 2;
        const portraitImage = width < height;
        
        if (portraitImage) {
          canvas.width = width * 2 + 3 * borderWidth;
          canvas.height = height + 2 * borderWidth;
        } else {
          canvas.width = width + 2 * borderWidth;
          canvas.height = height * 2 + 3 * borderWidth;
        }
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (portraitImage) {
          context.drawImage(image1, borderWidth, borderWidth, width, height);
          context.drawImage(image2, width + 2 * borderWidth, borderWidth, width, height);
        } else {
          context.drawImage(image1,  borderWidth,  borderWidth, width, height);
          context.drawImage(image2,  borderWidth, height + 2 * borderWidth, width, height);
        }

        const fileName = getModifiedFileName(uploadedPhotoName, '_concat');
        canvas.toBlob(blob => {
          saveAs(blob, fileName);
        });
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
        <Typography variant="h6">
          Before
        </Typography>
        <div className="image-container">
          {uploadedPhoto && <img src={uploadedPhoto} alt="Uploaded" ref={imgRef} />}
        </div>
        <PhotoUpload addPhoto={handleFileUpload} />
      </div>
      <div className="camera-feed" ref={outerDivRef}>
        <Typography variant="h6">
          After
        </Typography>
        {showCamera ? (
          <CameraFeed addPhoto={handlePhotoCapture} dimensions={dimensions} imgSize={imgSize} />
        ) : (
          <>
            <div className="image-container">
              <img src={capturedPhoto} alt="Captured" />
            </div>
            <div>
              <Button
                variant="contained"
                component="span"
                startIcon={<CameraAltIcon />}
                color="primary"
                onClick={handleShowCamera}
                style={{ marginTop: 10 }}
              >
                回到相機模式
              </Button>
              <Button
                variant="contained"
                component="span"
                startIcon={<SaveAltIcon />}
                color="primary"
                onClick={handleSavePhoto}
                style={{ marginTop: 10 }}
              >
                保存照片
              </Button>
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoLibraryIcon />}
                color="primary"
                onClick={handleMergePhoto}
                style={{ marginTop: 10 }}
              >
                合併照片
              </Button>
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;
