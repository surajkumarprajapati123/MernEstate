import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/User/UserSlice";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import OAuth from "../Components/OAuth";
export default function Login() {
  const [formData, setFormData] = useState({});
  console.log({ formData });
  // const { loading, error } = useSelector((state) => state.user);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     dispatch(signInStart());
  //     const res = await fetch("/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     console.log(data.success);
  //     // toast.success("Login Successful");
  //     if (data.success === false) {
  //       dispatch(signInFailure(data.message));
  //       toast.error(data.message);

  //       return;
  //     }
  //     toast.success("Login Successful");
  //     dispatch(signInSuccess(data));
  //     setFormData({});
  //     navigate("/");
  //   } catch (error) {
  //     console.log("erroris ", error);
  //     toast.error(error.message);
  //     dispatch(signInFailure(error.message));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      // dispatch(signInStart());
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("this is a data", data);
      if (data.error) {
        // dispatch(signInFailure(data.message));

        toast.error(data.error);
        setloading(false);
        return;
      }
      dispatch(signInSuccess(data));
      toast.success("Login Successful");

      // setFormData({});
      navigate("/");
    } catch (error) {
      // dispatch(signInFailure(error.message));
      toast.error("somthing went wrong");
      setloading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto pt-20 bg-green-50 pb-10">
      <h1 className="text-3xl text-center font-semibold my-7">Login </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          autoComplete="off"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          autoComplete="off"
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {/* {loading ? "Loading..." : "Login"} */} Login
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {/* {error && <p className="text-red-500 mt-5">{error}</p>} */}
    </div>
  );
}
