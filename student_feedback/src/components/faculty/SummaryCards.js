import React from "react";

const SummaryCards = ({ courseData = [], isLoading = false }) => {
  const validRatings = courseData
    .map((course) => Number(course.average_rating))
    .filter((rating) => !Number.isNaN(rating) && rating > 0);

  const averageRating =
    validRatings.length > 0
      ? Number((validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(2))
      : 0;

  const totalFeedbacks = courseData.reduce(
    (sum, course) => sum + Number(course.total_feedbacks || 0),
    0
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="bg-red-100 p-4 rounded shadow flex-1">
        <p className="text-sm">Avg. Rating</p>
        <h2 className="text-2xl font-bold">{isLoading ? "..." : `${averageRating} / 5`}</h2>
      </div>
      <div className="bg-yellow-100 p-4 rounded shadow flex-1">
        <p className="text-sm">Total Feedback</p>
        <h2 className="text-2xl font-bold">{isLoading ? "..." : totalFeedbacks}</h2>
      </div>
      <div className="bg-green-100 p-4 rounded shadow flex-1">
        <p className="text-sm">Courses Taught</p>
        <h2 className="text-2xl font-bold">{isLoading ? "..." : courseData.length}</h2>
      </div>
    </div>
  );
};

export default SummaryCards;
