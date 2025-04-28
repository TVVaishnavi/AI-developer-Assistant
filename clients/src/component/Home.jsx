import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCustom from "../hook/custom";

function Home({ userEmail, setUserEmail }) { 
  const [query, setQuery] = useState("");
  const { prompt } = useCustom();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    if (location.state?.email) {
      setUserEmail(location.state.email); 
    }
  }, [location.state, setUserEmail]);

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      try {
        console.log("Searching for:", query);
        const response = await prompt({ prompt: query });
        console.log("Response from API:", response);

        if (response?.output && response.output.trim() !== "") {
          console.log("Response received:", response.output);
          setResponseData(response);

          navigate("/result", {
            state: { userPrompt: query, assistantResponse: response.output },
          });

          setQuery("");
        } else {
          alert("No result found");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="text-center pt-10 space-y-6 flex flex-col items-center justify-center" style={{ height: "90vh" }}>
      <h1 className="text-purple-400 text-3xl font-bold">AI Developer Assistant</h1>
      <p className="text-gray-300 text-lg">Your personalized assistant to build, debug, and ship code faster.</p>

      <div className="space-x-4">
        {userEmail ? (
          <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-500 text-white rounded-full text-xl">
            {userEmail.charAt(0).toUpperCase()}
          </div>
        ) : (
          <>
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-purple-600 px-6 py-2 rounded-full border border-purple-500">
              Sign Up
            </button>
            <button onClick={() => navigate("/login")} className="bg-gray-900 text-purple-600 px-6 py-2 rounded-full border border-purple-500">
              Log In
            </button>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full px-4 py-3 flex items-center justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask your Assistant..."
          className="w-full max-w-2xl px-4 py-2 bg-gray-900 border-2 border-purple-500 rounded-l-full text-white focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-r-full transition duration-300 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}

export default Home;