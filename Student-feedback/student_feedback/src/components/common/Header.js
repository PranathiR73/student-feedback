import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/collegelogo.png";

const Header = ({
  userRole,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search here...",
}) => {
  const { user } = useContext(AuthContext);
  const isSearchEnabled = typeof onSearchChange === "function";

  return (
    <div className="flex flex-col gap-4 px-6 py-4 bg-yellow-200 shadow lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-4 items-center">
        <img src={logo} alt="College logo" className="h-12 w-auto rounded-full" />
        <h1 className="text-xl font-bold md:text-2xl">
          Maharaja Institute of Technology, Mysore
        </h1>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={isSearchEnabled ? searchValue : ""}
            onChange={(event) => isSearchEnabled && onSearchChange(event.target.value)}
            disabled={!isSearchEnabled}
            className="w-full border rounded pl-8 pr-4 py-1 disabled:bg-gray-100 disabled:text-gray-400 md:w-64"
          />
          <FaSearch className="absolute top-2 left-2 text-gray-400" />
        </div>

        <div className="text-sm text-right">
          <div>
            {userRole === "admin"
              ? "Admin's portal"
              : userRole === "faculty"
              ? "Professor"
              : "Student"}
          </div>
          <div className="font-semibold">{user?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
