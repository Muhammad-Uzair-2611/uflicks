import { NavLink } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { MdMovie } from "react-icons/md";
import { LuTv } from "react-icons/lu";
import { PiFilmReel } from "react-icons/pi";
import { FaSkull, FaMasksTheater, FaMap } from "react-icons/fa6";
import { GiCrossedSwords, GiMonoWheelRobot } from "react-icons/gi";

const Sidebar = () => {
  return (
    <div className="md:block hidden h-fit">
      <ul
        className="md:space-y-6 sm:space-y-2 w-40 
        [&>a]:flex 
        [&>a]:px-2 
        [&>a]:cursor-pointer 
        [&>a]:rounded-md 
        [&>a>li]:gap-x-2 
        [&>a>li]:text-lg
        [&>a>li]:flex 
        [&>a>li]:items-center 
        [&>a>li]:py-1
        [&>a>li>span]:text-[17px] 
        [&>a>li>span]:h-5
        [&>a]:hover:bg-neutral-600"
      >
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <HiHome />
            <span>Home</span>
          </li>
        </NavLink>

        <NavLink
          onClick={() => console.log("Movies Btn Click")}
          to={"/movies"}
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <MdMovie />
            <span>Movies</span>
          </li>
        </NavLink>

        <NavLink
          to="/tv_series"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <LuTv />
            <span>TV Series</span>
          </li>
        </NavLink>

        <NavLink
          to="/animation"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <PiFilmReel />
            <span>Animation</span>
          </li>
        </NavLink>

        <NavLink
          to="/horror"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <FaSkull />
            <span>Horror</span>
          </li>
        </NavLink>

        <NavLink
          to="/action"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <GiCrossedSwords />
            <span>Action</span>
          </li>
        </NavLink>

        <NavLink
          to="/drama"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <FaMasksTheater />
            <span>Drama</span>
          </li>
        </NavLink>

        <NavLink
          to="/adventure"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <FaMap />
            <span>Adventure</span>
          </li>
        </NavLink>

        <NavLink
          to="/sci-fi"
          className={({ isActive }) => (isActive ? "bg-neutral-600" : "")}
        >
          <li>
            <GiMonoWheelRobot />
            <span>Sci-Fi</span>
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
