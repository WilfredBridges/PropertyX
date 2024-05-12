import React, { useState } from 'react';
import { Modal } from '@mui/material';

const ImageModal = ({ imageUrls, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (imageUrls ? imageUrls.length : 0));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (imageUrls ? imageUrls.length : 0)) % (imageUrls ? imageUrls.length : 0));
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal-content">
        <span className="close cursor-pointer text-white text-2xl" onClick={onClose}>&times;</span>
        {imageUrls && imageUrls.length > 0 && (
          <div className="relative">
            <img src={imageUrls[currentImageIndex]} alt="Enlarged" className="mx-auto my-5 w-80vw " style={{ height: "80vh" }} />
            <div className="absolute top-80 left-2 right-2 flex justify-between">
              <button onClick={handlePrevImage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              >&lt;
              </button>
              <button onClick={handleNextImage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
              >&gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );

};

export default ImageModal;