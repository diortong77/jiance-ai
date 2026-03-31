document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const brand = document.getElementById("brand").value;
  const theme = document.getElementById("theme").value;
  const focus = document.getElementById("focus").value;

  const resultBox = document.getElementById("result");
  resultBox.innerText = "生成中，请稍候...";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ brand, theme, focus }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (!res.ok) {
      resultBox.innerText = "报错了：" + (data.error || "未知错误");
      return;
    }

    resultBox.innerText = data.result || "没有拿到生成结果";
  } catch (error) {
    resultBox.innerText = "请求失败：" + error.message;
  }
});
