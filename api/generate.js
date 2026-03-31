export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  try {
    const { brand, theme, focus } = req.body;

    if (!brand || !theme || !focus) {
      return res.status(400).json({ error: "缺少参数" });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: "没有检测到 DEEPSEEK_API_KEY" });
    }

    const prompt = `
你是一个短视频营销专家。

品牌：${brand}
主题：${theme}
重点：${focus}

请严格按照下面格式输出，不要改标题名字：

### 品牌分析
输出这个品牌适合的短视频内容调性、表达风格和推荐方向。

### 用户需求理解
总结这次视频最应该突出的核心信息、传播目标和建议表达方式。

### 脚本1：情绪共鸣型
包含：
- 标题
- 开头3秒钩子
- 镜头设计
- 台词文案
- 结尾引导

### 脚本2：产品卖点型
包含：
- 标题
- 开头3秒钩子
- 镜头设计
- 台词文案
- 结尾引导

### 脚本3：剧情反转型
包含：
- 标题
- 开头3秒钩子
- 镜头设计
- 台词文案
- 结尾引导

要求：
- 内容要真实可用
- 不要空话
- 语言自然
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
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "DeepSeek 调用失败"
      });
    }

    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(500).json({
        error: "接口返回成功，但没有拿到内容"
      });
    }

    return res.status(200).json({ result });

  } catch (err) {
    return res.status(500).json({
      error: err.message || "服务器错误"
    });
  }
}
要求：
- 内容要真实可用
- 不要空话
- 语言自然
- 除标题“### 品牌分析”“### 用户需求理解”“### 脚本1：情绪共鸣型”“### 脚本2：产品卖点型”“### 脚本3：剧情反转型”外，正文不要使用星号、井号等 Markdown 符号
- 正文请直接用自然语言分点表达
`;
