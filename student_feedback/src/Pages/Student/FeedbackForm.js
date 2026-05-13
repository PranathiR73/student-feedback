// pages/student/FeedbackForm.jsx
import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const theoryQuestions = [
  "Has the teacher made the objective of the course clear?",
  "Has the teacher taken the class regularly with lecture plan, course evaluation weightage, and course material as per schedule?",
  "Was the content of the syllabus fully covered?",
  "Was the subject understood properly through satisfactory teaching in the classes?",
  "Was the teacher easily accessible for interaction and clearing doubts during and beyond class hours?",
  "Has the teacher stimulated interest in the subject?",
  "Has the question paper reflected the essential components of the subject?",
  "Is the teacher's communication skills satisfactory?",
  "The work load of this course was not too heavy.",
  "The continuous valuation and the evaluation of mid-term examination helped identify gaps and gain knowledge of the subject.",
];

const practicalQuestions = [
  "Was the Labmanual/proper instruction made available?",
  "The experiments provided new insights and/or encouraged to think creatively.",
  "Were the facilities/equipment available in the class adequate for the experiments?",
  "The systematic execution of the experiments and the analysis of the observations were highly encouraged.",
  "The workload of this course was not too heavy.",
];

const courseOnlyQuestions = [
  "Is the content of the course appropriate for the programme you are studying?",
  "Has the course facilitated you in building up concepts and acquiring knowledge?",
  "Is the content of the course not too difficult to understand?",
  "The course syllabus is not too heavy.",
  "Were the subjects learned previously adequate to start learning this subject?",
];

const FeedbackForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { courseId, courseName, facultyName, facultyId, semester } = location.state || {}; // Data passed via navigation

  const [formType, setFormType] = useState("theory");
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState("");

  const questions =
    formType === "theory"
      ? theoryQuestions
      : formType === "practical"
      ? practicalQuestions
      : courseOnlyQuestions;

  const handleChange = (index, value) => {
    setResponses((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      formType,
      student_id: user.student_id,
      faculty_id: facultyId,
      course_id: courseId,
      semester: semester,
      year: user.batch_year,
      responses,
      comments,
    };

    try {
      const res = await fetch(
        "http://localhost:3001/api/student/submit-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
        navigate(`/${user.role}/dashboard`);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (err) {
      toast.error("Server error! "+err);
      console.error(err);
    }
  };

  return (
    <div className="p-6  w-full flex flex-col items-center mx-auto bg-blue-200">
      <h1 className="text-2xl font-semibold leading-snug tracking-wider mb-4 border-b-4 w-full border-yellow-200 shadow-md shadow-black/20 text-center pb-4">
        Feedback Form
      </h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-black mb-2">
          Select Feedback Type:
        </label>
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="w-full max-w-md bg-white/10 text-black border border-purple-300 rounded-md px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
        >
          <option value="theory" className="bg-purple-900 text-white">
            Theory Subject + Teacher
          </option>
          <option value="practical" className="bg-purple-900 text-white">
            Practical Subject + Teacher
          </option>
          <option value="course" className="bg-purple-900 text-white">
            Course Only
          </option>
        </select>
      </div>

      <div className="bg-white/10 border border-purple-300 rounded-lg shadow-md backdrop-blur-sm text-white p-5 mb-6 space-y-2">
        <p className="text-lg text-black">
          <span className="font-semibold text-purple-500">Course ID:</span>{" "}
          {courseId}
        </p>
        <p className="text-lg text-black">
          <span className="font-semibold text-purple-500">Course Name:</span>{" "}
          {courseName}
        </p>
        {formType !== "course" && (
          <p className="text-lg text-black">
            <span className="font-semibold text-purple-500">Faculty Name:</span>{" "}
            {facultyName}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/5 p-6 rounded-xl shadow-md backdrop-blur border border-white/10 text-white max-w-3xl mx-auto"
      >
        {questions.map((q, idx) => (
          <div key={idx} className="border-b border-white/10 pb-4 space-y-2">
            <p className="font-semibold text-purple-500 text-lg tracking-wide leading-snug">
              {idx + 1}. {q}
            </p>
            <div className="flex gap-4 text-base text-purple-300">
              {[5, 4, 3, 2, 1].map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-1 hover:scale-105 transition"
                >
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={val}
                    checked={responses[idx] === String(val)}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    className="accent-purple-600"
                    required
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div>
          <label className="block text-purple-500 font-medium text-lg mb-2 tracking-wide">
            Any other comments :
          </label>
          <textarea
            className="w-full bg-white/10 border border-purple-500 text-black text-lg rounded-lg px-4 py-3 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            rows="4"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write your comment..."
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-6 py-2 rounded-lg shadow transition"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
