import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Otp() {
  // State for storing OTP input
  const [otp, setOtp] = useState("");
  console.log(otp);
  const navigate = useNavigate();
  // Function to handle OTP input change
  const handleOtpChange = (event) => {
    event.preventDefault();
    setOtp(event.target.value);
  };

  // Function to handle OTP verification
  const verifyOtp = async () => {
    // Implement OTP verification logic here
    console.log("Verifying OTP:", otp);
    // You can send a request to your backend to verify the OTP

    try {
      const res = await fetch("/api/users/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otp }),
      });
      const data = await res.json(res);
      console.log();
      if (data.error) {
        toast.error(data.error);
        setOtp("");
        return;
      }
      toast.success(data.message);
      setOtp(data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-20 bg-green-50 pb-10 mx-auto max-w-xl h-3/4">
      <div className="justify-center items-center bg-white p-10 rounded-lg shadow-lg mt-20">
        <h2 className="text-center text-2xl font-bold mb-5">
          OTP Verification
        </h2>
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
        >
          <input
            className="border  p-2 rounded-md"
            name="otp"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
          />
          <button
            className="bg-green-500 text-white p-2 rounded-md"
            type="submit"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default Otp;
