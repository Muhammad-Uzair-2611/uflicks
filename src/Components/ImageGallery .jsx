import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const ImageGallery = ({ images, ImgSource, onClose }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  //*Functions
  const goNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  //*Effects
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className=" py-3 h-screen backdrop-blur-xl w-full absolute inset-0 z-100 flex flex-col justify-between">
      <div className="header flex justify-between items-center px-3">
        <button
          onClick={onClose}
          className="bg-black/50 hover:bg-black/90 rounded-md py-1 px-3 cursor-pointer z-10 flex items-center text-lg tracking-wide transition-colors"
        >
          <RxCross2 className="text-xl" />
          <span className="pt-1">Close</span>
        </button>
        <div className="bg-black/50 rounded-2xl py-1 px-3 text-center text-amber-400">
          {current + 1} of {images.length}
        </div>
      </div>
      <div className="bg-black/40 px-2 w-full h-60 flex items-center justify-between">
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="bg-black/50 border-none text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20 hover:bg-black/70 transition-colors rotate-z-180"
            aria-label="Next image"
          >
            <FaArrowRight />
          </button>
        )}
        <img
          src={`${ImgSource?.url}${ImgSource?.banner_sizes[1]}${images[current]}`}
          onError={(e) => {
            e.target.src = "./Default_banner.png";
          }}
          alt={`slide-${current}`}
          className="w-full max-h-[70vh] object-contain sm:rounded-lg rounded-none shadow-2xl "
          loading="lazy"
        />
        {images.length > 1 && (
          <button
            onClick={goNext}
            className="bg-black/50 border-none text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20 hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <FaArrowRight />
          </button>
        )}
      </div>

      <div className="bg-none w-full h-20 "></div>
    </div>
  );
};

export default ImageGallery;
