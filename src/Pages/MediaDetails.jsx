import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { getMovieDetails, getImageURL } from "../services/movie_api";
import { useMovieInfo } from "../Context/MovieInfoContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MediaDetails = () => {
  const { isAllowed, movieId: id, setIsAllowed } = useMovieInfo();
  const [mediaInfo, setMediaInfo] = useState({});
  const [ImageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAllowed) {
      const allowedFromStorage = JSON.parse(sessionStorage.getItem("isAllowed"));
      if (!allowedFromStorage) {
        navigate("/", { replace: true }); // Redirect to home or a safe route
      } else {
        setIsAllowed(true);
      }
    }
  }, [isAllowed, navigate, setIsAllowed]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [imageURl, details] = await Promise.all([
          getImageURL(),
          getMovieDetails(id.id),
        ]);
        console.log(details);
        setImageURL(imageURl);
        setMediaInfo(details);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isAllowed && id) {
      fetchData();
    }
  }, [isAllowed, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <motion.div
          className="bg-neutral-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg border border-neutral-700"
          initial={{ opacity: 0, y: -20 }}
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
  return (
    <div className="relative">
      <div className="backImage w-full h-[90%] absolute -z-10 ">
        <img
          className="w-full h-full blur-xs"
          src={`${ImageURL?.url}${ImageURL?.banner_sizes[3]}${mediaInfo.banner}`}
          alt=""
        />
      </div>
      <div className="h-50  px-3 py-2">
        <span onClick={() => navigate(-1)} className="text-4xl cursor-pointer">
          <IoArrowBack />
        </span>
      </div>
      <div className="flex gap-x-4 mx-15">
        <div className="z-10">
          <div
            id="poster"
            className=" w-60 overflow-hidden h-95 shadow-sm shadow-gray-400"
          >
            <img
              className="w-full h-full"
              src={`${ImageURL?.url}${ImageURL?.sizes[2]}${mediaInfo.poster}`}
              alt=""
            />
          </div>
          <div
            id="genres"
            className="mt-5 flex w-40 gap-y-3 shrink-0 flex-wrap gap-x-2 [&>span]:bg-gray-300 [&>span]:rounded-xl 
            [&>span]:py-1 [&>span]:w-18 [&>span]:text-center [&>span]:text-sm [&>span]:text-gray-600 
            [&>span]:font-semibold [&>span]:px-2 [&>span]:pt-2"
          >
            {}
          </div>
        </div>
        <div className="Info mb-20">
          <div className="mb-6">
            <div className="md:text-2xl -space-x-1.5 font-semibold tracking-wider">
              <span>{mediaInfo.title}</span>{" "}
              <span className="text-[16px] text-neutral-300 ">
                ({mediaInfo.release.split("-").slice(0, 1)})
              </span>
            </div>
            <div className="py-0 text-gray-200 tracking-wide">
              {mediaInfo.tagline || "A story worth watching."}
            </div>
          </div>
          <div className="space-y-4">
            <div
              className="border-y border-white rounded-xs w-130 text-sm  gap-x-2 flex items-center shrink-0 flex-wrap 
          [&_h2]:text-neutral-300 [&>div]:flex [&>div]:gap-x-2"
            >
              <div className="   items-center [&>span]:text-amber-300">
                <h2 className="">Genres - </h2>
                {mediaInfo.genres.map((genre, index) => (
                  <span key={index}>{genre}</span>
                ))}
              </div>
              {"|"}
              <div className="">
                <h2 className="">Release - </h2>
                <span>{mediaInfo.release}</span>
              </div>
              {"|"}
              <div>
                <h2 className="">Production Companies - </h2>
                {mediaInfo.productionCompanies.map((comp, index) => (
                  <span key={index}>{`${comp} ${
                    index != mediaInfo.productionCompanies.length - 1 ? "," : ""
                  }`}</span>
                ))}
              </div>
              {"|"}
              <div>
                <h2 className="">Status - </h2>
                <span>{mediaInfo.status}</span>
              </div>
              {"|"}
              <div>
                <h2 className="">Languages - </h2>
                {mediaInfo.spoken_languages.map((lang, index) => (
                  <span key={index}>{`${lang} ${
                    index != mediaInfo.spoken_languages.length - 1 ? "," : ""
                  }`}</span>
                ))}
              </div>
              {"|"}
              <div>
                <h2 className="">Type - </h2>
                <span>{id.type === "movie" ? "Movie" : "Show"}</span>
              </div>
            </div>

            <div
              className="border-y border-white rounded-xs w-130 text-sm  gap-x-2 flex items-center shrink-0 flex-wrap 
          [&_h2]:text-neutral-300 [&>div]:flex [&>div]:gap-x-2"
            >
              <div>
                <h2 className="">Run Time - </h2>
                <span>{mediaInfo.runtime} Minutes</span>
              </div>
              {"|"}
              <div>
                <h2 className="">Budget - </h2>
                <span>{mediaInfo.budget}</span>
              </div>
              {"|"}
              <div>
                <h2 className="">Revenue - </h2>
                <span>{mediaInfo.revenue}</span>
              </div>
              {"|"}
              <div>
                <h2 className="">Rating on TMBD - </h2>
                <span>{JSON.stringify(mediaInfo.rating).slice(0, 3)}</span>
              </div>
              {"|"}
              <div>
                <h2 className="">Vote Count - </h2>
                <span>{mediaInfo.vote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;
