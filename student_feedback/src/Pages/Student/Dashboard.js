import React, { useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import SubjectTable from "../../components/student/SubjectTable";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const emptySemesterData = { theory: [], practical: [] };

const readJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  const preview = text.replace(/\s+/g, " ").slice(0, 80);
  throw new Error(
    `Expected JSON from backend but received HTML/text. Check that the backend is running on port 3001. Response: ${preview}`
  );
};

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [selectedSem, setSelectedSem] = useState("1");
  const [semesterData, setSemesterData] = useState(emptySemesterData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setErrorMessage("");

    fetch(`https://student-feedback-production-60e2.up.railway.app/api/student/semester/${selectedSem}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await readJsonResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "Unable to fetch semester data");
        }

        setSemesterData({
          theory: Array.isArray(data.theory) ? data.theory : [],
          practical: Array.isArray(data.practical) ? data.practical : [],
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;

        setSemesterData(emptySemesterData);
        setErrorMessage(err.message);
        toast.error(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedSem]);

  useEffect(() => {
    if (!user?.student_id) return;

    const controller = new AbortController();
    setHistoryLoading(true);
    setHistoryError("");

    fetch(`https://student-feedback-production-60e2.up.railway.app/api/student/feedback-history/${user.student_id}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await readJsonResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "Unable to fetch feedback history");
        }

        setFeedbackHistory(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;

        setFeedbackHistory([]);
        setHistoryError(err.message);
        toast.error(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setHistoryLoading(false);
        }
      });

    return () => controller.abort();
  }, [user?.student_id]);

  const filteredSemesterData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return semesterData;

    const matches = (subject) =>
      [subject.course_id, subject.course_name, subject.faculty_name, subject.course_type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    return {
      theory: semesterData.theory.filter(matches),
      practical: semesterData.practical.filter(matches),
    };
  }, [searchQuery, semesterData]);

  const totalSubjects = semesterData.theory.length + semesterData.practical.length;
  const totalFilteredSubjects =
    filteredSemesterData.theory.length + filteredSemesterData.practical.length;

  const changeSemester = (direction) => {
    setSelectedSem((current) => {
      const nextSemester = Number(current) + direction;
      return String(Math.min(8, Math.max(1, nextSemester)));
    });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";
    return new Date(dateValue).toLocaleString();
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const exportHistoryAsPdf = () => {
    if (feedbackHistory.length === 0) {
      toast.error("No feedback history to export");
      return;
    }

    const rows = feedbackHistory
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.form_type)}</td>
            <td>${escapeHtml(item.course_id)}</td>
            <td>${escapeHtml(item.course_name)}</td>
            <td>${escapeHtml(item.faculty_name || "Course only")}</td>
            <td>${escapeHtml(item.semester)}</td>
            <td>${escapeHtml(item.average_rating)}</td>
            <td>${escapeHtml(item.comments || "")}</td>
            <td>${escapeHtml(formatDate(item.submitted_at))}</td>
          </tr>
        `
      )
      .join("");

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      toast.error("Please allow popups to export the PDF");
      return;
    }

    reportWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Student Feedback History</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1 { margin: 0 0 6px; font-size: 24px; }
            .meta { margin-bottom: 20px; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f3f4f6; }
            @media print { button { display: none; } body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Student Feedback History</h1>
          <div class="meta">
            <div>Name: ${escapeHtml(user?.name || "Student")}</div>
            <div>Email: ${escapeHtml(user?.email || "Not available")}</div>
            <div>Department: ${escapeHtml(user?.department || "Not available")}</div>
            <div>Generated: ${escapeHtml(new Date().toLocaleString())}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Course ID</th>
                <th>Course</th>
                <th>Faculty</th>
                <th>Semester</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
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
    <div className="flex min-h-screen bg-blue-200">
      <Sidebar />
      <div className="flex-1">
        <Header
          userRole="student"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search course or faculty..."
        />

        <div className="p-6">
          <div className="flex flex-col gap-3 my-4 md:flex-row md:items-center md:justify-between">
            <select
              className="border px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white shadow"
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={selectedSem === "1"}
                onClick={() => changeSemester(-1)}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={selectedSem === "8"}
                onClick={() => changeSemester(1)}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white p-4 rounded shadow text-gray-700">
              Loading semester {selectedSem} subjects...
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="bg-red-100 border border-red-300 p-4 rounded text-red-700">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && totalSubjects === 0 && (
            <div className="bg-white p-4 rounded shadow text-gray-700">
              No subjects found for semester {selectedSem}. Add courses from the admin dashboard
              for this semester.
            </div>
          )}

          {!isLoading && !errorMessage && totalSubjects > 0 && totalFilteredSubjects === 0 && (
            <div className="bg-white p-4 rounded shadow text-gray-700">
              No subjects match "{searchQuery}".
            </div>
          )}

          {!isLoading && !errorMessage && totalFilteredSubjects > 0 && (
            <div className="space-y-6">
              <SubjectTable title="Theory Subjects" subjects={filteredSemesterData.theory} />
              <SubjectTable title="Practical Subjects" subjects={filteredSemesterData.practical} />
            </div>
          )}

          <section className="mt-8 bg-white rounded shadow">
            <div className="flex flex-col gap-3 border-b px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Feedback History</h2>
                <p className="text-sm text-gray-600">
                  Submitted feedback from theory, practical, and course forms.
                </p>
              </div>

              <button
                type="button"
                onClick={exportHistoryAsPdf}
                disabled={feedbackHistory.length === 0}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Export PDF
              </button>
            </div>

            {historyLoading && (
              <div className="p-4 text-gray-700">Loading feedback history...</div>
            )}

            {!historyLoading && historyError && (
              <div className="m-4 rounded border border-red-300 bg-red-100 p-4 text-red-700">
                {historyError}
              </div>
            )}

            {!historyLoading && !historyError && feedbackHistory.length === 0 && (
              <div className="p-4 text-gray-700">
                No feedback submitted yet. Submitted feedback will appear here.
              </div>
            )}

            {!historyLoading && !historyError && feedbackHistory.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Faculty</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Comments</th>
                      <th className="p-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackHistory.map((item) => (
                      <tr key={`${item.form_type}-${item.feedback_id}`} className="border-t">
                        <td className="p-3 capitalize">{item.form_type}</td>
                        <td className="p-3">
                          <div className="font-medium">{item.course_name}</div>
                          <div className="text-xs text-gray-500">{item.course_id}</div>
                        </td>
                        <td className="p-3">{item.faculty_name || "Course only"}</td>
                        <td className="p-3">{item.semester}</td>
                        <td className="p-3">{item.average_rating}/5</td>
                        <td className="p-3">{item.comments || "-"}</td>
                        <td className="p-3">{formatDate(item.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
