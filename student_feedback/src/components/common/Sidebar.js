import { CiSettings } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import { PiSignOutThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  const handleSignOut = () => {
    logout();
    toast.success("Sign Out Successful");
    navigate("/");
  };

  return (
    <div className="w-64 bg-blue-400 shadow p-4 flex flex-col justify-between">
      <div>
        <div className="text-3xl font-bold mb-6 underline underline-offset-8 decoration-yellow-500 decoration-2">
          Dashboard
        </div>

        <div className="text-sm text-gray-900 space-y-4">
          <button
            type="button"
            className="w-full flex gap-2 items-center text-lg font-semibold border-b py-2 text-left"
            onClick={() => role && navigate(`/${role}/dashboard`)}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </button>

          {(role === "student" || role === "faculty") && (
            <button
              type="button"
              className="w-full flex gap-2 items-center text-lg font-semibold border-b pb-2 text-left"
              onClick={() => navigate(`/${role}/settings`)}
            >
              <CiSettings />
              <span>Settings</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex gap-2 items-center text-lg font-semibold border-b pb-2 text-left"
          >
            <PiSignOutThin />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
