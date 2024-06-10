import React from 'react';

const PhotoUpload = ({ addPhoto }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = function() {
        const width = img.width;
        const height = img.height;
        addPhoto(reader.result, fileName, { width, height });
      };
      img.onerror = function(e) {
        console.error('Error loading image');
        console.log(e);
      };
      img.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default PhotoUpload;
