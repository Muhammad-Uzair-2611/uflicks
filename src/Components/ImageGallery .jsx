import React, { useState } from "react";

const ImageGallery = ({ images, ImgSource }) => {
  const [current, setCurrent] = useState(0);



  if (!images || images.length === 0) return null;
  //*FUnctions
  const goNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="absolute inset-0 w-full h-screen z-50 back flex items-center backdrop-blur-lg justify-center ">
      <div className="relative  w-full h-1/2 bg-black flex items-center justify-center">
        {/* Image */}
        <img
          src={`${ImgSource?.url}${ImgSource?.banner_sizes[1]}${images[current]}`}
          alt={`slide-${current}`}
          className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl mx-auto"
          loading="lazy"
        />
        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-none text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20 hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            &#8592;
          </button>
        )}
        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-none text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20 hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            &#8594;
          </button>
        )}
        {/* Image Counter */}
        <div className="absolute top-4 right-8 text-yellow-400 bg-black/70 px-3 py-1 rounded-full font-bold text-base">
          {current + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
