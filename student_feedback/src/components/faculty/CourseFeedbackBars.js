import React from "react";

const getColor = (rating) => {
  if (rating >= 90) return "bg-orange-400";
  if (rating >= 75) return "bg-purple-400";
  if (rating >= 50) return "bg-green-400";
  return "bg-blue-400";
};

const CourseFeedbackBars = ({ courseData = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h3 className="font-semibold mb-2">Courses Feedback</h3>

      {courseData.length === 0 ? (
        <div className="text-sm text-gray-600">No courses found for this semester.</div>
      ) : (
        courseData.map((course) => {
          const percentage =
            course.average_rating != null
              ? Math.round((Number(course.average_rating) / 5) * 100)
              : 0;

          return (
            <div key={`${course.course_type}-${course.course_id}`} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>
                  {course.course_id} {course.course_name}
                </span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`${getColor(percentage)} h-2 rounded`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CourseFeedbackBars;
