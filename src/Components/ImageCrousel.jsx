import React, { useEffect, useRef, useState } from "react";
import { getImageURL, getTopRatedMovies } from "../services/movie_api";
import { useNavigate } from "react-router-dom";
import { useMovieInfo } from "../Context/MovieInfoContext";
const SimpleCarousel = () => {
  //*States & Refrences
  const [topRated, setTopRated] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const [isHover, setIsHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const { setMovieId, setIsAllowed } = useMovieInfo();
  const navigate = useNavigate();

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
    let movieID = e.currentTarget.id;
    setMovieId(movieID);
    setIsAllowed(true);
    navigate("/movieinfo");
  };

  //*Effects
  useEffect(() => {
    async function fetchData() {
      const [imageURL, topRated] = await Promise.all([
        getImageURL(),
        getTopRatedMovies(),
      ]);
      setImageURL(imageURL);
      setTopRated(topRated);
    }

    fetchData();

    return () => stopAutoPlay(); // cleanup
  }, []);

  useEffect(() => {
    if (topRated.length > 0) {
      startAutoPlay();
    }
    return () => stopAutoPlay(); // clear interval on unmount or data change
  }, [topRated]);

  if (topRated.length === 0) return null;

  return (
    <div
      className="w-full pb-4 h-fit overflow-hidden relative  cursor-pointer"
      onMouseEnter={() => {
        stopAutoPlay();
        setIsHover(true);
      }}
      onMouseLeave={() => {
        startAutoPlay();
        setIsHover(false);
      }}
    >
      {/* Slide Container */}
      <div
        style={{
          display: "flex",
          width: `${topRated.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / topRated.length)}%)`,
          transition: "transform 0.5s ease-in-out",
          
        }}
      >
        {topRated.map((movie, idx) => (
          <div
            key={movie.id}
            id={movie.id}
            onClick={handleClick}
            style={{
              width: `${100 / topRated.length}%`,
              flexShrink: 0,
              height: "100%",
              position: "relative",
              borderRadius : "10px"
            }}
          >
            <img
              src={`${imageURL?.url}${imageURL?.banner_sizes?.[1]}${movie.banner}`}
              alt={`movie-${idx}`}
              className={`w-full h-full object-cover transition-all duration-500  ${
                isHover && "md:blur-sm"
              }`}
            />
            {isHover && (
              <div
                className={`absolute bg-black/30 inset-0  duration-700 md:bg-none
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
          className={`md:absolute z-10 md:flex gap-x-4 top-1/4 left-10 text-white transition-all duration-500 opacity-100 translate-y-4 w-full  ${
            isHover
              ? "md:opacity-100 md:translate-y-0"
              : "md:opacity-0 md:translate-y-4"
          }`}
          onClick={handleClick}
        >
          <div className="poster transform transition-transform duration-500 group-hover:scale-105">
            <img
              className="w-[148px] h-[220px] hidden md:block rounded-sm shadow-sm shadow-white"
              src={`${imageURL?.url}${imageURL?.sizes?.[1]}${topRated[currentIndex].poster}`}
              alt="Poster"
            />
          </div>
          <div className="md:space-y-4">
            <div className="w-full md:w-fit text-center md:text-left -space-y-2 md:space-y-1">
              <p className="md:text-3xl text-lg font-bold transform transition-transform duration-500">
                {topRated[currentIndex].title || "Movie Title"}
              </p>
              <span className="text-xs sm:text-lg">
                Release date: {topRated[currentIndex].release_date || "N/A"}
              </span>
            </div>

            <p className="md:text-sm md:block hidden max-w-xl">
              {topRated[currentIndex].overview || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCarousel;
