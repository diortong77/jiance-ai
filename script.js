const form = document.getElementById("form");
const resultBox = document.getElementById("result");
const loadingBox = document.getElementById("loading");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const brand = document.getElementById("brand").value.trim();
  const theme = document.getElementById("theme").value.trim();
  const focus = document.getElementById("focus").value.trim();

  if (!brand || !theme || !focus) {
    resultBox.innerHTML = '<div class="result-placeholder">请先填写完整的品牌、主题和重点表达。</div>';
    statusBox.innerText = "填写不完整";
    return;
  }

  loadingBox.classList.remove("hidden");
  statusBox.innerText = "生成中";
  submitBtn.disabled = true;
  submitBtn.innerText = "生成中...";
  resultBox.innerHTML = '<div class="result-placeholder">正在生成，请稍候...</div>';

  try {
    const res = await fetch("/api/generate", {
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
      resultBox.innerHTML = '<div class="result-placeholder">报错了：' + (data.error || "未知错误") + '</div>';
      statusBox.innerText = "生成失败";
      return;
    }

    resultBox.innerHTML = '<div class="result-placeholder">' + (data.result || "没有拿到生成结果") + '</div>';
    statusBox.innerText = "生成完成";
  } catch (error) {
    resultBox.innerHTML = '<div class="result-placeholder">请求失败：' + error.message + '</div>';
    statusBox.innerText = "请求失败";
  } finally {
    loadingBox.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.innerText = "生成脚本";
  }
});
