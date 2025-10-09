import React from 'react'

const RightSideTrendingTopices = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold text-gray-800 mb-4">Trending at BGIFT</h2>
        <div className="space-y-3">
          <div className="hover:bg-gray-50 p-2 rounded cursor-pointer">
            <p className="text-sm font-medium text-gray-800">#ExamWeek</p>
            <p className="text-xs text-gray-600">125 posts</p>
          </div>
          <div className="hover:bg-gray-50 p-2 rounded cursor-pointer">
            <p className="text-sm font-medium text-gray-800">#CampusLife</p>
            <p className="text-xs text-gray-600">89 posts</p>
          </div>
          <div className="hover:bg-gray-50 p-2 rounded cursor-pointer">
            <p className="text-sm font-medium text-gray-800">#BGIFTEvents</p>
            <p className="text-xs text-gray-600">67 posts</p>
          </div>
        </div>
      </div>
  )
}

export default RightSideTrendingTopices