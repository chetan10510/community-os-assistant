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

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, who, isThinking = false) {
  const msg = document.createElement("div");
  msg.className = "msg " + who;

  // Add avatar
  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.innerHTML = who === "user" ? "You" : `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  `;
  
  const bubbleContainer = document.createElement("div");
  bubbleContainer.style.flex = "1";
  bubbleContainer.style.maxWidth = "70%";
  
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  
  if (isThinking) {
    bubble.className += " thinking";
    bubble.innerHTML = "<span></span><span></span><span></span>";
  } else {
    // Parse and format the message content
    bubble.innerHTML = formatMessage(text, who);
  }

  const timestamp = document.createElement("div");
  timestamp.className = "msg-timestamp";
  timestamp.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
    ${getTimestamp()}
  `;

  bubbleContainer.appendChild(bubble);
  bubbleContainer.appendChild(timestamp);
  
  if (who === "user") {
    msg.appendChild(bubbleContainer);
    msg.appendChild(avatar);
  } else {
    msg.appendChild(avatar);
    msg.appendChild(bubbleContainer);
  }
  
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  
  return msg;
}

function formatMessage(text, who) {
  // Check if this is the initial greeting message
  if (text.toLowerCase().includes("hello") && text.includes("assist you")) {
    return `
      <div class="bubble-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <path d="M22 4L12 14.01l-3-3"/>
        </svg>
        <span class="bubble-title">Welcome to Community OS!</span>
      </div>
      <div>${text}</div>
    `;
  }
  
  // Check if this is a capabilities message
  if (text.includes("assist you with") || text.includes("help you")) {
    const lines = text.split('\n').filter(line => line.trim());
    
    let formattedHTML = `
      <div class="bubble-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
        </svg>
        <span class="bubble-title">How I Can Help You</span>
      </div>
    `;
    
    // Introduction paragraph
    const intro = lines[0];
    formattedHTML += `<div style="margin-bottom: 16px;">${intro}</div>`;
    
    // Capabilities list
    formattedHTML += `<ul class="bubble-list">`;
    
    const capabilities = [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>`,
        title: "Word Documents",
        description: "Create Word documents and Excel spreadsheets with provided content"
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
        </svg>`,
        title: "Document Updates",
        description: "Update existing Word documents by appending new content"
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>`,
        title: "Information & Answers",
        description: "Answer general questions and provide information on a wide range of topics"
      }
    ];
    
    capabilities.forEach((cap, index) => {
      formattedHTML += `
        <li class="bubble-list-item" style="animation-delay: ${index * 0.1}s">
          <div class="list-icon">${cap.icon}</div>
          <div class="list-content">
            <div class="list-title">${cap.title}</div>
            <div class="list-description">${cap.description}</div>
          </div>
        </li>
      `;
    });
    
    formattedHTML += `</ul>`;
    
    // Footer
    formattedHTML += `
      <div class="bubble-footer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>If you want to create a document or spreadsheet, I'll guide you through the process step-by-step. How can I assist you today?</span>
      </div>
    `;
    
    return formattedHTML;
  }
  
  // Default formatting for other messages
  return text;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  /* First message → switch layout */
  welcome.classList.add("hidden");
  chat.classList.remove("hidden");

  addMessage(text, "user");
  input.value = "";

  const thinking = addMessage("", "bot", true);

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
    addMessage("⚠️ Server error - please try again", "bot");
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
  download.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
    Download ${data.name}
  `;
}

// Add initial welcome message on page load
window.addEventListener('DOMContentLoaded', () => {
  // Simulate initial bot greeting when chat is shown
  setTimeout(() => {
    if (chat.children.length === 0 && !chat.classList.contains("hidden")) {
      addMessage("Hello! How can I assist you today?", "bot");
      
      setTimeout(() => {
        const helpMessage = `I can assist you with various tasks including creating and managing documents or spreadsheets, answering questions, providing information, and guiding you through workflows. Specifically, I can help you:

- Create Word documents and Excel spreadsheets with provided content.
- Update existing Word documents by appending new content.
- Answer general questions and provide information on a wide range of topics.

If you want to create a document or spreadsheet, I'll guide you through the process step-by-step to ensure all necessary details are provided before creation. How can I assist you today?`;
        
        addMessage(helpMessage, "bot");
      }, 1000);
    }
  }, 500);
});
