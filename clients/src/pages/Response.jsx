import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import CodeFileViewer from "./CodeFileViewer.jsx";
import custom from "../hook/custom";
import { FaRegCopy } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { SocketContext } from "../context/Socket.jsx"

function buildHtmlDocument(html, css, js) {
  const baseCss = `
    body {
      margin: 0;
      padding: 2rem;
      background: #f3f4f6;
      color: #111827;
      font-family: 'Inter', sans-serif;
    }
    .ai-output-container {
      max-width: 800px;
      margin: auto;
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    h1, h2, h3 { color: #4f46e5; }
    a { color: #2563eb; text-decoration: none; }
    button {
      background: #4f46e5;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.6;
    }
    button:hover { background: #3730a3; }
    ${css}
  `;

  const safeHtml = html.includes('<html') ? html : `<div class="ai-output-container">${html}</div>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; }
    html, body {
      height: 100%;
      margin: 0;
      padding: 20px;
      font-family: 'Inter', sans-serif;
      background-color: #fff;
    }
    img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
    ${baseCss}
  </style>
</head>
<body>
  ${safeHtml}
  <script>
    window.onerror = function(message, source, lineno, colno, error) {
      const existing = document.getElementById('error-box');
      if (existing) existing.remove();
      const box = document.createElement('div');
      box.id = 'error-box';
      box.style = \`
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ffe0e0;
        color: #b30000;
        border: 1px solid #ff0000;
        padding: 12px 16px;
        z-index: 9999;
        font-family: monospace;
        font-size: 13px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border-radius: 6px;
        max-width: 90%;
        word-wrap: break-word;
      \`;
      box.innerHTML = \`<strong>⚠️ JS Error:</strong><br>\${message} at \${source}:\${lineno}:\${colno}\`;
      document.body.appendChild(box);
    };

    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
      });
    });

    try {
      ${js}
    } catch (err) {
      console.error("Script error:", err);
    }
  </script>
</body>
</html>
  `;
}

function Result() {
  const { state } = useLocation();
  const [prompt, setPrompt] = useState("No Prompt data available");
  const [response, setResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const { editPrompt, prompts } = custom();
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [outputHtml, setOutputHtml] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isEditingIndex, setIsEditingIndex] = useState(null);
  const [cleanedMessage, setCleanedMessage] = useState('');

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages])
  useEffect(() => {
    const storedPrompt = localStorage.getItem("prompt");
    const storedResponse = localStorage.getItem("response");

    if (state?.prompt && state?.response) {
      setPrompt(state.prompt);
      setResponse(state.response);
      setMessages([{ sender: 'user', text: state.prompt }, { sender: 'ai', text: state.response }])
      localStorage.setItem("prompt", state.prompt);
      localStorage.setItem("response", state.response);
    } else if (storedPrompt && storedResponse) {
      setPrompt(storedPrompt);
      setResponse(storedResponse);
      setMessages([{ sender: 'user', text: storedPrompt }, { sender: 'ai', text: storedResponse }])
    }
  }, [state])



  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      const userMessage = { sender: 'user', text: searchQuery };
      const chatId = localStorage.getItem("chatId") || `chat-${Date.now()}`;

      try {
        
        setMessages(prev => [...prev, userMessage]);

        const response = await prompts({ prompt: searchQuery, chatId: chatId });

        if (response?.output?.trim()) {
          const aiMessage = { sender: 'ai', text: response.output };

          setMessages(prev => [...prev, aiMessage]);
          setResponse(response.output);
          localStorage.setItem("prompt", searchQuery);
          localStorage.setItem("response", response.output);
          localStorage.setItem("chatId", chatId);
          setSearchQuery('');
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

  useEffect(() => {
    const htmlMatch =
      response.match(/```html\s*([\s\S]*?)```/) ||
      response.match(/<html[\s\S]*<\/html>/i) ||
      response.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    const cssMatch = response.match(/```css\s*([\s\S]*?)```/i);
    const jsMatch = response.match(/```js\s*([\s\S]*?)```/);

    const html = htmlMatch ? htmlMatch[1].trim() : '';
    let css = cssMatch ? cssMatch[1].trim() : '';
    const js = jsMatch ? jsMatch[1].trim() : '';

    const themeKeywords = ['dark', 'modern', 'retro', 'minimal', 'neon', 'glass', 'gradient'];
    const themeMentioned = themeKeywords.some(keyword => response.toLowerCase().includes(keyword));

    if (!themeMentioned) {
      css += `
      body {
        background-color: #f9f9f9;
        color: #1e1e1e;
        font-family: 'Inter', sans-serif;
      }
      button, input, select, textarea {
        border-radius: 6px;
        border: 1px solid #ccc;
        padding: 0.6rem;
        font-size: 1rem;
      }
      header, nav {
        background-color: #ffffff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        padding: 1rem;
      }
    `;
    }



    setHtmlCode(html);
    setCssCode(css);
    setJsCode(js);
    setOutputHtml(buildHtmlDocument(html, css, js));
  }, [messages]);


  const handleNewMessage = (text, sender = 'ai') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  return (
    <div className="flex max-w-screen overflow-hidden pt-2 bg-transparent" style={{ height: "90vh" }}>
      {/* Left Side */}
      <div className="w-1/2 bg-gray-900 text-white p-2 flex flex-col justify-between">
        {/* Chat Content */}
        <div
          ref={chatRef}
          className="flex-1 overflow-auto space-y-4 flex flex-col p-2 mt-4
             [&::-webkit-scrollbar]:w-1
             [&::-webkit-scrollbar-track]:bg-gray-100
             dark:[&::-webkit-scrollbar-track]:bg-neutral-700
             dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
             [&::-webkit-scrollbar-thumb]:rounded-full"
        >

          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isAi = msg.sender === 'ai';
            const isEditingThis = isEditingIndex === index;

            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`p-3 rounded-md max-w-xs ${isUser ? 'bg-gray-800' : 'bg-purple-700'}`}>
                  {isAi && (
                    <p className="text-sm break-words whitespace-pre-wrap">
                      {msg.text.replace(/```(?:html|css|js)?\s*[\s\S]*?```/gi, '').trim()}
                    </p>
                  )}

                  {isUser && (
                    <p className={`text-sm break-words whitespace-pre-wrap text-right`}>
                      {msg.text}
                    </p>
                  )}


                  {isAi && (htmlCode || cssCode || jsCode) && (
                    <div className="mt-2 text-black space-x-3">
                      {htmlCode && <CodeFileViewer filename="index.html" code={htmlCode} />}
                      {cssCode && <CodeFileViewer filename="styles.css" code={cssCode} />}
                      {jsCode && <CodeFileViewer filename="script.js" code={jsCode} />}
                    </div>

                  )}

                  {isUser && isEditingThis ? (
                    <>
                      <textarea
                        className="w-full h-32 text-white p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        placeholder="Edit your prompt..."
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md"
                          onClick={async () => {
                            const updated = editedPrompt.trim();
                            if (!updated) return alert("Prompt can't be empty.");
                            const promptId = msg.id || localStorage.getItem("promptId");
                            if (!promptId) return alert("Prompt ID not found.");
                            const editRes = await editPrompt(promptId, updated);
                            if (editRes.success) {
                              const newMessages = [...messages];
                              newMessages[index].text = updated;
                              setMessages(newMessages);
                              setResponse(editRes.output || "No response data available");
                              localStorage.setItem("prompt", updated);
                              localStorage.setItem("response", editRes.output || "");
                              setIsEditingIndex(null);
                            } else {
                              alert("Failed to update prompt: " + editRes.error);
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded-md"
                          onClick={() => setIsEditingIndex(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={`text-sm break-words whitespace-pre-wrap ${isUser ? 'text-right' : ''}`}>
                        {msg.text}
                      </p>
                      {isUser && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            className="bg-purple-500 text-white px-3 py-1 rounded-md"
                            onClick={() => {
                              setEditedPrompt(msg.text);
                              setIsEditingIndex(index);
                            }}
                          >
                            <CiEdit />
                          </button>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-md"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(msg.text);
                                alert("Prompt copied to clipboard!");
                              } catch (error) {
                                alert("Failed to copy prompt: " + error.message);
                              }
                            }}
                          >
                            <FaRegCopy />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>


        <form onSubmit={(e) => { e.preventDefault(); handleSearch(e); }} className='flex items-center p-2 bg-gray-800 border border-purple-500'>
          <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='What can i do for you?' className='flex-1 p-2 rounded-1-md bg-gray-800 text-white border border-purple-500' />
          <button type='submit' className='bg-purple-600 text-white px-4 py-2 rounded-r-md'>
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </form>


      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col bg-white p-1 m-0" style={{ height: '100%' }}>
        <h2 className="text-2xl font-bold mb-4 text-purple-600">Live Preview</h2>
        <div className="flex-1 overflow-hidden rounded-lg shadow-lg border-2 border-gray-300">
          <iframe
            title="Live Output"
            srcDoc={outputHtml}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full"
            style={{
              border: 'none',
              borderRadius: '8px',
              minHeight: '100%',
            }}
          />
        </div>

      </div>
    </div>
  );
}

export default Result; 
