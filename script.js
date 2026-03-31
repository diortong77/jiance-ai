const form = document.getElementById("form");
const resultBox = document.getElementById("result");
const loadingBox = document.getElementById("loading");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderResultSections(text) {
  const rawText = String(text || "").trim();

  if (!rawText) {
    resultBox.innerHTML = '<div class="result-placeholder">没有拿到生成结果</div>';
    return;
  }

  const normalized = rawText.replace(/\r\n/g, "\n");
  const sections = normalized
    .split(/###\s+/)
    .map(function (item) {
      return item.trim();
    })
    .filter(function (item) {
      return item;
    });

  if (sections.length === 0) {
    resultBox.innerHTML =
      '<div class="result-placeholder">' + escapeHtml(rawText) + "</div>";
    return;
  }

  let html = "";

  sections.forEach(function (section) {
    const lines = section.split("\n");
    const title = lines[0] ? lines[0].trim() : "未命名模块";
    const content = lines.slice(1).join("\n").trim();

    let sectionClass = "analysis";
    let badgeText = "分析";

    if (title.indexOf("脚本") !== -1) {
      sectionClass = "script";
      badgeText = "脚本";
    }

    const contentHtml = content
      .split("\n")
      .map(function (line) {
        const clean = line.trim();
        if (!clean) return "";
        return '<div class="result-line">' + escapeHtml(clean) + "</div>";
      })
      .join("");

    html +=
      '<section class="result-section ' + sectionClass + '">' +
        '<div class="result-title">' +
          '<span class="result-badge">' + badgeText + "</span>" +
          "<h4>" + escapeHtml(title) + "</h4>" +
        "</div>" +
        '<div class="result-content">' + contentHtml + "</div>" +
      "</section>";
  });

  resultBox.innerHTML = html;
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const brand = document.getElementById("brand").value.trim();
  const theme = document.getElementById("theme").value.trim();
  const focus = document.getElementById("focus").value.trim();

  if (!brand || !theme || !focus) {
    resultBox.innerHTML =
      '<div class="result-placeholder">请先填写完整的品牌、主题和重点表达。</div>';
    statusBox.innerText = "填写不完整";
    return;
  }

  loadingBox.classList.remove("hidden");
  statusBox.innerText = "生成中";
  submitBtn.disabled = true;
  submitBtn.innerText = "生成中...";
  resultBox.innerHTML =
    '<div class="result-placeholder">正在生成，请稍候...</div>';

  try {
    const apiUrl = window.location.origin + "/api/generate";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        brand: brand,
        theme: theme,
        focus: focus
      })
    });

    const data = await res.json();

    if (!res.ok) {
      resultBox.innerHTML =
        '<div class="result-placeholder">报错了：' +
        escapeHtml(data.error || "未知错误") +
        "</div>";
      statusBox.innerText = "生成失败";
      return;
    }

    renderResultSections(data.result || "");
    statusBox.innerText = "生成完成";
  } catch (error) {
    resultBox.innerHTML =
      '<div class="result-placeholder">请求失败：' +
      escapeHtml(error.message || "未知错误") +
      "</div>";
    statusBox.innerText = "请求失败";
  } finally {
    loadingBox.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.innerText = "生成脚本";
  }
});
