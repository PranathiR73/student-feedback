import React, { useContext } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import { AuthContext } from "../../context/AuthContext";

const FacultySettings = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <Sidebar />
      <div className="flex-1">
        <Header userRole="faculty" />

        <main className="p-6">
          <div className="bg-white rounded shadow p-6 max-w-3xl">
            <h2 className="text-2xl font-semibold mb-1">Faculty Settings</h2>
            <p className="text-gray-600 mb-6">
              View your faculty account and department information.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <div className="mt-1 rounded border bg-gray-50 px-3 py-2">
                  {user?.name || "Not available"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <div className="mt-1 rounded border bg-gray-50 px-3 py-2">
                  {user?.email || "Not available"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Faculty ID</label>
                <div className="mt-1 rounded border bg-gray-50 px-3 py-2">
                  {user?.faculty_id || user?.id || "Not available"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Department</label>
                <div className="mt-1 rounded border bg-gray-50 px-3 py-2">
                  {user?.department || "Not available"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Role</label>
                <div className="mt-1 rounded border bg-gray-50 px-3 py-2 capitalize">
                  {user?.role || "faculty"}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              To change these values, update the faculty record from MySQL or the admin dashboard.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultySettings;
