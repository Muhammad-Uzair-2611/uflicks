import { useState, createContext, useContext } from "react";

const movieInfoContext = createContext();

export function MoviesInfoProvider({ children }) {
  const [movieId, setMovieId] = useState(sessionStorage.getItem("movieID"));
  const [isAllowed, setIsAllowed] = useState(
    sessionStorage.getItem("isAllowed", false)
  );

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
