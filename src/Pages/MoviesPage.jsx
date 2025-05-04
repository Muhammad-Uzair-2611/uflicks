import React from "react";
import Hero from "../Components/Hero";
import { FaFilter } from "react-icons/fa";
import Sliders from "../Components/Sliders";
const MoviesPage = () => {
  return (
    <>
      <Hero />
      <div className="w-full flex justify-end items-center px-4">
        <div className="flex gap-x-1 tracking-wider cursor-pointer sm:text-lg text-sm">
          <span>Filter</span>
          <span>
            <FaFilter />
          </span>
        </div>
      </div>
      <Sliders />
      <div className="w-full my-2 tracking-widest sm:text-xl text-sm text-center">
        Use <span className="text-amber">Filter</span> to get more{" "}
        <span className="text-amber">Results</span>
      </div>
    </>
  );
};

export default MoviesPage;
