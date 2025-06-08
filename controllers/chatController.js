const dbConn = require('../db/mysqlconnect');
const axios = require('axios');

const chatWithData = async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Örnek: basit intent çözümü (AKBNK gibi hisse kodu içeriyor mu?)
    const symbolMatch = userMessage.match(/\b[A-Z]{3,5}\b/);
    const symbol = symbolMatch ? symbolMatch[0] : null;

    // Tek sembol varsa filtrele, yoksa hepsini al
let analizData = [];


  const [rows] = await new Promise((resolve, reject) => {
    dbConn.query('CALL get_all_temel_analiz()', (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  analizData = rows;



    

    // ChatGPT API çağrısı
    const prompt = `
    Kullanıcıdan gelen mesaj: "${userMessage}"

    ${analizData && analizData.length > 0 ? `Aşağıda BIST30 hisselerine ait temel finansal veriler yer alıyor:

    ${analizData.map(hisse => 
    `📌 ${hisse.hisse_ad} (${hisse.hisse_sembol})
    Kar: ${hisse.kar_son_ceyrek}, Favök: ${hisse.favok_son_ceyrek}, Net Borç: ${hisse.net_borc_son_ceyrek}, Özkaynak: ${hisse.ozkaynaklar_son_ceyrek}, Satış: ${hisse.satislar_son_ceyrek}
    `).join('\n')}` : 'Finansal veri bulunamadı.'}

    Yukarıdaki verilere göre kullanıcıya detaylı, profesyonel bir analiz sun.
    Teknik terimler kullan (kar, favök, satış, net borç, özkaynak gibi).
    Hiçbir zaman "üzgünüm", "veri yetersiz" deme.
    Soruda belirttiği kıyaslamayı veriye göre net cevapla.
    `;


    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo", // veya "gpt-3.5-turbo"
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
