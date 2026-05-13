import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SubjectTable = ({ title, subjects }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleClick = (subject) => {
    if (!user?.role || !subject) return;

    navigate(`/${user.role}/sendfeedback`, {
      state: {
        courseId: subject.course_id,
        courseName: subject.course_name,
        facultyName: subject.faculty_name,
        facultyId: subject.faculty_id,
        semester: subject.semester,
      },
    });
  };

  return (
    <div className="bg-blue-300 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      {subjects.length === 0 ? (
        <div className="rounded bg-blue-100 p-4 text-sm text-gray-700">
          No subjects available in this category.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead className="text-sm text-gray-600 border-b">
              <tr>
                <th className="p-2">Course ID</th>
                <th className="p-2">Course Name</th>
                <th className="p-2">Faculty Name</th>
                <th className="p-2">Add Feedback</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.course_id} className="border-t text-sm">
                  <td className="p-2">{subject.course_id}</td>
                  <td className="p-2">{subject.course_name}</td>
                  <td className="p-2">{subject.faculty_name || "Not assigned"}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      className="px-3 py-1 text-white bg-purple-500 hover:bg-purple-600 rounded"
                      onClick={() => handleClick(subject)}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectTable;
