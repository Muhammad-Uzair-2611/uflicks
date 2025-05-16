import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-6xl font-bold mb-4">404</h1>
      <p className="text-lg sm:text-xl mb-6 text-center">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        onClick={() => navigate("/")}
        className="px-4 py-2 sm:px-6 sm:py-3 bg-amber text-black rounded-lg shadow hover:scale-102 transition font-semibold"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;
