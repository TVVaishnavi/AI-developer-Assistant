import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
    const [history, setHistory] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
  
    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:4500/api/ai/history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHistory(response.data.prompts);
        } catch (err) {
          console.error("Failed to fetch chat history", err);
        }
      };
  
      fetchHistory();
    }, []);
  
    return (
      <div className="flex h-screen">
    
        <aside className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Chat History</h2>
          <ul>
            {history.map((item, index) => (
              <li
                key={index}
                className="mb-2 p-2 cursor-pointer hover:bg-gray-700 rounded"
                onClick={() => setSelectedChat(item)}
              >
                {item.prompt.slice(0, 30)}...
              </li>
            ))}
          </ul>
        </aside>
  
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          {selectedChat ? (
            <div>
              <h3 className="text-xl font-bold mb-2">Prompt</h3>
              <p className="bg-gray-100 p-4 rounded mb-4">{selectedChat.prompt}</p>
              <h3 className="text-xl font-bold mb-2">Response</h3>
              <p className="bg-green-100 p-4 rounded">{selectedChat.response}</p>
            </div>
          ) : (
            <p className="text-gray-500">Select a chat from the history to view</p>
          )}
        </main>
      </div>
    );
}

export default History;
