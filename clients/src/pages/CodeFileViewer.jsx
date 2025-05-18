import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

function CodeFileViewer({ filename = "index.html", code = "" }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    
      <div
        className="file-header bg-gray-900 text-white border border-white-600"
        onClick={() => setOpen(true)}
        style={{
          
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "fit-content",
          marginBottom: "10px",
          gap: "20px",
        }}
      >
        <span>{filename}</span>
        <button onClick={handleCopy} style={{ cursor: "pointer", background: "transparent", border: "none" }}>
          <FaRegCopy /> {copied ? "Copied" : "Copy"}
        </button>
      </div>

     
      {open && (
        <div
          className="modal-backdrop"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              maxWidth: "80%",
              maxHeight: "80%",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <div style={{ padding: "1rem", overflow: "auto", height: "100%" }}>
              <h2 style={{ marginBottom: "1rem", fontSize: "18px" }}>{filename}</h2>
              <pre
                style={{
                  background: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  overflowX: "auto",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  maxHeight: "60vh",
                }}
              >
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CodeFileViewer;
