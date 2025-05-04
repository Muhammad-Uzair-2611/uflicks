import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import Layout from "./Layout.jsx";
import { SearchProvider } from "./Context/Searchcontext.jsx";
import PageNotFound from "./Components/PageNotFound.jsx";
import ErrorBoundary from "./Components/ErrorBoundary";
import MovieInfo from "./Components/MovieInfo.jsx";
import Movie_Sugesstions from "./Components/Movie_Sugesstions.jsx";
import MoviesPage from "./Pages/MoviesPage.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <App />,
        handle: { hide_navbar: false },
      },
      {
        path: "movies",
        element: <MoviesPage />,
        handle: { hide_navbar: false },
      },
      {
        path: "tv_series",
        element: <MoviesPage />,
        handle: { hide_navbar: false },
      },
      {
        path: "animations/movies",
        element: <CategoryPage />,
        handle: { hide_navbar: false },
      },
      {
        path: "animations/shows",
        element: <CategoryPage />,
        handle: { hide_navbar: false },
      },
      {
        path: "movieInfo",
        element: <MovieInfo />,
        handle: { hide_navbar: true },
      },
      {
        path: "search",
        element: <Movie_Sugesstions />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <SearchProvider>
        <RouterProvider router={routes} />
      </SearchProvider>
    </ErrorBoundary>
  </StrictMode>
);
