function askAI() {
  const question = document.getElementById("aiQuestion").value;

  fetch("http://localhost:5000/ask-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("aiResponse").innerText = data.answer;
  })
  .catch(error => {
    console.error("Error:", error);
  });
}
