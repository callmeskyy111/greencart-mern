import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

function App() {
  //checking if it's 'seller' path or not
  const isSellerPtah = useLocation().pathname.includes("seller");
  return (
    <div>
      {isSellerPtah ? null : <Navbar />}
      <Toaster />
      <div
        className={`${isSellerPtah ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route />
          <Route />
        </Routes>
      </div>
    </div>
  );
}

export default App;

//02:03
