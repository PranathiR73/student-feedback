import React, { useState } from "react";

function FeedbackForm() {
  const [formType, setFormType] = useState("theory");
  const [student_id, setStudentId] = useState("");
  const [faculty_id, setFacultyId] = useState("");
  const [course_id, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [responses, setResponses] = useState(Array(10).fill(""));
  const [comments, setComments] = useState("");

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      formType,
      student_id,
      faculty_id,
      course_id,
      semester,
      year,
      responses,
      comments,
    };

    try {
      const res = await fetch("http://localhost:3001/api/student/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();
      alert(data.message || "Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Submit Feedback</h2>

      <form onSubmit={handleSubmit}>
        <label>Form Type:</label>
        <select value={formType} onChange={(e) => setFormType(e.target.value)}>
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
          <option value="course">Course</option>
        </select>

        <input
          type="text"
          placeholder="Student ID"
          value={student_id}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        {formType !== "course" && (
          <input
            type="text"
            placeholder="Faculty ID"
            value={faculty_id}
            onChange={(e) => setFacultyId(e.target.value)}
            required
          />
        )}

        <input
          type="text"
          placeholder="Course ID"
          value={course_id}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <h4>Rate Questions (1–5)</h4>
        {responses.map((r, i) => (
          <input
            key={i}
            type="number"
            min="1"
            max="5"
            placeholder={`Q${i + 1}`}
            value={r}
            onChange={(e) => handleResponseChange(i, e.target.value)}
            required={i < (formType === "theory" ? 10 : 5)}
          />
        ))}

        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
