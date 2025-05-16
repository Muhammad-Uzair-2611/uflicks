import React, { useEffect, useRef, useState } from "react";
import {
  getImageURL,
  getTopRated,
  getTopRatedMovies,
  getTopRatedTvShows,
} from "../services/movie_api";
import { useNavigate, useLocation } from "react-router-dom";
import { useMovieInfo } from "../Context/MovieInfoContext";

const SimpleCarousel = () => {
  //*States & Refrences
  const [topRated, setTopRated] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const [isHover, setIsHover] = useState(false);
  const [heading, setHeading] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const { setMovieId, setIsAllowed } = useMovieInfo();
  const navigate = useNavigate();
  const location = useLocation();

  //*Functions
  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topRated.length);
    }, 3000);
  };

  const stopAutoPlay = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleClick = (e) => {
    setIsAllowed(true);
    const mediaType = e.currentTarget.dataset.type;
    setMovieId({ id: topRated[currentIndex].id, type: mediaType });
    if (location) navigate(`/media/${topRated[currentIndex].id}`);
  };

  //*Effects
  useEffect(() => {
    async function fetchData() {
      let promise;
      if (location.pathname === "/") {
        promise = getTopRated();
        setHeading("Movies And Shows");
      } else if (location.pathname === "/movies") {
        promise = getTopRatedMovies();
        setHeading("Movies");
      } else {
        promise = getTopRatedTvShows();
        setHeading("Shows");
      }
      const [imageURL, topRated] = await Promise.all([getImageURL(), promise]);

      setImageURL(imageURL);
      setTopRated(topRated);
    }

    fetchData();

    return () => stopAutoPlay();
  }, [location.pathname]);

  useEffect(() => {
    if (topRated.length > 0) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [topRated]);

  if (topRated.length === 0) return null;

  return (
    <div
      className="w-full xl:h-[93%] lg:h-[75%] h-fit overflow-hidden relative cursor-pointer"
      onMouseEnter={() => {
        stopAutoPlay();
        setIsHover(true);
      }}
      onMouseLeave={() => {
        startAutoPlay();
        setIsHover(false);
      }}
    >
      <div className="tracking-wider lg:text-lg md:text-[16px] text-sm mb-0.5">
        <span className="text-amber">Top Rated</span> {heading}
      </div>
      {/* Slide Container */}
      <div
        style={{
          display: "flex",
          width: `${topRated.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / topRated.length)}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
        className="sm:h-fit h-52"
      >
        {topRated?.map((movie, idx) => (
          <div
            key={movie.id}
            id={movie.id}
            onClick={handleClick}
            style={{
              width: `${100 / topRated.length}%`,
              flexShrink: 0,
              position: "relative",
              borderRadius: "10px",
            }}
            className="sm:h-full h-50"
          >
            <img
              src={`${imageURL?.url}${imageURL?.banner_sizes?.[1]}${movie.banner}`}
              alt={`movie-${idx}`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHover && "md:blur-sm"
              }`}
            />
            {isHover && (
              <div
                className={`absolute bg-black/30 inset-0 duration-700 md:bg-none
                 z-0 transition-opacity`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Overlay Content for Active Slide Only */}
      {topRated[currentIndex] && (
        <div
          id={topRated[currentIndex].id}
          data-type={topRated[currentIndex].type}
          className={`md:absolute z-10 md:flex lg:gap-x-4 md:gap-x-3 xl:top-1/3 xl:left-30 
            md:top-1/4 md:left-10 text-white transition-all duration-500 opacity-100 sm:translate-y-4 w-full pb-3 ${
              isHover
                ? "md:opacity-100 md:translate-y-0"
                : "md:opacity-0 md:translate-y-4"
            }`}
          onClick={handleClick}
        >
          <div className="poster transform transition-transform duration-500 group-hover:scale-105">
            <img
              className="lg:w-[148px] lg:h-[220px] w-[120px] h-[170px] hidden md:block rounded-sm shadow-sm shadow-white"
              src={`${imageURL?.url}${imageURL?.sizes?.[1]}${topRated[currentIndex].poster}`}
              alt="Poster"
            />
          </div>
          <div className="lg:space-y-4 md:space-y-2">
            <div className="w-full md:w-fit text-center md:text-left -space-y-2 md:space-y-1">
              <p className="lg:text-3xl md:text-2xl text-lg font-bold transform transition-transform duration-500">
                {topRated[currentIndex].title || "Movie Title"}
              </p>
              <span className="text-xs lg:text-lg md:text-sm">
                Release date: {topRated[currentIndex].release_date || "N/A"}
              </span>
            </div>

            <p className="lg:text-sm md:text-xs md:w-xs lg:w-fit md:block hidden max-w-xl">
              {topRated[currentIndex].overview || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCarousel;
