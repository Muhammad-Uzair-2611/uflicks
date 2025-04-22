import React, { useEffect } from "react";
import { useMovieInfo } from "../Context/MovieInfoContext";
import { useNavigate } from "react-router-dom";
const MovieCard = (props) => {
  //*Custom Hook
  const { setIsAllowed, setMovieId, movieId } = useMovieInfo();
  const navigate = useNavigate();

  //*Functions
  const handleClick = (e) => {
    setIsAllowed(true);
    console.log(e.currentTarget.id)
    setMovieId(e.currentTarget.id);
    navigate("/movieinfo");
  };

  return (
    <>
      <div
        onClick={handleClick}
        id={props.id}
        className="md:w-35 md:h-52 overflow-hidden sm:w-30 sm:h-45 w-25 h-36 rounded-lg cursor-pointer bg-no-repeat bg-cover sm:mb-3 mb-2  shadow-sm shadow-gray-500"
      >
        <img
          loading="lazy"
          src={`${props.url}${props.size}${props.poster}`}
          alt=""
        />
      </div>

      <span className="font-semibold sm:text-xl text-sm mt-5 ">
        {props.title.length > 20
          ? props.title.slice(0, 20) + "..."
          : props.title}
      </span>
    </>
  );
};

export default MovieCard;
