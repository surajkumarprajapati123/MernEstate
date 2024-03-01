import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

import Contact from "./Components/Contact";
import Header from "./Components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import PrivateRoutes from "./Components/PrivateRoutes";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Fotter from "./pages/Fotter";
import Otp from "./pages/Otp";

function App() {
  return (
    <div className=" bg-green-50 ">
      <ToastContainer />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/listing/:listingId" element={<Listing />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
        <Fotter />
      </Router>
    </div>
  );
}

export default App;
