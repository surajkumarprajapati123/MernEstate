import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/users/get/${listing.userRef}`, {
          method: "GET",
        });
        const data = await res.json();
        setLandlord(data);
        console.log({ data });
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);
  return (
    <div>
      {landlord && (
        <div>
          <p className="mb-2">
            {" "}
            <div className="flex items-center gap-2 mb-2">
              <MdOutlineEmail /> <span>Contact </span>
            </div>
            <span className="font-semibold"> {landlord.email} </span> for{" "}
            <span className="font-semibold">
              {landlord.username.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg mb-3"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}

export default Contact;
