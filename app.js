/**********************
 * CONFIG
 **********************/
const BACKEND = "https://slow-flies-float.loca.lt"; // 🔴 yahin apna URL

/**********************
 * AUTH CHECK
 **********************/
const user = localStorage.getItem("dsr_user");
if (!user) {
  location.href = "login.html";
}

/**********************
 * STATE
 **********************/
const chatDiv = document.getElementById("chat");
const input = document.getElementById("msg");

let chats = [];
try {
  chats = JSON.parse(localStorage.getItem("dsr_chats")) || [];
} catch {
  chats = [];
}

/**********************
 * RENDER
 **********************/
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
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(c.text);
    };

    const delBtn = document.createElement("span");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => {
      chats.splice(i, 1);
      save();
      render();
    };

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

render();

/**********************
 * SEND MESSAGE
 **********************/
async function send() {
  const message = input.value.trim();
  if (!message) return;

  // UI me user message
  chats.push({ by: "user", text: message });
  save();
  render();
  input.value = "";

  console.log("SEND CLICKED");
  console.log("CALLING:", BACKEND + "/chat");

  try {
    const res
