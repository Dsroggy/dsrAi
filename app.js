const BACKEND = " https://vast-weeks-shop.loca.lt";
const user = localStorage.getItem("dsr_user");

// agar login nahi hai → login page
if (!user) {
  window.location.replace("login.html");
}

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");

function add(text, cls) {
  const d = document.createElement("div");
  d.className = "msg " + cls;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

async function loadHistory() {
  try {
    const r = await fetch(`${BACKEND}/history/${user}`);
    const h = await r.json();
    h.forEach(x => {
      add("You: " + x.user, "user");
      add("AI: " + x.ai, "ai");
    });
  } catch {
    add("AI: Backend connection failed", "ai");
  }
}
loadHistory();

async function send() {
  const text = msg.value.trim();
  if (!text) return;

  add("You: " + text, "user");
  msg.value = "";

  try {
    const r = await fetch(`${BACKEND}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, message: text })
    });

    const d = await r.json();
    add("AI: " + d.reply, "ai");
  } catch {
    add("AI: Backend not responding", "ai");
  }
}

function logout() {
  localStorage.removeItem("dsr_user");
  window.location.replace("login.html");
}
