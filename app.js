const BACKEND = "https://slow-flies-float.loca.lt"; // 🔴 backend url

const user = localStorage.getItem("dsr_user");
if (!user) location.href = "login.html";

const chatDiv = document.getElementById("chat");
const input = document.getElementById("msg");

let chats = JSON.parse(localStorage.getItem("dsr_chats") || "[]");
render();

function render() {
  chatDiv.innerHTML = "";
  chats.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = `msg ${c.by}`;
    d.textContent = c.text;

    const a = document.createElement("div");
    a.className = "actions";

    const cpy = document.createElement("span");
    cpy.textContent = "📋";
    cpy.onclick = () => navigator.clipboard.writeText(c.text);

    const del = document.createElement("span");
    del.textContent = "🗑️";
    del.onclick = () => {
      chats.splice(i, 1);
      save();
      render();
    };

    a.append(cpy, del);
    d.appendChild(a);
    chatDiv.appendChild(d);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function save() {
  localStorage.setItem("dsr_chats", JSON.stringify(chats));
}

async function send() {
  const m = input.value.trim();
  if (!m) return;

  chats.push({ by: "user", text: m });
  save(); render();
  input.value = "";

  try {
    const r = await fetch(BACKEND + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: m })
    });
    const d = await r.json();
    chats.push({ by: "ai", text: d.reply });
  } catch {
    chats.push({ by: "ai", text: "Backend not responding" });
  }

  save(); render();
}

function logout() {
  localStorage.clear();
  location.href = "login.html";
}

function startVoice() {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!R) return alert("Voice not supported");
  const r = new R();
  r.onresult = e => input.value = e.results[0][0].transcript;
  r.start();
}
