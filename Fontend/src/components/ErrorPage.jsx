import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const handleBackToHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={handleBackToHomeClick}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md"
      >
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;
