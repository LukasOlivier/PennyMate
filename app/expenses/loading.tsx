import React from "react";

const Loading = () => (
  <div className="flex justify-center items-center h-40">
    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
    <span className="text-lg">Loading expenses...</span>
  </div>
);

export default Loading;
