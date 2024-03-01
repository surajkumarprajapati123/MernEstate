import { FaSearch } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((data) => data.user);
  // console.log(currentUser.avatar);
  const location = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handelSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm");
    if (searchTerm) {
      setSearchTerm(searchTerm);
    }
    setSearchTerm("");
  }, [location.search]);
  return (
    <header className="   bg-green-200 fixed z-10 w-full  shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Suraj</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handelSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="rounded-full w-8 h-8 object-cover"
                src={currentUser.avatar}
                alt="progile image"
              />
            ) : (
              <li className="hidden bg-red-800 sm:inline p-5 text-slate-700  bg-clip-text text-transparent hover:underline">
                Signin
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
