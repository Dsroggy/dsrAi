const BACKEND = "https://slow-flies-float.loca.lt"; // ✅ NO SPACE

const user = localStorage.getItem("dsr_user");
if (!user) location.href = "login.html";

const chatDiv = document.getElementById("chat");
let chats = JSON.parse(localStorage.getItem("dsr_chats") || "[]");
render();

function render() {
  chatDiv.innerHTML = "";
  chats.forEach((c, i) => {
    chatDiv.innerHTML += `
      <div class="msg ${c.by}">
        ${c.text}
        <div class="actions">
          <span onclick="copy('${c.text}')">📋</span>
          <span onclick="delChat(${i})">🗑️</span>
        </div>
      </div>`;
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function save() {
  localStorage.setItem("dsr_chats", JSON.stringify(chats));
}

function send() {
  const m = document.getElementById("msg").value.trim();
  if (!m) return;

  chats.push({ by: "user", text: m });
  save();
  render();
  document.getElementById("msg").value = "";

  fetch(BACKEND + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: m })
  })
    .then(r => r.json())
    .then(d => {
      chats.push({ by: "ai", text: d.reply });
      save();
      render();
    })
    .catch(() => {
      chats.push({ by: "ai", text: "Backend not responding" });
      save();
      render();
    });
}

function copy(t) {
  navigator.clipboard.writeText(t);
}

function delChat(i) {
  chats.splice(i, 1);
  save();
  render();
}

function logout() {
  localStorage.clear();
  location.href = "login.html";
}

/* 🎤 Voice */
function startVoice() {
  const rec = new (window.SpeechRecognition || webkitSpeechRecognition)();
  rec.lang = "en-IN";
  rec.onresult = e => {
    document.getElementById("msg").value = e.results[0][0].transcript;
  };
  rec.start();
}
