import React, { useEffect, useRef, useState } from "react";
import { getImageURL, getTopRatedMovies } from "../services/movie_api";

const SimpleCarousel = () => {
  const [topRated, setTopRated] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const [isHover, setIsHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topRated.length);
    }, 3000);
  };

  const stopAutoPlay = () => {
    clearInterval(intervalRef.current);
  };

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
      onMouseEnter={() => {
        stopAutoPlay();
        setIsHover(true);
      }}
      onMouseLeave={() => {
        startAutoPlay();
        setIsHover(false);
      }}
      className="w-full h-full overflow-hidden relative rounded-sm cursor-pointer group"
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
            style={{
              width: `${100 / topRated.length}%`,
              flexShrink: 0,
              height: "100%",
              position: "relative",
            }}
          >
            <img
              src={`${imageURL?.url}${imageURL?.banner_sizes?.[1]}${movie.banner}`}
              alt={`movie-${idx}`}
              className={`w-full h-full object-cover transition-all duration-500 ${isHover ? "blur-sm" : ""
                }`}
            />
          </div>
        ))}
      </div>

      {/* Overlay Content for Active Slide Only */}
      {topRated[currentIndex] && (
        <div className={`absolute z-10 flex gap-x-4 top-1/4 left-10 text-white max-w-4xl transition-all duration-500 ${isHover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
          <div className="poster transform transition-transform duration-500 group-hover:scale-105">
            <img
              className="w-[148px] h-[220px] rounded-sm shadow-sm shadow-white"
              src={`${imageURL?.url}${imageURL?.sizes?.[1]}${topRated[currentIndex].poster}`}
              alt="Poster"
            />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold transform transition-transform duration-500 ">
                {topRated[currentIndex].title || "Movie Title"}
              </p>
              <span className="">
                Release date: {topRated[currentIndex].release_date || "N/A"}
              </span>
            </div>

            <p className="text-sm max-w-xl">
              {topRated[currentIndex].overview}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCarousel;
