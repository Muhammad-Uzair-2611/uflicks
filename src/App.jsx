import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import MovieCard from "./Components/MovieCard";
import { FaChevronLeft, FaSkull, FaMap } from "react-icons/fa";
import { HiHome } from "react-icons/hi2";
import { MdMovie } from "react-icons/md";
import { PiFilmReel } from "react-icons/pi";
import { GiCrossedSwords, GiMonoWheelRobot } from "react-icons/gi";
import { LuTv } from "react-icons/lu";
import { FaMasksTheater } from "react-icons/fa6";
import { useSearch } from "./Context/Searchcontext";
import { useMovieInfo } from "./Context/MovieInfoContext";
import ImageCrousel from "./Components/ImageCrousel";
import {
  getTrendingMovies,
  getNowPlayingMovies,
  getPopularShow,
  getImageURL,
  getWarMovies,
} from "./services/movie_api";
import ErrorBoundary from "./Components/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";

const MemoizedMovieCard = React.memo(MovieCard);

function App() {
  //*States & Ref
  const [trendng_Movies, set_Trendng_Movies] = useState([]);
  const [now_Playing, set_Now_Playing] = useState([]);
  const [popular_TV_Show, set_Popular_TV_Show] = useState([]);
  const [war_movies, set_War_Movies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageURL, setImageURL] = useState();
  const [error, setError] = useState(null);
  const { isFocus } = useSearch();
  const { isAllowed, setIsAllowed } = useMovieInfo();
  const trending_Movie_crousel = useRef(null);
  const now_Playing_crousel = useRef(null);
  const upcoming_movies_crousel = useRef(null);
  const navigate = useNavigate();

  // Memoized animation variants
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

  //*Effects
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setIsAllowed(false);
        setLoading(true);
        setError(null);
        const [trendingMovies, nowPlaying, popularShow, ImageURL, upComping] =
          await Promise.all([
            getTrendingMovies(),
            getNowPlayingMovies(),
            getPopularShow(),
            getImageURL(),
            getWarMovies(),
          ]);
        if (mounted) {
          set_Trendng_Movies(trendingMovies);
          set_Now_Playing(nowPlaying);
          set_Popular_TV_Show(popularShow);
          set_War_Movies(upComping);

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
  }, []);
  useEffect(() => {
    JSON.stringify(sessionStorage.setItem("isAllowed", isAllowed));
  }, [isAllowed]);

  useEffect(() => {
    if (isFocus) navigate("/search");
    else {
      navigate("/");
    }
  }, [isFocus]);

  //*Functions
  const handleclick = useCallback((direction, e) => {
    try {
      if (direction === "right") {
        if (e.currentTarget.id === "trending_right")
          trending_Movie_crousel.current.scrollLeft -= 200;
        else if (e.currentTarget.id === "nowplaying_right")
          now_Playing_crousel.current.scrollLeft -= 200;
        else upcoming_movies_crousel.current.scrollLeft -= 200;
      } else if (direction === "left") {
        if (e.currentTarget.id === "trending_left")
          trending_Movie_crousel.current.scrollLeft += 200;
        else if (e.currentTarget.id === "nowplaying_left")
          now_Playing_crousel.current.scrollLeft += 200;
        else upcoming_movies_crousel.current.scrollLeft += 200;
      }
    } catch (err) {
      console.error("Error handling click:", err);
    }
  }, []);

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
          <p className="text- -400 mb-6">{error}</p>
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
    <ErrorBoundary>
      <div className="">
        {
          <>
            <div className="gap-x-1 w-full h-fit flex py-5 px-4">
              <Sidebar />
              <div className="w-full">
                <ImageCrousel />
              </div>
            </div>
            <motion.div
              className="mt-5 flex items-center sm:pr-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="custom-yellow mr-1 pl-4 sm:text-3xl text-xl">
                Trending
              </span>{" "}
              <span className="text-white sm:text-3xl text-xl">Now</span>
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
                  {trendng_Movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MemoizedMovieCard
                        url={imageURL.url}
                        size={imageURL.sizes[1]}
                        poster={movie.poster}
                        title={movie.title}
                        id={movie.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="mt-5 flex items-center sm:pr-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white mr-1 pl-4 sm:text-3xl text-xl">
                In
              </span>
              <span className="custom-yellow sm:text-3xl text-xl">Theater</span>
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
                  {now_Playing.map((movie) => (
                    <motion.div
                      key={movie.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MemoizedMovieCard
                        url={imageURL.url}
                        size={imageURL.sizes[1]}
                        poster={movie.poster}
                        title={movie.title}
                        id={movie.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.div
              className="mt-5 flex items-center md:pr-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="custom-yellow mr-1 pl-4 sm:text-3xl text-xl">
                War
              </span>{" "}
              <span className="text-white sm:text-3xl text-xl">Movies</span>
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
                  id="upcoming_right"
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
                  id="upcoming_left"
                >
                  <FaChevronLeft className="rotate-z-180" />
                </motion.button>
              </div>
              <div
                ref={upcoming_movies_crousel}
                className="flex gap-x-7 overflow-x-scroll px-2 py-4 scrollbar-hide transition-all scroll-smooth"
              >
                <AnimatePresence>
                  {war_movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MemoizedMovieCard
                        url={imageURL.url}
                        size={imageURL.sizes[1]}
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
        }
      </div>
    </ErrorBoundary>
  );
}

export default App;
