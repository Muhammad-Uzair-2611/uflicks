import React from "react";
import Hero from "../Components/Hero";
import Sliders from "../Components/Sliders";
const MoviesPage = () => {
  return (
    <>
      <Hero />
     
      <Sliders />
      <div className="w-full my-2 tracking-widest sm:text-xl text-sm text-center">
        Use <span className="text-amber">Filter</span> to get more{" "}
        <span className="text-amber">Results</span>
      </div>
    </>
  );
};

export default MoviesPage;
