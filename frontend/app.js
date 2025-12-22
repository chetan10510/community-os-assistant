const API = "http://localhost:3001";

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const sendBtn = document.getElementById("send");
const welcome = document.getElementById("welcome");

const docPanel = document.getElementById("doc-panel");
const docTitle = document.getElementById("doc-title");
const docContent = document.getElementById("doc-content");
const download = document.getElementById("download");

/* Enable typing always */
input.disabled = false;
input.focus();

/* Send handlers */
sendBtn.onclick = send;
input.onkeydown = e => { if (e.key === "Enter") send(); };

function addMessage(text, who) {
  const msg = document.createElement("div");
  msg.className = "msg " + who;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  msg.appendChild(bubble);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  /* First message → switch layout */
  welcome.classList.add("hidden");
  chat.classList.remove("hidden");

  addMessage(text, "user");
  input.value = "";

  addMessage("Thinking…", "bot");
  const bots = chat.querySelectorAll(".msg.bot");
  const thinking = bots[bots.length - 1];

  try {
    const res = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await res.json();
    thinking.remove();

    addMessage(data.content || "Done.", "bot");

    /* If document returned */
    if (data.toolResult) {
      showDocument(data.toolResult);
    }

  } catch (err) {
    thinking.remove();
    addMessage("Server error", "bot");
  }
}

async function showDocument(doc) {
  docPanel.classList.remove("hidden");

  /* Fetch active doc */
  const res = await fetch(`${API}/api/documents/active`);
  const data = await res.json();

  if (!data) return;

  docTitle.textContent = data.name;
  docContent.textContent = data.content;
  download.href = `${API}/${data.filePath}`;
  download.textContent = "Download document";
}
