const form = document.getElementById("form");
const resultBox = document.getElementById("result");
const loadingBox = document.getElementById("loading");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const brand = document.getElementById("brand").value.trim();
  const theme = document.getElementById("theme").value.trim();
  const focus = document.getElementById("focus").value.trim();

  if (!brand || !theme || !focus) {
    resultBox.innerText = "请先填写完整的品牌、主题和重点表达。";
    statusBox.innerText = "填写不完整";
    return;
  }

  resultBox.innerText = "";
  loadingBox.classList.remove("hidden");
  statusBox.innerText = "生成中";
  submitBtn.disabled = true;
  submitBtn.innerText = "生成中...";

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
      statusBox.innerText = "生成失败";
      return;
    }

    resultBox.innerText = data.result || "没有拿到生成结果";
    statusBox.innerText = "生成完成";
  } catch (error) {
    resultBox.innerText = "请求失败：" + error.message;
    statusBox.innerText = "请求失败";
  } finally {
    loadingBox.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.innerText = "生成脚本";
  }
});
