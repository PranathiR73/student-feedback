import React, { useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import SummaryCards from "../../components/faculty/SummaryCards";
import CourseFeedbackBars from "../../components/faculty/CourseFeedbackBars";
import FeedbackTrendsChart from "../../components/faculty/FeedbackTrendsChart";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const semesters = Array.from({ length: 8 }, (_, index) => String(index + 1));
const questionTypes = [
  { value: "rating", label: "Rating" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
];

const readJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  throw new Error("Backend did not return JSON. Restart the backend server on port 3001.");
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [selectedSem, setSelectedSem] = useState("1");
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("rating");
  const [customQuestions, setCustomQuestions] = useState([]);

  const storageKey = user?.faculty_id
    ? `faculty_custom_questions_${user.faculty_id}`
    : "faculty_custom_questions";

  useEffect(() => {
    const storedQuestions = localStorage.getItem(storageKey);
    setCustomQuestions(storedQuestions ? JSON.parse(storedQuestions) : []);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(customQuestions));
  }, [customQuestions, storageKey]);

  useEffect(() => {
    if (!user?.faculty_id) return;

    const fetchCoursesWithRatings = async () => {
      setIsLoading(true);

      try {
        const theoryRes = await fetch(
          `http://localhost:3001/api/faculty/theory-courses/${user.faculty_id}`
        );
        const theoryCourses = await readJsonResponse(theoryRes);

        const theoryWithRatings = await Promise.all(
          theoryCourses.map(async (course) => {
            const res = await fetch(
              `http://localhost:3001/api/faculty/avg-theory-rating/${user.faculty_id}/${course.course_id}`
            );
            const ratingData = await readJsonResponse(res);
            return {
              ...course,
              course_type: "theory",
              average_rating: ratingData.average_rating,
              total_feedbacks: ratingData.total_feedbacks,
            };
          })
        );

        const practicalRes = await fetch(
          `http://localhost:3001/api/faculty/practical-courses/${user.faculty_id}`
        );
        const practicalCourses = await readJsonResponse(practicalRes);

        const practicalWithRatings = await Promise.all(
          practicalCourses.map(async (course) => {
            const res = await fetch(
              `http://localhost:3001/api/faculty/avg-practical-rating/${user.faculty_id}/${course.course_id}`
            );
            const ratingData = await readJsonResponse(res);
            return {
              ...course,
              course_type: "practical",
              average_rating: ratingData.average_rating,
              total_feedbacks: ratingData.total_feedbacks,
            };
          })
        );

        setCourseData([...theoryWithRatings, ...practicalWithRatings]);
      } catch (error) {
        toast.error(error.message || "Error fetching dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursesWithRatings();
  }, [user?.faculty_id]);

  const filteredCourseData = useMemo(
    () => courseData.filter((course) => String(course.semester) === selectedSem),
    [courseData, selectedSem]
  );

  const addQuestion = (event) => {
    event.preventDefault();

    const trimmedQuestion = questionText.trim();
    if (!trimmedQuestion) {
      toast.error("Enter a question first");
      return;
    }

    setCustomQuestions((current) => [
      ...current,
      {
        id: Date.now(),
        semester: selectedSem,
        text: trimmedQuestion,
        type: questionType,
      },
    ]);
    setQuestionText("");
    setQuestionType("rating");
    toast.success("Question added");
  };

  const removeQuestion = (questionId) => {
    setCustomQuestions((current) => current.filter((question) => question.id !== questionId));
  };

  const semesterQuestions = customQuestions.filter(
    (question) => String(question.semester) === selectedSem
  );

  const exportReportPdf = () => {
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      toast.error("Please allow popups to export the PDF");
      return;
    }

    const courseRows =
      filteredCourseData.length > 0
        ? filteredCourseData
            .map(
              (course, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHtml(course.course_id)}</td>
                  <td>${escapeHtml(course.course_name)}</td>
                  <td>${escapeHtml(course.course_type)}</td>
                  <td>${escapeHtml(course.average_rating || 0)} / 5</td>
                  <td>${escapeHtml(course.total_feedbacks || 0)}</td>
                </tr>
              `
            )
            .join("")
        : `<tr><td colspan="6">No courses found for this semester.</td></tr>`;

    const questionRows =
      semesterQuestions.length > 0
        ? semesterQuestions
            .map(
              (question, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHtml(question.text)}</td>
                  <td>${escapeHtml(question.type || "rating")}</td>
                </tr>
              `
            )
            .join("")
        : `<tr><td colspan="3">No custom questions added.</td></tr>`;

    reportWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Faculty Semester Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1 { margin: 0 0 8px; font-size: 24px; }
            h2 { margin: 24px 0 8px; font-size: 18px; }
            .meta { color: #4b5563; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f3f4f6; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Faculty Semester Report</h1>
          <div class="meta">
            <div>Faculty: ${escapeHtml(user?.name || "Faculty")}</div>
            <div>Email: ${escapeHtml(user?.email || "Not available")}</div>
            <div>Department: ${escapeHtml(user?.department || "Not available")}</div>
            <div>Semester: ${escapeHtml(selectedSem)}</div>
            <div>Generated: ${escapeHtml(new Date().toLocaleString())}</div>
          </div>

          <h2>Course Feedback</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Course ID</th>
                <th>Course</th>
                <th>Type</th>
                <th>Average Rating</th>
                <th>Total Feedback</th>
              </tr>
            </thead>
            <tbody>${courseRows}</tbody>
          </table>

          <h2>Custom Questions</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Answer Type</th>
              </tr>
            </thead>
            <tbody>${questionRows}</tbody>
          </table>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    reportWindow.document.close();
  };

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <Sidebar />
      <div className="flex-1">
        <Header userRole="faculty" />

        <div className="p-6 bg-yellow-50 min-h-screen">
          <div className="mb-6 flex flex-col gap-3 rounded bg-white p-4 shadow md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Faculty Dashboard</h2>
              <p className="text-sm text-gray-600">Select a semester to view course feedback.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="rounded border px-4 py-2"
                value={selectedSem}
                onChange={(event) => setSelectedSem(event.target.value)}
              >
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={exportReportPdf}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Download PDF
              </button>
            </div>
          </div>

          <SummaryCards courseData={filteredCourseData} isLoading={isLoading} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseFeedbackBars courseData={filteredCourseData} />
            <FeedbackTrendsChart courseData={filteredCourseData} />
          </div>

          <section className="mt-6 rounded bg-white p-4 shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Custom Questions</h3>
              <p className="text-sm text-gray-600">
                Add questions for semester {selectedSem}. They are saved in this browser and included in the PDF report.
              </p>
            </div>

            <form onSubmit={addQuestion} className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
              <input
                type="text"
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="Enter question"
                className="rounded border px-3 py-2"
              />
              <select
                value={questionType}
                onChange={(event) => setQuestionType(event.target.value)}
                className="rounded border px-3 py-2"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              >
                Add Question
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {semesterQuestions.length === 0 ? (
                <div className="text-sm text-gray-600">No questions added for this semester.</div>
              ) : (
                semesterQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-center justify-between gap-3 rounded border bg-gray-50 px-3 py-2"
                  >
                    <div className="text-sm">
                      <span className="font-medium">{index + 1}. </span>
                      {question.text}
                      <span className="ml-2 rounded bg-purple-100 px-2 py-1 text-xs font-medium uppercase text-purple-700">
                        {question.type || "rating"}
                      </span>
                      <div className="mt-2">
                        {(question.type || "rating") === "rating" && (
                          <div className="flex gap-2 text-xs text-gray-600">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <span key={value} className="rounded border bg-white px-2 py-1">
                                {value}
                              </span>
                            ))}
                          </div>
                        )}
                        {question.type === "text" && (
                          <input
                            type="text"
                            disabled
                            placeholder="Text answer"
                            className="w-full max-w-sm rounded border bg-white px-2 py-1 text-xs"
                          />
                        )}
                        {question.type === "number" && (
                          <input
                            type="number"
                            disabled
                            placeholder="Number answer"
                            className="w-40 rounded border bg-white px-2 py-1 text-xs"
                          />
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
