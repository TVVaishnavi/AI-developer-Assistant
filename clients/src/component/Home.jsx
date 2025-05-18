import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCustom from "../hook/custom";

function Home({ userEmail, setUserEmail }) {
  const [query, setQuery] = useState("");
  const { prompts, userDetail, userLogin } = useCustom();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [showAppTypes, setShowAppTypes] = useState(true);
  const [showColorSchemes, setShowColorSchemes] = useState(false);
  const [showLayouts, setShowLayouts] = useState(false);



  useEffect(() => {
    if (location.state?.email) {
      setUserEmail(location.state.email);
      console.log("User email set from location:", location.state.email);
    }
  }, [location.state, setUserEmail]);

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      try {
        console.log("Searching for:", query);
        const response = await prompts({ prompt: query });
        console.log("Response from API:", response);

        if (response?.output?.trim()) {
          console.log("Valid Response:", response.output);
          setResponseData(response);

          navigate("/result", {
            state: { userprompts: query, assistantResponse: response.output },
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

      <div className="space-x-4 flex items-center">
       
        {!userLogin ? (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gray-900 text-purple-600 px-6 py-2 rounded-full border border-purple-500"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-900 text-purple-600 px-6 py-2 rounded-full border border-purple-500"
            >
              Log In
            </button>
          </>
        ) : (
          <p className="text-lg text-white">
            Hi, <span className="font-semibold text-purple-600">{userDetail?.name}</span>. How can I help you?
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl p-3 bg-gray-900 text-white rounded-lg shadow-md mt-4 mx-auto border border-purple-700 animate-glow">
        💡 The more detailed your prompt is, the better the website you’ll get!
      </div>

      <div className="fixed bottom-0 left-0 w-full px-4 py-3 flex items-center justify-center">

        {!loading && (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your Assistant..."
            className="w-full max-w-2xl px-4 py-2 bg-gray-900 border-2 border-purple-500 rounded-l-full text-white focus:outline-none"
          />
        )}
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
     
      <div className="mt-4 space-y-4 w-full max-w-2xl text-sm text-left">
        <div>
          <button
            onClick={() => setShowAppTypes((prev) => !prev)}
            className="text-purple-400 font-medium w-full flex justify-between items-center"
          >
            🧩 App Type
            <span>{showAppTypes ? "▾" : "▸"}</span>
          </button>
          {showAppTypes && (
            <div className="flex flex-wrap gap-2 mt-2">
              {["Portfolio", "Blog", "AI", "Website"].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery((prev) => prev + " " + item)}
                  className="px-3 py-1 rounded-full bg-purple-800 text-white hover:bg-purple-700"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        
        <div>
          <button
            onClick={() => setShowColorSchemes((prev) => !prev)}
            className="text-purple-400 font-medium w-full flex justify-between items-center"
          >
            🎨 Color Scheme
            <span>{showColorSchemes ? "▾" : "▸"}</span>
          </button>
          {showColorSchemes && (
            <div className="flex flex-wrap gap-2 mt-2">
              {["🌙 Dark Theme", "☀️ Light Theme"].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery((prev) => prev + " " + item)}
                  className="px-3 py-1 rounded-full bg-purple-800 text-white hover:bg-purple-700"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

     
        <div>
          <button
            onClick={() => setShowLayouts((prev) => !prev)}
            className="text-purple-400 font-medium w-full flex justify-between items-center"
          >
            📐 Layout
            <span>{showLayouts ? "▾" : "▸"}</span>
          </button>
          {showLayouts && (
            <div className="flex flex-wrap gap-2 mt-2">
              {["Header + Footer", "Grid Layout", "Cards"].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery((prev) => prev + " " + item)}
                  className="px-3 py-1 rounded-full bg-purple-800 text-white hover:bg-purple-700"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;
