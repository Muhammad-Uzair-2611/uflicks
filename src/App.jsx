import React from "react";
import ErrorBoundary from "./Components/ErrorBoundary";
import Hero from "./Components/Hero";
import Sliders from "./Components/Sliders";

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Hero />
        <Sliders />
      </div>
    </ErrorBoundary>
  );
}

export default App;
