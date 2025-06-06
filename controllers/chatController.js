const dbConn = require('../db/mysqlconnect');
const axios = require('axios');

const chatWithData = async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Örnek: basit intent çözümü (AKBNK gibi hisse kodu içeriyor mu?)
    const symbolMatch = userMessage.match(/\b[A-Z]{3,5}\b/);
    const symbol = symbolMatch ? symbolMatch[0] : null;

    let analizData = null;

    if (symbol) {
      // hisse verisi çek (temel_analiz_verileri)
      const [rows] = await new Promise((resolve, reject) => {
        dbConn.query('CALL temel_analiz_verileri(?)', [symbol], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      analizData = rows[0]; // tek satır
    }

    // ChatGPT API çağrısı
    const prompt = `
Kullanıcıdan gelen mesaj: "${userMessage}"

${analizData ? `Aşağıda ${symbol} için bazı finansal veriler yer alıyor:\n${JSON.stringify(analizData)}` : ''}

Bu verilere dayalı şekilde profesyonel ama anlaşılır bir cevap ver:
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4", // veya "gpt-3.5-turbo"
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gptReply = response.data.choices[0].message.content;
    res.json({ reply: gptReply });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).send("Bir hata oluştu.");
  }
};

module.exports = { chatWithData };
