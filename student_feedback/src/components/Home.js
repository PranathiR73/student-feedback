import React from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../assets/02.png";
import collegelogo from "../assets/collegelogo.png";

function Home() {
  const navigate = useNavigate();

  const studentHandler = () => {
    navigate("/studentLoginPage");
  };

  const adminHandler = () => {
    navigate("/adminLoginPage");
  };

  const facultyHandler = () => {
    navigate("/facultyLoginPage");
  };

  const myStyle = {
    backgroundImage: `url(${bgimage})`,
  };

  return (
    <div className="relative w-full h-screen">
      <div
        style={myStyle}
        className="bg-cover bg-center h-screen blur-sm absolute -z-10 w-full"
      ></div>

      <img
        src={collegelogo}
        className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 rounded-full"
        alt="College Logo"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
        <h2 className="bg-dodger blue-400 text-[20px] md:text-[30px] px-5 py-3 font-semibold rounded-md mb-4">
          Maharaja Institute of Technology,Mysore
        </h2>

        <h1 className="bg-blue-950 text-white text-[32px] md:text-[48px] lg:text-[60px] font-semibold px-5 py-3 rounded-3xl mb-6">
          STUDENT FEEDBACK SYSTEM
        </h1>

        <p className="text-white text-[20px] md:text-[25px] mb-4">Login As</p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-md justify-center">
          <button
            className="bg-blue-950 text-white font-semibold rounded-3xl py-2 px-6 text-[24px] md:text-[30px] hover:bg-yellow-500 hover:text-blue-800 transition-all duration-300"
            onClick={studentHandler}
          >
            Student
          </button>
          <button
            className="bg-blue-950 text-white font-semibold rounded-3xl py-2 px-6 text-[24px] md:text-[30px] hover:bg-yellow-500 hover:text-blue-800 transition-all duration-300"
            onClick={adminHandler}
          >
            Admin
          </button>
          <button
            className="bg-blue-950 text-white font-semibold rounded-3xl py-2 px-6 text-[24px] md:text-[30px] hover:bg-yellow-500 hover:text-blue-800 transition-all duration-300"
            onClick={facultyHandler}
          >
            Faculty
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
