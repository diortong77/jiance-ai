document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const brand = document.getElementById("brand").value;
  const theme = document.getElementById("theme").value;
  const focus = document.getElementById("focus").value;

  const res = await fetch("/api/generate", {
    method: "POST",
    body: JSON.stringify({ brand, theme, focus }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();

  document.getElementById("result").innerText = data.result;
});