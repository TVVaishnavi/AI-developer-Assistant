const allowedKeywords = [
    "html", "css", "javascript", "react", "frontend", "website", "component",
    "ui", "page", "layout", "form", "button", "input", "code", "navbar", "footer",
    "build", "create", "design", "generate"
];
  
function isValidPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    return allowedKeywords.some(keyword => lowerPrompt.includes(keyword));
}
  
module.exports = { isValidPrompt };
  