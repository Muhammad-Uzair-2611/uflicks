import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  lazy,
} from "react";
import MovieCard from "./Components/MovieCard";
import { FaChevronLeft } from "react-icons/fa";
import { useSearch } from "./Context/Searchcontext";
import {
  getTrendingMovies,
  getTNowPlayingMovies,
  getPopularShow,
  getImageURL,
} from "./services/movie_api";
import ErrorBoundary from "./Components/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Memoized MovieCard component
const MemoizedMovieCard = React.memo(MovieCard);

function App() {
  //*States & Ref
  const [trendng_Movies, set_Trendng_Movies] = useState([]);
  const [now_Playing, set_Now_Playing] = useState([]);
  const [popular_TV_Show, set_Popular_TV_Show] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageURL, setImageURL] = useState();
  const [error, setError] = useState(null);
  const { isFocus } = useSearch();
  const trending_Movie_crousel = useRef(null);
  const now_Playing_crousel = useRef(null);
  const popular_Show_crousel = useRef(null);
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
        opacity: 0.7,
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
        setLoading(true);
        setError(null);
        const [trendingMovies, nowPlaying, popularShow, ImageURL] =
          await Promise.all([
            getTrendingMovies(),
            getTNowPlayingMovies(),
            getPopularShow(),
            getImageURL(),
          ]);
        if (mounted) {
          set_Trendng_Movies(trendingMovies);
          set_Now_Playing(nowPlaying);
          set_Popular_TV_Show(popularShow);
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
    isFocus ? navigate("/search") : navigate("/");
  }, [isFocus]);

  //*Functions
  const handleclick = useCallback((direction, e) => {
    try {
      if (direction === "right") {
        if (e.currentTarget.id === "trending_right")
          trending_Movie_crousel.current.scrollLeft -= 200;
        else if (e.currentTarget.id === "now_playing_right")
          now_Playing_crousel.current.scrollLeft -= 200;
        else popular_Show_crousel.current.scrollLeft -= 200;
      } else if (direction === "left") {
        if (e.currentTarget.id === "trending_left")
          trending_Movie_crousel.current.scrollLeft += 200;
        else if (e.currentTarget.id === "now_playing_left")
          now_Playing_crousel.current.scrollLeft += 200;
        else popular_Show_crousel.current.scrollLeft += 200;
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
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="sm:text-4xl text-2xl font-semibold sm:px-4 px-2">
                Trending
              </h1>
            </motion.div>
            <motion.div
              className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-10 mt-0 items-center relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div
                className="hidden sm:flex justify-start gap-x-4 items-center relative z-10 w-fit bottom-[63%] 
         [&>button]:lg:text-[40px] [&>button]:text-[30px] [&>button]:cursor-pointer"
              >
                <motion.button
                  className="p-2 rounded-full"
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
                  className="p-2 rounded-full"
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
              className=""
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="sm:text-4xl text-2xl font-semibold sm:px-4 px-2">
                Now Playing
              </h1>
            </motion.div>
            <motion.div
              className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-10 mt-0 sm:mb-10 relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div
                className="hidden sm:flex justify-start gap-x-4 items-center relative z-10 w-fit bottom-[63%] 
         [&>button]:lg:text-[40px] [&>button]:text-[30px] [&>button]:cursor-pointer"
              >
                <motion.button
                  className="p-2 rounded-full"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => handleclick("right", e)}
                  id="now_playing_right"
                >
                  <FaChevronLeft />
                </motion.button>

                <motion.button
                  className="p-2 rounded-full"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => handleclick("left", e)}
                  id="now_playing_left"
                >
                  <FaChevronLeft className="rotate-180" />
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
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className=""
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="sm:text-4xl text-2xl font-semibold sm:px-4 px-2">
                Popular Tv Shows
              </h1>
            </motion.div>
            <motion.div
              className="h-55 sm:h-fit mb-5 sm:px-4 px-0 sm:mt-10 mt-0 items-center relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div
                className="hidden sm:flex justify-start gap-x-4 items-center relative z-10 w-fit bottom-[63%] 
         [&>button]:lg:text-[40px] [&>button]:text-[30px] [&>button]:cursor-pointer"
              >
                <motion.button
                  className="p-2 rounded-full"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => handleclick("right", e)}
                >
                  <FaChevronLeft />
                </motion.button>

                <motion.button
                  className="p-2 rounded-full"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => handleclick("left", e)}
                >
                  <FaChevronLeft className="rotate-180" />
                </motion.button>
              </div>
              <div
                ref={popular_Show_crousel}
                className="flex gap-x-7 overflow-x-scroll px-2 py-4 scrollbar-hide transition-all scroll-smooth"
              >
                <AnimatePresence>
                  {popular_TV_Show.map((movie) => (
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
