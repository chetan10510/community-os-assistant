// REPLACE with your actual Render URL after deploying the backend
const API = "https://community-os-api.onrender.com"; 

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

plusBtn.onclick = (e) => { e.stopPropagation(); plusMenu.classList.toggle("hidden"); };
document.onclick = () => plusMenu.classList.add("hidden");

function createDoc(type) {
    input.value = `Create a ${type} document for `;
    input.focus();
}

async function send() {
    const text = input.value.trim();
    if (!text) return;

    welcome.classList.add("hidden");
    chat.classList.remove("hidden");
    addMessage(text, "user");
    input.value = "";
    
    const botMsgId = "bot-" + Date.now();
    addMessage("Thinking...", "bot", botMsgId);
    
    try {
        const res = await fetch(`${API}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: text }] })
        });
        const data = await res.json();
        const botBubble = document.getElementById(botMsgId).querySelector('.bubble');
        botBubble.textContent = data.content || "Done.";
        if (data.toolResult) showDocument(data.toolResult);
    } catch (err) {
        document.getElementById(botMsgId).querySelector('.bubble').textContent = "Connection error. Please try again.";
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
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
}

async function showDocument(doc) {
    docPanel.classList.remove("hidden");
    const res = await fetch(`${API}/api/documents/active`);
    const data = await res.json();
    if (!data) return;
    docTitle.textContent = data.name;
    docContent.textContent = data.content;
    
    // FIX: Set href and download attribute for correct file format
    download.href = `${API}/${data.filePath}`;
    download.setAttribute("download", data.name);
}

sendBtn.onclick = send;
input.onkeydown = (e) => { if (e.key === "Enter") send(); };