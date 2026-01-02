const BACKEND = "https://slow-flies-float.loca.lt";

const user = localStorage.getItem("dsr_user");
if (!user) location.href = "login.html";

const chatDiv = document.getElementById("chat");
let chats = JSON.parse(localStorage.getItem("dsr_chats") || "[]");
render();

function render() {
  chatDiv.innerHTML = "";

  chats.forEach((c, i) => {
    const msg = document.createElement("div");
    msg.className = `msg ${c.by}`;
    msg.textContent = c.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const copyBtn = document.createElement("span");
    copyBtn.textContent = "📋";
    copyBtn.onclick = () => copy(i);

    const delBtn = document.createElement("span");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => delChat(i);

    actions.appendChild(copyBtn);
    actions.appendChild(delBtn);

    msg.appendChild(actions);
    chatDiv.appendChild(msg);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function save() {
  localStorage.setItem("dsr_chats", JSON.stringify(chats));
}

function send() {
  const input = document.getElementById("msg");
  const m = input.value.trim();
  if (!m) return;

  chats.push({ by: "user", text: m });
  save();
  render();
  input.value = "";

  fetch(BACKEND + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: m })
  })
    .then(r => r.json())
    .then(d => {
      chats.push({ by: "ai", text: d.reply || "No reply" });
      save();
      render();
    })
    .catch(err => {
      console.error(err);
      chats.push({ by: "ai", text: "Backend not responding" });
      save();
      render();
    });
}

function copy(i) {
  navigator.clipboard.writeText(chats[i].text);
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
    document.getElementById("msg").value =
      e.results[0][0].transcript;
  };
  rec.start();
}
