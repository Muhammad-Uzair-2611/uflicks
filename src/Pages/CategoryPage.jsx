import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieInfo } from "../Context/MovieInfoContext";
import {
  getAnimatedMovies,
  getAnimatedShows,
  getActionMovies,
  getActionShows,
  getHorrorMovies,
  getHorrorShows,
  getDramaMovies,
  getDramaShows,
  getAdventureMovies,
  getAdventureShows,
  getComedyMovies,
  getComedyShows,
  getImageURL,
} from "../services/movie_api";
import ScrollToTop from "../Components/ScrollToTop";

const CategoryPage = () => {
  //*States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsAllowed, isAllowed, setMovieId } = useMovieInfo();
  const [visibleCardCount, setVisibleCardCount] = useState(10);
  const [category, setCategory] = useState("");
  const firstRenderedCard = useRef(null);
  const lastRenderedCard = useRef(null);
  const [ImageURL, setImageURL] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  //*Effects
  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        document.body.style.overflow = "hidden";
        const path = location.pathname;
        const [category, type] = path.split("/").slice(1);
        setCategory(category);

        const fetchMap = {
          animations: {
            movies: getAnimatedMovies,
            shows: getAnimatedShows,
          },
          action: {
            movies: getActionMovies,
            shows: getActionShows,
          },
          horror: {
            movies: getHorrorMovies,
            shows: getHorrorShows,
          },
          drama: {
            movies: getDramaMovies,
            shows: getDramaShows,
          },
          adventure: {
            movies: getAdventureMovies,
            shows: getAdventureShows,
          },
          comedy: {
            movies: getComedyMovies,
            shows: getComedyShows,
          },
        };

        const penPromise = fetchMap[category]?.[type]?.();

        const [data, imageURL] = await Promise.all([penPromise, getImageURL()]);

        if (isMounted) {
          setData(data);
          setImageURL(imageURL);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error fetching content:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);

  useEffect(() => {
    if (visibleCardCount >= data.length) return;
    const lastCardObserver = new IntersectionObserver((entries) => {
      const entry1 = entries[0];
      if (entry1.isIntersecting) {
        setVisibleCardCount((prev) => prev + 8);
      }
    });
    const firstCardObserver = new IntersectionObserver((entries) => {
      const entry1 = entries[0];
      if (entry1.isIntersecting) {
        setVisibleCardCount(10) ;
      }
    });

    if (lastRenderedCard.current && firstRenderedCard.current) {
      firstCardObserver.observe(firstRenderedCard.current);
      lastCardObserver.observe(lastRenderedCard.current);
    }

    return () => {
      if (lastRenderedCard.current && firstRenderedCard.current) {
        firstCardObserver.unobserve(firstRenderedCard.current);
        lastCardObserver.unobserve(lastRenderedCard.current);
      }
    };
  }, [visibleCardCount, data]);

  //*Functions
  const handleClick = (e) => {
    setIsAllowed(true);
    const mediaType = e.currentTarget.dataset.type;
    setMovieId({ id: e.currentTarget.id, type: mediaType });
    navigate(`/media/${e.currentTarget.id}`);
  };

  //*Variants
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <motion.div
          className="bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg border border-neutral-700"
          initial={{ opacity: 0, y: 20 }}
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
  if (loading) {
    return (
      <div className=" min-h-screen min-w-screen  flex items-center justify-center">
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
    );
  }

  return (
    <div className="flex w-full px-3">
      <Sidebar />
      {
        <div className="w-full h-full ">
          <div
            className="space-x-6 sm:text-xl  px-3  py-3 [&>a]:cursor-pointer [&_span]:text-[#f3b00c] 
        [&>a]:tracking-widest"
          >
            <NavLink
              to={`/${category}/movies`}
              className={({ isActive }) =>
                isActive
                  ? "border-b-3 rounded-b-xs transition-all pb-0 border-gray-300"
                  : "pb-1"
              }
            >
              <span>Movies</span>
            </NavLink>
            {category !== "horror" && (
              <NavLink
                to={`/${category}/shows`}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-3 rounded-b-xs transition-all pb-1  border-gray-300"
                    : "pb-0"
                }
              >
                <span>Shows</span>
              </NavLink>
            )}
            {/* <button onClick={() => getConsole()} className="p-3 cursor-pointer">
            click me{" "}
          </button> */}
          </div>
          <AnimatePresence>
            <motion.div
            
              className="sm:h-[80vh] overflow-x-hidden h-[68vh] scrollable-container overflow-y-scroll sm:px-3  px-1"
              data-scroll-reset
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {data.length > 0 &&
                data.slice(0, visibleCardCount).map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    id={movie.id}
                    onClick={handleClick}
                    data-type={movie.type}
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
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
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
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      }
      <ScrollToTop />
    </div>
  );
};

export default CategoryPage;
