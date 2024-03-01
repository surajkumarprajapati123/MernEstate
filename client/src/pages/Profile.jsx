import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  userSignOutError,
  userSignOutSuccess,
} from "../redux/User/UserSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log(currentUser);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        toast.error(data.message);
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      // setUpdateSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleChangeDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Profile deleted successfully!");
    } catch (error) {
      toast.error(error.message);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handelsignOutUser = async () => {
    try {
      dispatch(signInStart());
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        toast.error(data.message);
        dispatch(userSignOutError(data.message));
        return;
      }
      dispatch(userSignOutSuccess(data.message));
      toast.success("User signed out successfully!");
    } catch (error) {
      dispatch(userSignOutError(error.message));
    }
  };
  const handelShowlisting = async (e) => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/users/getone/${currentUser._id}`);
      const data = await res.json();
      console.log({ data });
      if (data.message === false) {
        toast.error("No listings found");
        setShowListingsError(true);
        return;
      }
      toast.success("Listings found");
      setUserListings(data);
    } catch (error) {
      toast.error("No listings found");
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`api/users/listing/delete/${id}`, {
        method: "DELETE",
      });
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
      toast.success("Listing deleted successfully");
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      toast.success();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto pt-20 bg-green-50 pb-10">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleChangeDelete}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handelsignOutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>

      {/* <p className="text-red-700 mt-5">{error ? error : ""}</p> */}
      {/* <p className="text-green-700 mt-5">
        {updateSuccess ? toast.success("Profile updated successfully!") : ""}
      </p> */}
      <button
        onClick={handelShowlisting}
        className="text-green-700 w-full mb-5"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div className="max-w-md mx-auto bg-white  shadow-md rounded-lg overflow-hidden mb-4">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-64 w-full object-cover object-center"
                />
              </Link>
              <div className="p-4">
                <Link
                  className="text-gray-900 font-semibold text-xl truncate block hover:underline mb-2"
                  to={`/listing/${listing._id}`}
                >
                  {listing.name}
                </Link>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-xs uppercase py-2 px-4 border bg-red-600 text-white rounded-lg hover:bg-red-700 hover:text-white-900 mr-2"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-xs uppercase py-2 px-4 border bg-green-600 text-white rounded-lg hover:bg-green-700 hover:text-white-900">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
