// src/Pages/Admin/Dashboard.js
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";

const AdminDashboard = () => {
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);

  // Faculty form state
  const [facultyName, setFacultyName] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyDept, setFacultyDept] = useState("");

  // Course form state
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseSem, setCourseSem] = useState("");
  const [courseType, setCourseType] = useState("Theory");
  const [courseFacultyId, setCourseFacultyId] = useState("");

  // Change Faculty of a Course state
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newFacultyId, setNewFacultyId] = useState("");

  // Rating state
  const [selectedRatingFaculty, setSelectedRatingFaculty] = useState("");
  const [averageFacultyRating, setAverageFacultyRating] = useState(0);
  const [totalFacultyFeedbacks, setTotalFacultyFeedbacks] = useState(0);
  const [selectedRatingCourse, setSelectedRatingCourse] = useState("");
  const [averageCourseRating, setAverageCourseRating] = useState(0);
  const [totalCourseFeedbacks, setTotalCourseFeedbacks] = useState(0);

  const API_URL = "http://localhost:3001/api/admin";

  // Fetch initial data
  useEffect(() => {
    fetch(`${API_URL}/faculty`)
      .then((res) => res.json())
      .then((data) => setProfessors(data))
      .catch((err) => console.error(err));

    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, []);

  // Add new faculty
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!facultyName || !facultyEmail || !facultyDept) {
      toast.error("All faculty fields are required!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: facultyName,
          email: facultyEmail,
          department: facultyDept,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add faculty");

      toast.success("Faculty added successfully!");
      setFacultyName("");
      setFacultyEmail("");
      setFacultyDept("");
      setProfessors((prev) => [
        ...prev,
        {
          ...data,
          name: facultyName,
          email: facultyEmail,
          department: facultyDept,
          faculty_id: data.facultyId,
        },
      ]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Add new course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseId || !courseName || !courseSem || !courseType || !courseFacultyId) {
      toast.error("All course fields are required!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          courseName,
          semester: courseSem,
          courseType,
          facultyId: courseFacultyId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add course");

      toast.success("Course added successfully!");
      setCourseId("");
      setCourseName("");
      setCourseSem("");
      setCourseType("Theory");
      setCourseFacultyId("");
      setCourses((prev) => [
        ...prev,
        {
          course_id: courseId,
          course_name: courseName,
          semester: courseSem,
          course_type: courseType,
          faculty_id: courseFacultyId,
        },
      ]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Change faculty of a course
  const handleChangeFaculty = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !newFacultyId) {
      toast.error("Please enter both course ID and faculty ID.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/courses/${selectedCourseId}/faculty`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newFacultyId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update faculty");

      toast.success("Faculty updated for selected course!");
      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === selectedCourseId
            ? { ...c, faculty_id: newFacultyId }
            : c
        )
      );
      setSelectedCourseId("");
      setNewFacultyId("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // View faculty rating
  const handleViewFacultyRating = async (e) => {
    e.preventDefault();
    if (!selectedRatingFaculty) {
      toast.error("Please enter a faculty ID.");
      setAverageFacultyRating(0);
      setTotalFacultyFeedbacks(0);
      return;
    }

    try {
      const theoryRes = await fetch(
        `http://localhost:3001/api/faculty/theory-courses/${selectedRatingFaculty}`
      );
      const theoryCourses = await theoryRes.json();

      const theoryWithRatings = await Promise.all(
        theoryCourses.map(async (course) => {
          const res = await fetch(
            `http://localhost:3001/api/faculty/avg-theory-rating/${selectedRatingFaculty}/${course.course_id}`
          );
          const ratingData = await res.json();
          return {
            ...course,
            average_rating: ratingData.average_rating,
            total_feedbacks: ratingData.total_feedbacks,
          };
        })
      );

      const practicalRes = await fetch(
        `http://localhost:3001/api/faculty/practical-courses/${selectedRatingFaculty}`
      );
      const practicalCourses = await practicalRes.json();

      const practicalWithRatings = await Promise.all(
        practicalCourses.map(async (course) => {
          const res = await fetch(
            `http://localhost:3001/api/faculty/avg-practical-rating/${selectedRatingFaculty}/${course.course_id}`
          );
          const ratingData = await res.json();
          return {
            ...course,
            average_rating: ratingData.average_rating,
            total_feedbacks: ratingData.total_feedbacks,
          };
        })
      );

      const all = [...theoryWithRatings, ...practicalWithRatings];

      const validRatings = all
        .map((c) => Number(c.average_rating))
        .filter((r) => !isNaN(r));

      const avg =
        validRatings.length > 0
          ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length
          : null;

      setAverageFacultyRating(avg ? Number(avg.toFixed(2)) : 0);

      const totalFeedback = all.reduce(
        (sum, c) => sum + (c.total_feedbacks || 0),
        0
      );
      setTotalFacultyFeedbacks(totalFeedback);
    } catch (error) {
      toast.error("Error fetching feedback:", error);
    }
  };

  // View course rating
  const handleViewCourseRating = async (e) => {
    e.preventDefault();
    if (!selectedRatingCourse) {
      toast.error("Please enter a course ID.");
      setAverageCourseRating(0);
      setTotalCourseFeedbacks(0);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/courses/${selectedRatingCourse}/rating`);
      const data = await res.json();

      setAverageCourseRating(data.average_rating || 0);
      setTotalCourseFeedbacks(data.total_feedbacks || 0);

      toast.success("Rating fetched!");
    } catch (err) {
      toast.error("Failed to fetch rating.");
      setAverageCourseRating(0);
      setTotalCourseFeedbacks(0);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userRole="admin" />
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Add Faculty */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>
            <form onSubmit={handleAddFaculty} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Department"
                value={facultyDept}
                onChange={(e) => setFacultyDept(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <button type="submit" className="bg-blue-400 text-white p-3 rounded-lg">
                Add Faculty
              </button>
            </form>
          </div>

          {/* Add Course */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Course ID"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Semester"
                value={courseSem}
                onChange={(e) => setCourseSem(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <select
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
              <input
                type="text"
                placeholder="Faculty ID"
                value={courseFacultyId}
                onChange={(e) => setCourseFacultyId(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <button type="submit" className="bg-pink-400 text-white p-3 rounded-lg">
                Add Course
              </button>
            </form>
          </div>

          {/* Change Course Faculty */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Change Faculty of a Course</h2>
            <form onSubmit={handleChangeFaculty} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Course ID"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="New Faculty ID"
                value={newFacultyId}
                onChange={(e) => setNewFacultyId(e.target.value)}
                className="p-3 border rounded-lg"
              />
              <button type="submit" className="bg-green-400 text-white p-3 rounded-lg">
                Change Faculty
              </button>
            </form>
          </div>

          {/* View Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">View Faculty Rating</h2>
              <form onSubmit={handleViewFacultyRating} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter Faculty ID"
                  value={selectedRatingFaculty}
                  onChange={(e) => setSelectedRatingFaculty(e.target.value)}
                  className="p-3 border rounded-lg"
                />
                <button type="submit" className="bg-gray-500 text-white p-3 rounded-lg">
                  View Rating
                </button>
              </form>

              {selectedRatingFaculty && (
                <p className="mt-4 font-bold">
                  Average Rating: {averageFacultyRating || 0} ⭐ <br />
                  Total Feedbacks: {totalFacultyFeedbacks || 0}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">View Course Rating</h2>
              <form onSubmit={handleViewCourseRating} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter Course ID"
                  value={selectedRatingCourse}
                  onChange={(e) => setSelectedRatingCourse(e.target.value)}
                  className="p-3 border rounded-lg"
                />
                <button type="submit" className="bg-gray-500 text-white p-3 rounded-lg">
                  View Rating
                </button>
              </form>

              {selectedRatingCourse && (
                <p className="mt-4 font-bold">
                  Average Rating: {averageCourseRating || 0} ⭐ <br />
                  Total Feedbacks: {totalCourseFeedbacks || 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



