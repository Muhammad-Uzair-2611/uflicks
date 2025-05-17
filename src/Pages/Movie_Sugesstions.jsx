import React, { useEffect, useRef, useState } from "react";
import {
  getImageURL,
  getFliteredMovies,
  getFliteredShows,
  getMoviesGenres,
  getShowsGenres,
} from "../services/movie_api";
import { useSearch } from "../Context/Searchcontext";
import { useMovieInfo } from "../Context/MovieInfoContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

const Movie_Sugesstions = () => {
  //*States & Refrences
  const [ImageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(true);
  const [visibleCardCount, setVisibleCardCount] = useState(10);
  const [error, setError] = useState(null);
  const { searchItem, searchResult, filter, setSearchItem, setIsFocus } =
    useSearch();
  const { setIsAllowed, isAllowed, setMovieId } = useMovieInfo();
  const [currentMovies, setCurrentData] = useState([]);
  const [heading, setHeading] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const lastRenderedCard = useRef(null);
  const firstRenderedCard = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  //* Constants
  const DEFAULT_MOVIE_GENRES = "28,12,878";
  const DEFAULT_SHOW_GENRES = "10759,9648,10765";

  //* Helpers
  function getGenreInfo(genres, defaultGenres, filter) {
    const isMatch = genres.map((gen) => gen.id).includes(filter.id);
    return {
      genreId: isMatch ? filter.id : defaultGenres,
      heading: isMatch ? filter.name : "Discover",
    };
  }

  async function fetchFilteredContent(path, genreId) {
    if (path === "/search/shows") {
      return await getFliteredShows(genreId || DEFAULT_SHOW_GENRES, "show");
    }
    return await getFliteredMovies(genreId || DEFAULT_MOVIE_GENRES, "movie");
  }

  //* Effects
  useEffect(() => {
    async function fetchData() {
      try {
        setIsAllowed(false);
        setLoading(true);
        setError(null);
        let [Path, type] = location.pathname.split("/").slice(1);
        console.log(type);
        setCategory(Path);
        setType(type);

        const [movGens, showGens, imageURl] = await Promise.all([
          getMoviesGenres(),
          getShowsGenres(),
          getImageURL(),
        ]);
        setImageURL(imageURl);

        if (location.pathname === "/search/shows") {
          const { genreId, heading } = getGenreInfo(
            showGens,
            DEFAULT_SHOW_GENRES,
            filter
          );
          setHeading(heading);
          const shows = await getFliteredShows(genreId);
          setCurrentData(shows);
        } else {
          const { genreId, heading } = getGenreInfo(
            movGens,
            DEFAULT_MOVIE_GENRES,
            filter
          );
          setHeading(heading);
          const movies = await getFliteredMovies(genreId);
          setCurrentData(movies);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [location.pathname, filter.id]);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        setHeading(filter?.name);
        if (filter.id) {
          const data = await fetchFilteredContent(location.pathname, filter.id);
          setCurrentData(data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [filter]);

  useEffect(() => {
    if (searchItem === "") {
      async function fetch() {
        const data = await fetchFilteredContent(location.pathname, filter?.id);
        setCurrentData(data);
      }
      fetch();
    } else if (searchResult.length > 0) {
      setCurrentData(searchResult);
    } else {
      setCurrentData([]);
    }

    setVisibleCardCount(10);
  }, [searchResult]);

  useEffect(() => {
    if (visibleCardCount >= currentMovies.length) return;

    const lastCardObserver = new IntersectionObserver((entries) => {
      const entry1 = entries[0];
      if (entry1.isIntersecting) {
        setVisibleCardCount((prev) => prev + 10);
      }
    });

    const firstCardObserver = new IntersectionObserver((entries) => {
      const entry1 = entries[0];
      if (entry1.isIntersecting) {
        setVisibleCardCount(10);
      }
    });

    const lastCard = lastRenderedCard.current;
    const firstCard = firstRenderedCard.current;

    if (lastCard) {
      lastCardObserver.observe(lastCard);
    }
    if (firstCard) {
      firstCardObserver.observe(firstCard);
    }

    return () => {
      if (lastCard) {
        lastCardObserver.unobserve(lastCard);
      }
      if (firstCard) {
        firstCardObserver.unobserve(firstCard);
      }
    };
  }, [visibleCardCount, currentMovies.length]);

  useEffect(() => {
    console.log(isAllowed);
    sessionStorage.setItem("isAllowed", JSON.stringify(isAllowed));
  }, [isAllowed]);

  //*Functions
  const handleClick = (e) => {
    setIsAllowed(true);
    setSearchItem("");
    setIsFocus(false);
    const mediaType = e.currentTarget.dataset.type;
    setMovieId({ id: e.currentTarget.id, type: mediaType });

    navigate(`/media/${e.currentTarget.id}`);
  };

  //* Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const loadingVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const noMatchVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        staggerChildren: 0.2,
      },
    },
  };

  const noMatchItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <motion.div
          className="bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg border border-neutral-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-red-500 text-xl md:text-2xl">⚠️</div>
            <h2 className="text-xl md:text-2xl font-bold text-red-500">
              Error Loading Content
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm md:text-base"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="sm:mt-10 flex flex-col items-center justify-center">
      <motion.div className="flex flex-wrap max-w-[60rem] w-full overflow-hidden items-center justify-between md:text-2xl sm:text-xl text-lg font-semibold">
        {currentMovies.length > 0 && (
          <div className="space-x-6 sm:text-xl text-sm py-3 [&>a]:cursor-pointer [&_span]:text-[#f3b00c] [&>a]:tracking-widest">
            <NavLink
              to={`/${category}/movies`}
              className={({ isActive }) =>
                `pb-1 transition-all rounded-b-xs ${
                  isActive ? "border-b-3 border-gray-300" : ""
                }`
              }
            >
              <span>Movies</span>
            </NavLink>
            {category !== "horror" && (
              <NavLink
                to={`/${category}/shows`}
                className={({ isActive }) =>
                  `pb-1 transition-all rounded-b-xs ${
                    isActive ? "border-b-3 border-gray-300" : ""
                  }`
                }
              >
                <span>Shows</span>
              </NavLink>
            )}
          </div>
        )}
        <div>
          {searchItem === ""
            ? heading
            : `Search Results: ${searchResult?.length || 0}`}
        </div>
      </motion.div>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={loadingVariants}
            animate="animate"
          >
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <motion.p
              className="text-xl text-gray-600"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className={`mb-2 px-3 py-2`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {currentMovies.length > 0 ? (
              currentMovies.slice(0, visibleCardCount).map((movie, index) => (
                <motion.div
                  key={movie.id}
                  id={movie.id}
                  onClick={handleClick}
                  style={{
                    backgroundImage: `url(${ImageURL?.url}${ImageURL?.sizes[5]}${movie.banner})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  className="relative bg-none w-full flex sm:mb-6 mb-3 sm:py-2 p-2 sm:px-3 sm:gap-x-3 rounded-lg cursor-pointer sm:shadow-md shadow-gray-600 min-h-30"
                  ref={
                    index === visibleCardCount - 1
                      ? lastRenderedCard
                      : index === 0
                      ? firstRenderedCard
                      : null
                  }
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div
                    className={`absolute z-0 bg-black/50 inset-0  duration-700 md:bg-none
                transition-opacity rounded-lg`}
                  ></div>
                  <div className="flex z-10 gap-x-3 text-gray-200">
                    <div className="flex z-10 gap-x-3 items-center justify-center ">
                      <div className="md:min-w-30 md:w-30 md:h-45 sm:min-w-28 sm:w-28 sm:h-40 w-18 h-26 overflow-hidden rounded-lg bg-no-repeat bg-cover shadow-md shadow-black">
                        <img
                          loading="lazy"
                          style={{ objectFit: "contain" }}
                          src={`${ImageURL?.url}${ImageURL?.sizes[1]}${movie?.poster}`}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="">
                      <div className="sm:mb-4 ">
                        <div className="font-bold md:text-xl sm:text-lg text-sm sm:mb-2">
                          {movie.title}
                        </div>
                        <span className="md:text-[16px] sm:text-sm text-xs  text-neutral-300">
                          {movie.release_date}
                        </span>
                      </div>
                      <p className="md:text-sm sm:text-xs text-[10px] ">
                        {movie.overview.length > 170
                          ? movie.overview.slice(0, 170) + "..."
                          : movie.overview || "Overview Not Avialable."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="min-h-[50vh] w-full  flex flex-col items-center justify-center gap-6 p-4"
                variants={noMatchVariants}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  className=" text-8xl sm:text-9xl mb-4"
                  variants={noMatchItemVariants}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                >
                  🔍
                </motion.div>
                <motion.div
                  className="text-center"
                  variants={noMatchItemVariants}
                >
                  <h2 className=" text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    No Results Found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-center">
                    Try different keywords or check your spelling
                  </p>
                </motion.div>
                <motion.div
                  className="flex gap-4 mt-4"
                  variants={noMatchItemVariants}
                ></motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Movie_Sugesstions;
