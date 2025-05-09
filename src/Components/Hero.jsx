import React from "react";
import Sidebar from "./Sidebar";
import ImageCrousel from "./ImageCrousel";
import Searchbar from "./Searchbar";

const Hero = () => {
  return (
    <div className="gap-x-1 px-3 w-full h-fit flex md:flex-row flex-col ">
      <Sidebar />
     
      <div className="w-full h-fit">
        <ImageCrousel />
      </div>
    </div>
  );
};

export default Hero;
