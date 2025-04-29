import React from "react";
import NavBar from "./Components/NavBar";
import { Outlet, useMatches } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import { MoviesInfoProvider } from "./Context/MovieInfoContext";

const Layout = () => {
  const matches = useMatches();

  const hideSearNav = matches.some(
    (match) => match.handle?.hide_navbar
  );

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
