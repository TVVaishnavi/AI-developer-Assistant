const io = require("socket.io")(3000)

const allowedKeywords = [
    "html", "css", "javascript", "react", "frontend", "website", "component",
    "ui", "page", "layout", "form", "button", "input", "code", "navbar", "footer",
    "build", "create", "design", "generate"
];
  
function isValidPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    return allowedKeywords.some(keyword => lowerPrompt.includes(keyword));
}

io.on('connection', (socket)=>{
    console.log("A client connected");

    socket.on('checkPrompt',(prompt)=>{
        const isValid = isValidPrompt(prompt);
        socket.emit('promptChecked', {valid: isValid});
    })

    socket.on('disconnect', ()=>{
        console.log("A client disconnected");
    })
})
  
module.exports = { isValidPrompt };
  