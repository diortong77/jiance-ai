const form = document.getElementById("form");
const resultBox = document.getElementById("result");
const loadingBox = document.getElementById("loading");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderSections(text) {
  const parts = text.split("### ").map(item => item.trim()).filter(Boolean);

  if (parts.length === 0) {
    resultBox.innerHTML = `<div class="result-placeholder">${escapeHtml(text)}</div>`;
    return;
  }

  const html = parts.map(part => {
    const lines = part.split("\n");
    const title = lines[0]?.trim() || "未命名模块";
    const content = lines.slice(1).join("\n").trim();

    return `
      <div class="result-section">
        <h4>${escapeHtml(title)}</h4>
        <div class="content">${escapeHtml(content)}</div>
      </div>
    `;
  }).join("");

  resultBox.innerHTML = html;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const brand = document.getElementById("brand").value.trim();
  const theme = document.getElementById("theme").value.trim();
  const focus = document.getElementById("focus").value.trim();

  if (!brand || !theme || !focus) {
    resultBox.innerHTML = `<div class="result-placeholder">请先填写完整的品牌、主题和重点表达。</div>`;
    statusBox.innerText = "填写不完整";
    return;
  }

  resultBox.innerHTML = "";
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
      resultBox.innerHTML = `<div class="result-placeholder">报错了：${escapeHtml(data.error || "未知错误")}</div>`;
      statusBox.innerText = "生成失败";
      return;
    }

    renderSections(data.result || "没有拿到生成结果");
    statusBox.innerText = "生成完成";
  } catch (error) {
    resultBox.innerHTML = `<div class="result-placeholder">请求失败：${escapeHtml(error.message)}</div>`;
    statusBox.innerText = "请求失败";
  } finally {
    loadingBox.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.innerText = "生成脚本";
  }
});
