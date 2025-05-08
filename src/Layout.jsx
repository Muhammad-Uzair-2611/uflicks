import React, { useEffect } from "react";
import NavBar from "./Components/NavBar";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import { MoviesInfoProvider } from "./Context/MovieInfoContext";
import { useSearch } from "./Context/Searchcontext";

const Layout = () => {
  const matches = useMatches();
  const { isFocus } = useSearch();
  const navigate = useNavigate();
  const hideSearNav = matches.some((match) => match.handle?.hide_navbar);

  useEffect(() => {
    if (isFocus) navigate("/search");
  }, [isFocus, navigate]);

  return (
    <div className="container mx-auto">
      <ScrollToTop />
      {!hideSearNav && <NavBar />}
      <MoviesInfoProvider>
        <Outlet />
      </MoviesInfoProvider>
    </div>
  );
};

export default Layout;
