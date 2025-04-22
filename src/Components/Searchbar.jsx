import { FaSearch, FaFilter } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { React, useState, useRef, useEffect, useCallback } from "react";
import { useSearch } from "../Context/Searchcontext";
import { getSearchResult, getGenres } from "../services/movie_api";
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
      setSearchResult(searchResult.length == 0 ? "" : searchResult);
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
  const handleClick = () => {
    if (!isFocus) {
      navigate("/search");
      Search_Ref.current?.focus();
    } else {
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
        id: e.target.id,
        name: div.innerText,
      });
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
      const genres = await getGenres();
      setGenres(genres);
    }
    fetch();
  }, []);
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
        className={`px-3 bg-neutral-700 flex justify-between items-center gap-x-2 sm:w-150 w-100 sm:rounded-md rounded-lg h-fit sm:py-2 py-1 relative`}
      >
        <span
          onClick={handleClick}
          className="sm:text-xl text-sm cursor-pointer"
        >
          {location.pathname === "/search" ? (
            <IoArrowBack onClick={() => setSearchItem("")} />
          ) : (
            <FaSearch />
          )}
        </span>
        <input
          ref={Search_Ref}
          value={searchItem}
          onChange={handleSearch}
          onFocus={() => {
            setIsFocus(true);
            setShowFilters(false);
          }}
          className="w-full outline-0 placeholder:text-sm"
          type="search"
          placeholder="Search Movie By Title."
        />
      </div>
    </div>
  );
};

export default Searchbar;
