import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Searchbar from "./Searchbar";

const NavBar = () => {
  return (
    <nav className="z-50 sm:sticky top-0 left-0 bg-[#181A1B] w-full py-2 h-fit px-5 flex justify-between items-center">
      <div className="logo">
        <a href="/">
          <img className="sm:w-20 w-15" src="./Logo.png" alt="" />
        </a>
      </div>
      <div>
        <Searchbar />
      </div>
      <div className="md:hidden block text-2xl mb-1">
        <GiHamburgerMenu />
      </div>
      <ul className="hidden md:flex gap-x-6 font-bold text-xl [&>li]:hover:cursor-pointer ">
        <li className="text-[#f3b00c]">Favourite</li>
        <li>About me </li>
      </ul>
    </nav>
  );
};

export default NavBar;
