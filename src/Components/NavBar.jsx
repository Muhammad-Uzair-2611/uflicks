import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { FaSkull, FaMap } from "react-icons/fa";
import { HiHome } from "react-icons/hi2";
import { MdMovie } from "react-icons/md";
import { PiFilmReel } from "react-icons/pi";
import { GiCrossedSwords, GiMonoWheelRobot } from "react-icons/gi";
import { LuTv } from "react-icons/lu";
import { FaMasksTheater } from "react-icons/fa6";
import Searchbar from "./Searchbar";
import { getMovieDetails} from "../services/movie_api";

const NavBar = () => {
  return (
    <nav className="z-50 sm:sticky top-0 left-0 bg-[#181A1B] w-full py-2 h-16 px-5 flex justify-between items-center">
      <div className="logo">
        <a href="/">
          <img className="sm:w-15 md:w-19 w-10" src="/Logo.png" alt="" />
        </a>
        {/* <button
          onClick={() => getMovieDetails(456)}
          className="px-4 py-2 bg-amber text-black rounded-md hover:bg-amber/80 transition-colors"
        >
          Get Movie Details
        </button> */}
      </div>
      <div className=" flex text-2xl mb-2 gap-x-5 ">
        <div className="hidden md:block">
          <Searchbar />
        </div>
        <span className="md:hidden">
          <GiHamburgerMenu />
        </span>
      </div>
      <div className=" hidden bg-black shadow-lg shadow-neutral-400 absolute w-70 h-330 top-0 right-0 z-30  p-4 space-y-5">
        <div className="w-full text-2xl  flex justify-end">
          <RxCross2 />
        </div>
        <div>
          <ul
            className="space-y-5 w-40 [&>li]:flex [&>li]:px-2 [&>li]:pt-1 
            [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:gap-x-2 [&>li]:text-lg 
            [&>li>span]:text-[17px] [&>li]:hover:bg-neutral-600"
          >
            <li>
              <HiHome />
              <span>Home</span>
            </li>
            <li>
              <MdMovie />
              <span>Movies</span>
            </li>
            <li>
              <LuTv />
              <span>TV Series</span>
            </li>
            <li>
              <PiFilmReel />
              <span>Animation</span>
            </li>
            <li>
              <FaSkull />
              <span>Horror</span>
            </li>
            <li>
              <GiCrossedSwords />
              <span>Action</span>
            </li>
            <li>
              <FaMasksTheater />
              <span>Drama</span>
            </li>
            <li>
              <FaMap />
              <span>Adventure</span>
            </li>
            <li>
              <GiMonoWheelRobot />
              <span>Sci-Fi</span>
            </li>
          </ul>
        </div>
      </div>
      <ul className="hidden md:flex gap-x-6 font-bold md:text-lg lg:text-xl [&>li]:hover:cursor-pointer ">
        <li className="text-amber ">Favourite</li>
        <li>About me </li>
      </ul>
    </nav>
  );
};

export default NavBar;
