import React from "react";
import Sidebar from "./Sidebar";
import ImageCrousel from "./ImageCrousel";

const Hero = () => {
  return (
    <div className="gap-x-1 w-full h-fit flex py-5 px-4">
      <Sidebar />
      <div className="w-full">
        <ImageCrousel />
      </div>
    </div>
  );
};

export default Hero;
