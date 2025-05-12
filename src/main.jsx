import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import Layout from "./Layout.jsx";
import { SearchProvider } from "./Context/Searchcontext.jsx";
import PageNotFound from "./Pages/PageNotFound.jsx";
import ErrorBoundary from "./Components/ErrorBoundary";
import Movie_Sugesstions from "./Pages/Movie_Sugesstions.jsx";
import MoviesPage from "./Pages/MoviesPage.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";
import MediaDetails from "./Pages/MediaDetails.jsx";

const categories = [
  "animations",
  "action",
  "adventure",
  "horror",
  "drama",
  "comedy",
];
const types = ["movies", "shows"];

const categoryRoutes = categories.flatMap((category) =>
  types.map((type) => ({
    path: `${category}/${type}`,
    element: <CategoryPage />,
  }))
);

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "movies",
        element: <MoviesPage />,
      },
      {
        path: "tv_series",
        element: <MoviesPage />,
      },
      ...categoryRoutes,

      {
        path: "search/movies",
        element: <Movie_Sugesstions />,
      },
      {
        path: "search/shows",
        element: <Movie_Sugesstions />,
      },
      {
        path: "media/:id",
        element: <MediaDetails />,
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
