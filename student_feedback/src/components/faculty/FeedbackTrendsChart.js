import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import toast from "react-hot-toast";

const exportToCSV = (data, filename) => {
  if (data.length === 0) {
    toast.error("No feedback data to export");
    return;
  }

  const headers = ["course_id", "course_name", "course_type", "semester", "average_rating", "total_feedbacks"];
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((header) => JSON.stringify(row[header] ?? ""));
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const FeedbackTrendsChart = ({ courseData = [] }) => {
  const handleExport = () => {
    exportToCSV(courseData, "faculty_feedback_trends.csv");
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">Trends</h3>
        <button className="border px-2 py-1 rounded text-sm" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      {courseData.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center text-sm text-gray-600">
          No trend data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={courseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="course_id" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="average_rating" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FeedbackTrendsChart;
