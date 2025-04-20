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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <App />,
        handle: { hide_Search_n_navbar: false },
      },
      {
        path: "movieInfo",
        element: <MovieInfo />,
        handle: { hide_Search_n_navbar: true },
      },
      {
        path: "search",
        element: <Movie_Sugesstions />,
      },
      {
        path: "*",
        element: <PageNotFound />,
        handle: { hideSearch: true },
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
