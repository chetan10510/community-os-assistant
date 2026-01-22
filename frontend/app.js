const API = "http://localhost:3001";

// Cache DOM Elements
const chat = document.getElementById("chat");
const input = document.getElementById("message");
const sendBtn = document.getElementById("send");
const welcome = document.getElementById("welcome");
const plusBtn = document.getElementById("plus-btn");
const plusMenu = document.getElementById("plus-menu");
const docPanel = document.getElementById("doc-panel");
const docTitle = document.getElementById("doc-title");
const docContent = document.getElementById("doc-content");
const download = document.getElementById("download");

// UI Interactions
plusBtn.onclick = (e) => {
    e.stopPropagation();
    plusMenu.classList.toggle("hidden");
};

document.onclick = () => plusMenu.classList.add("hidden");

function createDoc(type) {
    input.value = `Create a ${type} document for `;
    input.focus();
}

// Messaging Logic
async function send() {
    const text = input.value.trim();
    if (!text) return;

    // Toggle View
    welcome.classList.add("hidden");
    chat.classList.remove("hidden");

    addMessage(text, "user");
    input.value = "";
    
    // Add Thinking/Typing State
    const botMsgId = "bot-" + Date.now();
    addMessage("Assistant is thinking...", "bot", botMsgId);
    
    try {
        const res = await fetch(`${API}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: text }] })
        });

        const data = await res.json();
        
        // Replace Thinking text with real content
        const botBubble = document.getElementById(botMsgId).querySelector('.bubble');
        botBubble.textContent = data.content || "Done.";

        if (data.toolResult) {
            showDocument(data.toolResult);
        }
    } catch (err) {
        document.getElementById(botMsgId).querySelector('.bubble').textContent = "Connection error. Please try again.";
        document.getElementById('connection-status').textContent = "Offline";
        document.getElementById('connection-status').style.background = "rgba(239, 68, 68, 0.2)";
        document.getElementById('connection-status').style.color = "#ef4444";
    }
}

function addMessage(text, who, id = null) {
    const msg = document.createElement("div");
    msg.className = `msg ${who}`;
    if(id) msg.id = id;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    msg.appendChild(bubble);
    chat.appendChild(msg);
    
    // Auto-scroll to bottom
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
}

async function showDocument(doc) {
    docPanel.classList.remove("hidden");
    const res = await fetch(`${API}/api/documents/active`);
    const data = await res.json();

    if (!data) return;

    docTitle.textContent = data.name;
    docContent.textContent = data.content;
    
    // Proper Download Setup
    download.href = `${API}/${data.filePath}`;
    download.setAttribute("download", data.name);
    download.textContent = `💾 Download ${data.name}`;
}

// Event Listeners
sendBtn.onclick = send;
input.onkeydown = (e) => { if (e.key === "Enter") send(); };