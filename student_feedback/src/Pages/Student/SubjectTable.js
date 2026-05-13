import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SubjectTable = ({ title, subjects }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleClick = (subj) => {
        if (!user?.role || !subj) return;

        navigate(/${user.role}/sendfeedback, {
            state: {
                courseId: subj.course_id,
                courseName: subj.course_name,
                facultyName: subj.faculty_name,
                facultyId: subj.faculty_id,
                semester: subj.semester
            },
        });
    };

    return (
        <div className="bg-blue-300 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            <table className="w-full text-left border-collapse">
                <thead className="text-sm text-gray-600 border-b">
                    <tr>
                        <th className="p-2">Course ID</th>
                        <th className="p-2">Course Name</th>
                        <th className="p-2">Faculty Name</th>
                        <th className="p-2">Add Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subj, idx) => (
                        <tr key={idx} className="border-t text-sm">
                            <td className="p-2">{subj.course_id}</td>
                            <td className="p-2">{subj.course_name}</td>
                            <td className="p-2">{subj.faculty_name}</td>
                            <td className="p-2">
                                <button 
                                    className="px-3 py-1 text-white bg-purple-500 hover:bg-purple-600 rounded" 
                                    onClick={() => handleClick(subj)}
                                >
                                    Add
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectTable;