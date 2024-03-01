import React from "react";

function Fotter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 mb-0 fixed bottom-0 w-full z-10">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SurajEstate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Fotter;
