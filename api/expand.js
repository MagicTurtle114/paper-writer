// 這個檔案運行在 Node.js 環境（後端），瀏覽器看不到這裡的代碼
export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 從 Vercel 的環境變數中取得 Key（這在前端是抓不到的）
  const API_KEY = process.env.GEMINI_API_KEY; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body), // 直接轉發前端傳來的 body
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}