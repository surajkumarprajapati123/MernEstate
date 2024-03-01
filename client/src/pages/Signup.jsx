import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/User/UserSlice";
import OAuth from "../Components/OAuth";

function Signup() {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const [datafrom, setFormData] = useState({});
  const [loading, setloading] = useState(false);
  const [error, setErrors] = useState();

  const handleChange = (e) => {
    setFormData({
      ...datafrom,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispath(signInStart());
    try {
      // dispatch(signInStart());
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datafrom),
      });
      console.log({ res });
      const data = await res.json();
      console.log(data);

      if (data.success === false || data.error) {
        console.log(data.message);
        toast.error(data.message);
        toast.error(data.error);
        dispath(signInFailure(data.message));
        return;
      }
      toast.success("Otp sent successfully");
      dispath(signInSuccess(data.user));
      navigate("/otp");
    } catch (error) {
      console.log("erroris ", error);
      dispath(signInFailure(error.message));
    }

    setFormData({});
    setloading(false);
  };

  return (
    <div className="pt-20 bg-green-50 pb-10">
      <h1 className="text-3xl font-bold text-center my-6">Sign up</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-[400px] w-full mx-auto bg-white p-4 flex flex-col gap-4"
      >
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          autoComplete="off"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          autoComplete="off"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Signup"}
        </button>
        <OAuth />
      </form>

      <div className="max-w-[400px] w-full mx-auto bg-white p-4 flex flex-col gap-4">
        <p className="text-center text-gray-700">
          Have an account?{" "}
          <Link
            className="text-blue-500 hover:underline hover:text-blue-700"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
      {/* {error && <p className="text-red-500 mt-5 text-center">{error}</p>} */}
    </div>
  );
}

export default Signup;
