import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { getMoviebyID, getImageURL } from "../services/movie_api";
import { useMovieInfo } from "../Context/MovieInfoContext";
import { useNavigate } from "react-router-dom";

const MovieInfo = () => {
  const { isAllowed, movieId: id } = useMovieInfo();
  const [movieInfo, setMovieInfo] = useState({});
  const [ImageURL, setImageURL] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMovieById() {
      !isAllowed && navigate(-1);
      const response = await getMoviebyID(id);
      const imageURl = await getImageURL();
      setImageURL(imageURl);
      setMovieInfo(response);
      JSON.stringify(sessionStorage.setItem("isAllowed", isAllowed));
      console.log(
        imageURl.url + " " + imageURl.banner_sizes[2] + "  " + response.banner
      );
    }
    getMovieById();
  }, []);

  return (
    <div className="relative">
      <div className="backImage w-fit h-screen blur-xs absolute -z-10 border">
        <img
          className="w-full h-full"
          src={`${ImageURL?.url}${ImageURL?.banner_sizes[3]}${movieInfo.banner}`}
          alt=""
        />
      </div>
      <div className="h-50 border  px-3 py-2">
        <span onClick={() => navigate(-1)} className="text-4xl cursor-pointer">
          <IoArrowBack />
        </span>
      </div>
      <div className="flex gap-x-13 mx-15">
        <div className="z-10">
          <div
            id="poster"
            className=" w-38 overflow-hidden h-60 shadow-sm shadow-gray-400"
          >
            <img className="w-full h-full" src="./Capture.PNG" alt="" />
          </div>
          <div
            id="genres"
            className="mt-5 flex w-40 gap-y-4 shrink-0 flex-wrap gap-x-2 
          [&>span]:bg-gray-300 [&>span]:rounded-2xl [&>span]:py-1 
          [&>span]:text-sm [&>span]:text-gray-600 [&>span]:font-semibold [&>span]:px-2"
          >
            <span>Action</span>
            <span>Adventure</span>
            <span className="">Drama</span>
            <span className="">Drama</span>
            <span className="">Drama</span>
          </div>
        </div>
        <div className="Info mb-20">
          <div className="mb-10">
            <div className="md:text-5xl font-semibold">Inception</div>
            <div className="py-1 text-gray-300">
              truth is matter of perspective
            </div>
          </div>
          <div className="text-sm tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            ad excepturi cupiditate, aspernatur dolores aut, voluptate odio
            deserunt atque reiciendis voluptatibus inventore rerum neque eius
            quia vitae sapiente a commodi sequi blanditiis illum. Fugit quos
            laudantium consectetur laboriosam perspiciatis inventore dignissimos
            dicta facere aliquid placeat, minima molestiae earum quidem,
            architecto tempora nostrum repellat harum omnis dolorem possimus
            eaque, sequi praesentium dolores? Sapiente consequuntur aperiam
            molestiae deleniti consectetur. Odio voluptates odit quisquam, porro
            doloremque impedit quis ut officiis nobis explicabo non provident
            fuga autem dolore reprehenderit itaque similique illum deleniti
            accusantium.
          </div>
          <div className="mt-3 text-xl">Release Date: 10-20-1998</div>
          <div>Type: Movie</div>
          <div>Length: 180 Minutes</div>
          <div>Rating: 7.3 on IMBD</div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
