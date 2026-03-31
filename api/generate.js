export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  try {
    const { brand, theme, focus } = req.body;

    if (!brand || !theme || !focus) {
      return res.status(400).json({ error: "缺少参数" });
    }

    const prompt = `
你是一个短视频营销专家。

品牌：${brand}
主题：${theme}
重点：${focus}

请输出：

【品牌分析】
【用户需求理解】
【3条短视频脚本】

每条脚本包含：
- 标题
- 开头
- 内容
- 结尾
`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.DEEPSEEK_API_KEY
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
