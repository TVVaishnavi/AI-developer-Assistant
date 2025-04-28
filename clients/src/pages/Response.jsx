import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import SearchBar from '../component/SearchBar'; 

function Result() {
  const { state } = useLocation();
  const userPrompt = state?.userPrompt || "No prompt data available";
  const assistantResponse = state?.assistantResponse || "No response available";

  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
    
  };

  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userPrompt, assistantResponse]);

  return (
    <div className=" flex max-w-screen overflow-hidden pt-2 bg-transparent" style={{ height: "90vh" }}>

      {/* Left Side */}
      <div className="w-1/2 bg-gray-900 text-white p-2 flex flex-col justify-between">
        
        {/* Chat Content */}
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-auto space-y-4 flex flex-col p-2 mt-4  [&::-webkit-scrollbar]:w-1  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {/* User Prompt */}
          <div className="flex justify-end">
            <div className="bg-gray-800 p-3 rounded-md max-w-xs">
              <p className="text-sm text-purple-300 font-semibold mb-1 text-right">User:</p>
              <p className="text-sm break-words text-right">{userPrompt}</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-purple-700 p-3 rounded-md max-w-xs">
              <p className="text-sm text-white font-semibold mb-1">AI:</p>
              <p className="text-sm break-words">{assistantResponse}</p>
            </div>
          </div>
        </div>

        {/* Search Bar at the bottom */}
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
        />
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-purple-600">Live Preview</h2>
        <div className="flex-1 overflow-auto ">
          <iframe
            title="Live Output"
            srcDoc={assistantResponse}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-2 border-purple-300 rounded-lg "
          />
        </div>
      </div>

    </div>
  );
}

export default Result;
