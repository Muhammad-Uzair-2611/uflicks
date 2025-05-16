import React, { useEffect } from "react";
import { useMovieInfo } from "../Context/MovieInfoContext";
import { useNavigate } from "react-router-dom";
const MovieCard = (props) => {
  //*Custom Hook
  const { setIsAllowed, setMovieId, movieId } = useMovieInfo();
  const navigate = useNavigate();

  //*Functions
  const handleClick = () => {
    setIsAllowed(true);
    const mediaType = props.type;
    setMovieId({ id: props.id, type: mediaType });
    navigate(`/media/${props.id}`);
  };

  return (
    <>
      <div
        onClick={handleClick}
        id={props.id}
        data-type={props.type}
        className="md:w-35 md:h-52 overflow-hidden sm:w-30 sm:h-45 w-22 h-29 rounded-lg cursor-pointer sm:mb-3 mb-2  shadow-sm shadow-gray-500"
      >
        <img
          className="object-auto w-full h-full"
          loading="lazy"
          src={`${props.url}${props.size}${props.poster}`}
          alt=""
        />
      </div>

      <span className="font-semibold sm:text-xl text-sm ">
        {props.title.length > 15
          ? props.title.slice(0, 15) + "..."
          : props.title}
      </span>
    </>
  );
};

export default MovieCard;
