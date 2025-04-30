import React from "react";
import Sidebar from "./Sidebar";
import ImageCrousel from "./ImageCrousel";

const Hero = () => {
  return (
    <div className="gap-x-1 w-full h-fit flex md:py-5 sm:py-3 py-2 px-4">
      <Sidebar />
      <div className="w-full">
        <ImageCrousel />
      </div>
    </div>
  );
};

export default Hero;
