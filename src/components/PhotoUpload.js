import React from 'react';

const PhotoUpload = ({ addPhoto }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onloadend = () => {
      addPhoto(reader.result, fileName);
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
