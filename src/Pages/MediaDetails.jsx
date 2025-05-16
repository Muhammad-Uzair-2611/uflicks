import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import {
  getMovieDetails,
  getImageURL,
  getBackDropImages,
} from "../services/movie_api";
import { useMovieInfo } from "../Context/MovieInfoContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ImageGallery from "../Components/ImageGallery ";

const MediaDetails = () => {
  //* States
  const { isAllowed, movieId: id, setIsAllowed } = useMovieInfo();
  const [mediaInfo, setMediaInfo] = useState({});
  const [sceneShots, setSceneShots] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [ImageURL, setImageURL] = useState();
  // usests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //*Functions
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  //*Effects
  useEffect(() => {
    if (!isAllowed) {
      const allowedFromStorage = JSON.parse(
        sessionStorage.getItem("isAllowed")
      );
      if (!allowedFromStorage) {
        navigate("/");
      } else {
        setIsAllowed(true);
      }
    }
  }, [isAllowed, navigate, setIsAllowed]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [imageURl, details, sceneShots] = await Promise.all([
          getImageURL(),
          getMovieDetails(id.id),
          getBackDropImages(id.id),
        ]);
        const shuffledArray = shuffleArray(sceneShots);

        setSceneShots(shuffledArray);
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
      <div className="relative">
        <div className=" h-fit relative ">
          <div className="backImage w-full h-[95%] absolute -z-10 ">
            <div className={`absolute z-15 bg-black/40 inset-0 `}> </div>
            <img
              className="w-full h-full "
              src={`${ImageURL?.url}${ImageURL?.banner_sizes[3]}${mediaInfo.banner}`}
              alt=""
            />
          </div>
          <div className="h-50 px-4 py-3">
            <span
              onClick={() => navigate(-1)}
              className="text-4xl cursor-pointer"
            >
              <IoArrowBack />
            </span>
          </div>
          <div className="flex gap-x-8 mx-16">
            <div className="z-10  h-fit flex flex-col items-center justify-center gap-y-5">
              <div
                id="poster"
                className="w-60 overflow-hidden h-95 shadow-sm shadow-gray-400 cursor-pointer"
              >
                <a href={mediaInfo.ticket} target="_blank">
                  <img
                    className="w-full h-full"
                    src={`${ImageURL?.url}${ImageURL?.sizes[2]}${mediaInfo.poster}`}
                    alt=""
                  />
                </a>
              </div>
              <a href={mediaInfo.ticket || "/notFound "} target="_blank">
                <button className="transition-all bg-amber-400 text-black py-2  font-semibold cursor-pointer px-5 rounded-sm hover:scale-102 translate-y-1 hover:translate-y-0 duration-400 hover:shadow-md  hover:shadow-amber-200">
                  Visit Official Site
                </button>
              </a>
            </div>
            <div className="Info mb-20">
              <div className="mb-8">
                <div className="md:text-2xl -space-x-1.5 font-semibold tracking-wider">
                  <span>{mediaInfo.title}</span>{" "}
                  <span className="text-[16px] text-neutral-300">
                    ({mediaInfo.release.split("-").slice(0, 1)})
                  </span>
                </div>
                <div className="py-2 text-amber-400 tracking-wide">
                  {mediaInfo.tagline || "A story worth watching."}
                </div>
              </div>
              <div className="space-y-4">
                <div
                  className="border-y backdrop-blur-xs  bg-black/40 border-white rounded-md  px-2 w-full text-sm gap-x-4 flex items-center shrink-0 flex-wrap py-3
          [&_h2]:text-neutral-300 [&>div]:flex [&>div]:gap-x-2 [&>div]:text-nowrap [&>div]:flex-wrap"
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
                  <div className="">
                    <h2 className="">Production Companies - </h2>
                    {mediaInfo.productionCompanies.map((comp, index) => (
                      <span key={index}>{`${comp} ${
                        index != mediaInfo.productionCompanies.length - 1
                          ? ","
                          : ""
                      }`}</span>
                    ))}
                    {"|"}
                  </div>
                  <div>
                    <h2 className="">Status - </h2>
                    <span>{mediaInfo.status}</span>
                  </div>
                  {"|"}
                  <div>
                    <h2 className="">Languages - </h2>
                    {mediaInfo.spoken_languages.map((lang, index) => (
                      <span key={index}>{`${lang} ${
                        index != mediaInfo.spoken_languages.length - 1
                          ? ","
                          : ""
                      }`}</span>
                    ))}
                  </div>
                  {"|"}
                  <div>
                    <h2 className="">Type - </h2>
                    <span>{id.type === "movies" ? "Movie" : "Show"}</span>
                  </div>
                </div>

                <div
                  className="border-y backdrop-blur-xs  bg-black/40 px-2 border-white rounded-md w-full text-sm gap-x-4 flex items-center shrink-0 flex-wrap py-3
          [&_h2]:text-neutral-300 [&>div]:flex [&>div]:gap-x-2"
                >
                  <div>
                    <h2 className="">Run Time - </h2>
                    <span>{mediaInfo.runtime} Minutes</span>
                  </div>
                  {"|"}
                  <div>
                    <h2 className="">Budget - </h2>
                    <span>{mediaInfo.budget || "Not Available"}</span>
                  </div>
                  {"|"}
                  <div>
                    <h2 className="">Revenue - </h2>
                    <span>{mediaInfo.revenue || "Not Available"}</span>
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
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
                    <h2 className="text-xl font-semibold text-amber-400 tracking-wide">
                      Overview
                    </h2>
                  </div>
                  <div className="backdrop-blur-xs bg-black/40 p-6 h-fit border-y  flex flex-col items-start gap-y-4 justify-center rounded-md w-full">
                    {mediaInfo.overview}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2 px-4">
            <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
            <h2 className="text-3xl tracking-widest font-semibold text-white ">
              Photos
            </h2>
          </div>
          <div className="w-full h-full">
            <div className="flex shrink-0 mb-10 flex-wrap gap-x-4 gap-y-5 w-full items-center px-5 h-fit">
              {sceneShots.map((path, index) =>
                index <= 5 ? (
                  <div
                    key={index}
                    className="cursor-pointer w-fit h-fit rounded-md overflow-hidden"
                  >
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      src={`${ImageURL?.url}${ImageURL?.banner_sizes[0]}${path}`}
                      alt={`Photo-${index}`}
                    />
                  </div>
                ) : index == 6 ? (
                  <div
                    onClick={() => {
                      setShowGallery(true);
                    }}
                    key={index}
                    className="cursor-pointer w-fit h-fit  hover:scale-105 transition-transform duration-300 rounded-md overflow-hidden relative"
                  >
                    <div className="absolute w-full h-full bg-black/60 backdrop-blur-xs z-10 text-5xl flex items-center justify-center">
                      <span>{`+${sceneShots.length}`}</span>
                    </div>
                    <img
                      className="w-full h-full object-cover"
                      src={`${ImageURL?.url}${ImageURL?.banner_sizes[0]}${path}`}
                      alt={`Photo-${index}`}
                    />
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {showGallery && (
        <ImageGallery
          images={sceneShots}
          ImgSource={ImageURL}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
};

export default MediaDetails;
