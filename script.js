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

function cleanLine(line) {
  return line
    .replace(/^###\s*/, "")
    .replace(/^\*\s*/, "")
    .replace(/^-+\s*/, "")
    .trim();
}

function formatInline(text) {
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function getSectionMeta(title) {
  const cleanTitle = cleanLine(title);

  if (cleanTitle.includes("脚本1")) {
    return { title: cleanTitle, badge: "脚本", className: "script" };
  }
  if (cleanTitle.includes("脚本2")) {
    return { title: cleanTitle, badge: "脚本", className: "script" };
  }
  if (cleanTitle.includes("脚本3")) {
    return { title: cleanTitle, badge: "脚本", className: "script" };
  }

  return { title: cleanTitle, badge: "分析", className: "analysis" };
}

function renderContent(content) {
  const rawLines = content.split("\n").map(line => line.trim()).filter(Boolean);

  if (rawLines.length === 0) {
    return `<div class="result-paragraph">暂无内容</div>`;
  }

  const html = rawLines.map(line => {
    const cleaned = cleanLine(line);

    if (!cleaned) return "";

    return `<div class="result-line">${formatInline(cleaned)}</div>`;
  }).join("");

  return `<div class="result-content">${html}</div>`;
}

function renderSections(text) {
  const parts = text.split("### ").map(item => item.trim()).filter(Boolean);

  if (parts.length === 0) {
    resultBox.innerHTML = `<div class="result-placeholder">${escapeHtml(text)}</div>`;
    return;
  }

  const html = parts.map(part => {
    const lines = part.split("\n");
    const rawTitle = lines[0] || "未命名模块";
    const content = lines.slice(1).join("\n").trim();
    const meta = getSectionMeta(rawTitle);

    return `
      <section class="result-section ${meta.className}">
        <div class="result-title">
          <span class="result-badge">${meta.badge}</span>
          <h4>${escapeHtml(meta.title)}</h4>
        </div>
        ${renderContent(content)}
      </section>
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
