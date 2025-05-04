import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import MovieCard from "./MovieCard.jsx";
import { FaChevronLeft } from "react-icons/fa";
import { useSearch } from "../Context/Searchcontext.jsx";
import { useMovieInfo } from "../Context/MovieInfoContext";
import {
  getTrendingMovies,
  getNowPlayingMovies,
  getPopularShow,
  getTodayShows,
  getImageURL,
  getScienceFictionMovies,
  getPopularMovies,
  getOnGoingShows,
  getTrendingShows,
} from "../services/movie_api.js";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const MemoizedMovieCard = React.memo(MovieCard);

const Sliders = () => {
  //*States & Ref
  const [trendng_Movies, set_Trendng] = useState([]);
  const [now_Playing, set_Now_Playing] = useState([]);
  const [popular_Shows, set_Popular] = useState([]);
  const [today_Shows, set_Today] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageURL, setImageURL] = useState();
  const { isFocus } = useSearch();
  const { isAllowed, setIsAllowed } = useMovieInfo();
  const trending_Movie_crousel = useRef(null);
  const now_Playing_crousel = useRef(null);
  const popular_show_crousel = useRef(null);
  const today_show_crousel = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  //*titles
  const [title_1, setTitle_1] = useState("");
  const [title_2, setTitle_2] = useState("");
  const [title_3, setTitle_3] = useState("");
  const [title_4, setTitle_4] = useState("");

  //*Effects
  useEffect(() => {
    let mounted = true;
    let promisesArray;
    async function fetchData() {
      try {
        if (location.pathname === "/") {
          promisesArray = [
            getTrendingMovies(),
            getNowPlayingMovies(),
            getPopularShow(),
            getTodayShows(),
          ];
          setTitle_1(["Trending", "Movies"]);
          setTitle_2(["Playing", " Now"]);
          setTitle_3(["Popular", "Shows"]);
          setTitle_4(["Airing", "Today"]);
        } else if (location.pathname === "/movies") {
          promisesArray = [
            getTrendingMovies(),
            getNowPlayingMovies(),
            getScienceFictionMovies(),
            getPopularMovies(),
          ];
          setTitle_1(["Trending", "Movies"]);
          setTitle_2(["Playing", "Now"]);
          setTitle_3(["Sci-Fi", "Movies"]);
          setTitle_4(["Popular", "Movies"]);
        } else {
          promisesArray = [
            getTrendingShows(),
            getPopularShow(),
            getTodayShows(),
            getOnGoingShows(),
          ];
          setTitle_1(["Trending", "Shows"]);
          setTitle_2(["Popular", "Shows"]);
          setTitle_3(["Today", "Airing"]);
          setTitle_4(["Active", "Shows"]);
        }

        setIsAllowed(false);
        setLoading(true);
        setError(null);

        const [trending, nowPlaying, popular, today, ImageURL] =
          await Promise.all([...promisesArray, getImageURL()]);
        if (mounted) {
          set_Trendng(trending);
          set_Now_Playing(nowPlaying);
          set_Popular(popular);
          set_Today(today);
          setImageURL(ImageURL);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error("Error fetching data:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    JSON.stringify(sessionStorage.setItem("isAllowed", isAllowed));
  }, [isAllowed]);

  useEffect(() => {
    if (isFocus) navigate("/search");
  }, [isFocus]);

  //*Functions
  const handleclick = useCallback((direction, e) => {
    try {
      if (direction === "right") {
        if (e.currentTarget.id === "trending_right")
          trending_Movie_crousel.current.scrollLeft -= 200;
        else if (e.currentTarget.id === "nowplaying_right")
          now_Playing_crousel.current.scrollLeft -= 200;
        else if (e.currentTarget.id === "todayShows_right")
          today_show_crousel.current.scrollLeft -= 200;
        else popular_show_crousel.current.scrollLeft -= 200;
      } else if (direction === "left") {
        if (e.currentTarget.id === "trending_left")
          trending_Movie_crousel.current.scrollLeft += 200;
        else if (e.currentTarget.id === "nowplaying_left")
          now_Playing_crousel.current.scrollLeft += 200;
        else if (e.currentTarget.id === "todayShows_left")
          today_show_crousel.current.scrollLeft += 200;
        else popular_show_crousel.current.scrollLeft += 200;
      }
    } catch (err) {
      console.error("Error handling click:", err);
    }
  }, []);

  //* Memoized animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      },
    }),
    []
  );

  const loadingVariants = useMemo(
    () => ({
      animate: {
        scale: [1, 1.2, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }),
    []
  );

  const buttonVariants = useMemo(
    () => ({
      initial: {
        scale: 1,
        opacity: 0.9,
      },
      hover: {
        scale: 1.1,
        opacity: 1,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      },
      tap: {
        scale: 0.95,
        transition: {
          duration: 0.1,
        },
      },
    }),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          variants={loadingVariants}
          animate="animate"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <motion.p
            className="text-xl text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <motion.div
          className="bg-neutral-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-neutral-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-500">
              Error Loading Content
            </h2>
          </div>
          <p className=" mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }
  return (
    <>
      {/* //! Trending Movies */}
      <motion.div
        className="mt-5 flex ite
        ms-center sm:pr-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-amber mr-1 md:pl-4 sm:pl-3 pl-2 sm:text-3xl text-xl w-fit  whitespace-nowrap ">
          {title_1[0]}
        </span>{" "}
        <span className="text-white sm:text-3xl text-xl">{title_1[1]}</span>
        <div className="w-full border h-0  border-neutral-800"></div>
      </motion.div>
      <motion.div
        className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-3 mt-0 items-center relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="[&>button]:p-2 [&>button]:rounded-full [&>button]:absolute 
              [&>button]:cursor-pointer [&>button]:z-10 [&>button]:text-5xl 
              [&>button]:text-[#f3b00c] hidden md:block "
        >
          <motion.button
            className=" bottom-40 left-2"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("right", e)}
            id="trending_right"
          >
            <FaChevronLeft />
          </motion.button>

          <motion.button
            className="bottom-40 right-1"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("left", e)}
            id="trending_left"
          >
            <FaChevronLeft className="rotate-z-180" />
          </motion.button>
        </div>

        <div
          ref={trending_Movie_crousel}
          className="flex gap-x-7 overflow-x-scroll px-2 py-4 scrollbar-hide transition-all scroll-smooth"
        >
          <AnimatePresence>
            
            {trendng_Movies?.map((movie) => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <MemoizedMovieCard
                  url={imageURL?.url}
                  size={imageURL?.sizes[1]}
                  poster={movie.poster}
                  title={movie.title}
                  id={movie.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* //! Playing Now */}
      <motion.div
        className="mt-5 flex items-center sm:pr-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-amber mr-1 md:pl-4 sm:pl-3 pl-2 sm:text-3xl text-xl w-fit  whitespace-nowrap ">
          {title_2[0]}
        </span>
        <span className=" sm:text-3xl text-xl">{title_2[1]}</span>
        <div className="w-full border h-0  border-neutral-800"></div>
      </motion.div>
      <motion.div
        className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-3  mt-0 items-center relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="[&>button]:p-2 [&>button]:rounded-full [&>button]:absolute 
              [&>button]:cursor-pointer [&>button]:z-10 [&>button]:text-5xl 
              [&>button]:text-[#f3b00c] hidden md:block "
        >
          <motion.button
            className=" bottom-40 left-2"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("right", e)}
            id="nowplaying_right"
          >
            <FaChevronLeft />
          </motion.button>

          <motion.button
            className="bottom-40 right-1"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("left", e)}
            id="nowplaying_left"
          >
            <FaChevronLeft className="rotate-z-180" />
          </motion.button>
        </div>
        <div
          ref={now_Playing_crousel}
          className="flex gap-x-7 overflow-x-scroll px-2 py-4 scrollbar-hide transition-all scroll-smooth"
        >
          <AnimatePresence>
            {now_Playing?.map((movie) => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <MemoizedMovieCard
                  url={imageURL?.url}
                  size={imageURL?.sizes[1]}
                  poster={movie.poster}
                  title={movie.title}
                  id={movie.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* //! Today Airing */}
      <motion.div
        className="mt-5 flex items-center md:pr-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-amber mr-1 md:pl-4 sm:pl-3 pl-2 sm:text-3xl text-xl w-fit  whitespace-nowrap ">
          {title_3[0]}
        </span>{" "}
        <span className="text-white sm:text-3xl text-xl">{title_3[1]}</span>
        <div className="w-full border h-0  border-neutral-800"></div>
      </motion.div>
      <motion.div
        className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-3  mt-0 sm:mb-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="[&>button]:p-2 [&>button]:rounded-full [&>button]:absolute 
              [&>button]:cursor-pointer [&>button]:z-10 [&>button]:text-5xl 
              [&>button]:text-[#f3b00c] hidden md:block "
        >
          <motion.button
            className=" bottom-40 left-2"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("right", e)}
            id="todayShows_right"
          >
            <FaChevronLeft />
          </motion.button>

          <motion.button
            className="bottom-40 right-1"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("left", e)}
            id="todayShows_left"
          >
            <FaChevronLeft className="rotate-z-180" />
          </motion.button>
        </div>
        <div
          ref={today_show_crousel}
          className="flex gap-x-7 overflow-x-scroll px-2 py-4 scrollbar-hide transition-all scroll-smooth"
        >
          <AnimatePresence>
            {today_Shows.map((movie) => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <MemoizedMovieCard
                  url={imageURL?.url}
                  size={imageURL?.sizes[1]}
                  poster={movie.poster}
                  title={movie.title}
                  id={movie.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* //! Popular Shoews*/}
      <motion.div
        className="mt-5 flex items-center md:pr-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-amber mr-1 md:pl-4 sm:pl-3 pl-2 sm:text-3xl text-xl w-fit  whitespace-nowrap ">
          {title_4[0]}
        </span>
        <span className="text-white sm:text-3xl w-full text-xl ">
          {title_4[1]}
        </span>
        <div className="w-full border h-0  border-neutral-800"></div>
      </motion.div>
      <motion.div
        className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-3  mt-0 sm:mb-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="[&>button]:p-2 [&>button]:rounded-full [&>button]:absolute 
              [&>button]:cursor-pointer [&>button]:z-10 [&>button]:text-5xl 
              [&>button]:text-[#f3b00c] hidden md:block "
        >
          <motion.button
            className=" bottom-40 left-2"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("right", e)}
            id="popularShows_right"
          >
            <FaChevronLeft />
          </motion.button>

          <motion.button
            className="bottom-40 right-1"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleclick("left", e)}
            id="popularShows_left"
          >
            <FaChevronLeft className="rotate-z-180" />
          </motion.button>
        </div>
        <div
          ref={popular_show_crousel}
          className="flex gap-x-7 overflow-x-scroll px-2 py-4 scrollbar-hide transition-all scroll-smooth"
        >
          <AnimatePresence>
            {popular_Shows.map((movie) => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <MemoizedMovieCard
                  url={imageURL?.url}
                  size={imageURL?.sizes[1]}
                  poster={movie.poster}
                  title={movie.title}
                  id={movie.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
export default Sliders;
