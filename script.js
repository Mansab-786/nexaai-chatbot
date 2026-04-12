async function sendMessage() {
  let input = document.getElementById("input").value;
  let messages = document.getElementById("messages");

  messages.innerHTML += "<div><b>You:</b> " + input + "</div>";

  let res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  let data = await res.json();

  messages.innerHTML += "<div><b>AI:</b> " + data.reply + "</div>";
}
