require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

// 初始化 Express 和 OpenAI 客户端
const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 设置中间件
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // 提供静态文件

// 处理主页请求，返回 chat.html 文件
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// 处理 API 聊天请求
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-2024-04-09', // 使用你需要的模型
      messages: [{ role: 'user', content: userMessage }],
    });

    const chatResponse = response.choices[0].message.content;
    res.json({ response: chatResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: 'Error communicating with AI' });
  }
});


//获取创造图片的页面
app.get('/create-image', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'creatimg.html'));
});


// 发送生成图片的请求
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // 使用 DALL-E 3 生成图片
    const response = await openai.images.generate({
      model: "dall-e-3", // 指定使用 DALL-E 3 模型
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // 可选设置，如需不同质量可以调整
    });
    console.log("API Response:", response);
    
    const imageUrl = response.data[0].url;
    res.json({ imageUrl: imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Image generation failed." });
  }
});




// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
