import { useState, createContext, useContext, useEffect } from "react";

const movieInfoContext = createContext();

export function MoviesInfoProvider({ children }) {
  const [movieId, setMovieId] = useState(sessionStorage.getItem("movieID"));
  let isAllow = JSON.parse(sessionStorage.getItem("isAllowed"));
  const [isAllowed, setIsAllowed] = useState(isAllow ? isAllow : false);

  //*Effects
  useEffect(() => {
    sessionStorage.setItem("movieID", movieId);
  }, [movieId]);
  return (
    <movieInfoContext.Provider
      value={{ movieId, setMovieId, isAllowed, setIsAllowed }}
    >
      {children}
    </movieInfoContext.Provider>
  );
}

export const useMovieInfo = () => {
  return useContext(movieInfoContext);
};
