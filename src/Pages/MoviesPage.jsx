import React from "react";
import Hero from "../Components/Hero";
import { FaFilter } from "react-icons/fa";
import Sliders from "../Components/Sliders";
const MoviesPage = () => {
  return (
    <>
      <Hero />
      <div className="w-full flex justify-end items-center px-4">
        <div className="flex gap-x-1 tracking-wider cursor-pointer text-lg">
          <span>Filter</span>
          <span>
            <FaFilter />
          </span>
        </div>
      </div>
      <Sliders />
    </>
  );
};

export default MoviesPage;
