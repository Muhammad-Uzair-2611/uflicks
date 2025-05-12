import { FaSearch, FaFilter } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { React, useState, useRef, useEffect, useCallback } from "react";
import { useSearch } from "../Context/Searchcontext";
import {
  getSearchResult,
  getMoviesGenres,
  getShowsGenres,
} from "../services/movie_api";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Searchbar = () => {
  //*States & Refrences
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const {
    isFocus,
    setIsFocus,
    searchItem,
    setSearchItem,
    setSearchResult,
    setFilter,
  } = useSearch();
  const Search_Ref = useRef(null);
  const filterDivRef = useRef(null);
  const filterBtn = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const ExcludedCategories = [
    "Animation",
    "Horror",
    "Action",
    "Drama",
    "Adventure",
    "Comedy",
  ];

  //*Functionss
  const Debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const debouncedSearch = useRef(
    Debounce(async (value) => {
      let searchResult = await getSearchResult(value);
      setSearchResult(searchResult);
    }, 500)
  ).current;

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value != " ") {
      setSelectedGenre(false);
      setSearchItem(value);
      debouncedSearch(value);
    }
  };
  const handleClick = async () => {
    if (isFocus != true) {
      // navigate("/search/movies");

      setSearchItem("");
      Search_Ref.current?.focus();
    } else {
      setSearchItem("");
      setIsFocus(false);
      navigate("/");
    }
  };
  const handleFilter = () => {
    setShowFilters(!showFilters);
  };
  const handleFilterSelect = (e) => {
    const div = e.target.closest(".genresName");
    if (e.target.id) {
      setSearchItem("");
      setIsFocus(true);
      setFilter({
        id: Number(e.target.id),
        name: div.dataset.name,
      });
      setSelectedGenre(e.target.id);
    }
  };
  const handleClickOutside = useCallback((e) => {
    if (
      filterDivRef.current &&
      filterBtn.current &&
      !filterDivRef.current.contains(e.target) &&
      !filterBtn.current.contains(e.target)
    ) {
      setShowFilters(false);
    }
  }, []);

  //*Effects
  useEffect(() => {
    async function fetch() {
      if (location.pathname === "/search/shows") {
        const genres = await getShowsGenres();
        setGenres(genres);
      } else {
        const genres = await getMoviesGenres();
        setGenres(genres);
      }
    }
    fetch();
    return () => setGenres([]);
  }, [location.pathname]);
  useEffect(() => {
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  return (
    <div className="w-full flex justify-center">
      <div
        className={`sm:px-3 px-2 bg-neutral-700 flex justify-between items-center gap-x-2 lg:w-150 md:w-100 w-[90%] rounded-md h-fit lg:py-2 md:py-1 relative           
        `}
      >
        <span
          onClick={handleClick}
          className={`sm:text-xl md:text-lg text-sm cursor-pointer`}
        >
          {isFocus ? <IoArrowBack /> : <FaSearch />}
        </span>
        <input
          ref={Search_Ref}
          value={searchItem}
          onChange={handleSearch}
          onFocus={() => {
            setIsFocus(true);
            setShowFilters(false);
          }}
          className="w-full outline-0 placeholder:text-xs pt-1 text-sm"
          type="search"
          placeholder="Search Movie By Title."
        />
        <span ref={filterBtn}>
          <FaFilter
            onClick={handleFilter}
            className="md:text-lg text-sm cursor-pointer"
          />
        </span>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleFilterSelect}
            ref={filterDivRef}
            className="h-fit sm:w-fit shadow-sm shadow-gray-400  bg-neutral-950 absolute sm:right-4 -right-2 sm:-bottom-58 -bottom-34 grid grid-cols-3 sm:gap-4  gap-x-2 gap-y-2 rounded-md sm:py-3 py-2 sm:px-4 px-2 [&>div]:flex sm:[&>div]:gap-x-2 [&>div]:gap-x-1 z-60 
            [&>div>input]:cursor-pointer sm:[&>div]:text-lg [&>div]:text-[10px] 
         [&>div]:items-center"
          >
            {genres
              .filter((genre) => !ExcludedCategories.includes(genre.name))
              .map((genre) => (
                <div
                  className="genresName"
                  key={genre.id}
                  data-name={genre.name}
                >
                  <input
                    className="scale-80 md:scale-100"
                    type="radio"
                    checked={selectedGenre === genre.id}
                    onChange={() => setSelectedGenre(genre.id)}
                    id={genre.id}
                    name="option"
                  />
                  <span className="w-fit text-nowrap">
                    {genre.name == "Science Fiction" ? "Sci-Fi" : genre.name}
                  </span>
                </div>
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
