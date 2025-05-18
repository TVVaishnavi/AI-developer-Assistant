
import React from 'react';

function SearchBar({ searchQuery, setSearchQuery, handleSearch, loading }) {
  return (
    <div className="fixed bottom-0 left-0 w-full px-4 py-3 flex items-center justify-center">
      <input
        type="text"
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Ask your Assistant..."
        className="w-full max-w-2xl px-4 py-2 bg-gray-900 border-2 border-purple-500 rounded-l-full text-white focus:outline-none"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-r-full transition duration-300 flex items-center justify-center"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
}

export default SearchBar;
