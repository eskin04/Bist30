const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const urlMap = {
  "EREGL": "https://www.bloomberght.com/borsa/hisse/eregli-demir-cel",
  "AKBNK": "https://www.bloomberght.com/borsa/hisse/akbank",
  "THYAO": "https://www.bloomberght.com/borsa/hisse/turk-hava-yollar",
  "HEKTS": "https://www.bloomberght.com/borsa/hisse/hektas",
  "ALARK": "https://www.bloomberght.com/borsa/hisse/alarko-hldg",
  "TCELL": "https://www.bloomberght.com/borsa/hisse/turkcell-iletisi",
  "PETKM": "https://www.bloomberght.com/borsa/hisse/petkim",
  "SISE": "https://www.bloomberght.com/borsa/hisse/turk-sise-cam",
  "ASELS": "https://www.bloomberght.com/borsa/hisse/aselsan",
  "ISCTR": "https://www.bloomberght.com/borsa/hisse/isbank-c",
  "GARAN": "https://www.bloomberght.com/borsa/hisse/turkiye-garanti",
  "ARCLK": "https://www.bloomberght.com/borsa/hisse/arcelik-as",
  "ASTOR": "https://www.bloomberght.com/borsa/hisse/astor-transforma",
  "BIMAS": "https://www.bloomberght.com/borsa/hisse/bim-birlesik-mag",
  "EKGYO": "https://www.bloomberght.com/borsa/hisse/emlak-konut-gayr",
  "ENKAI": "https://www.bloomberght.com/borsa/hisse/enka-insaat",
  "FROTO": "https://www.bloomberght.com/borsa/hisse/ford-otomotiv",
  "GUBRF": "https://www.bloomberght.com/borsa/hisse/gubre-fabrikalar",
  "KCHOL": "https://www.bloomberght.com/borsa/hisse/koc-hldg",
  "KONTR": "https://www.bloomberght.com/borsa/hisse/kontrolmatik-ene",
  "KOZAL": "https://www.bloomberght.com/borsa/hisse/koza-altin-islet",
  "KRDMD": "https://www.bloomberght.com/borsa/hisse/kardemir-kara-d",
  "ODAS": "https://www.bloomberght.com/borsa/hisse/odas-elektrik-ur",
  "OYAKC": "https://www.bloomberght.com/borsa/hisse/oyak-cimento",
  "PGSUS": "https://www.bloomberght.com/borsa/hisse/pegasus-hava-tas",
  "SAHOL": "https://www.bloomberght.com/borsa/hisse/sabanci-hldg",
  "SASA": "https://www.bloomberght.com/borsa/hisse/sasa",
  "TOASO": "https://www.bloomberght.com/borsa/hisse/tofas-turk-otomo",
  "TUPRS": "https://www.bloomberght.com/borsa/hisse/tupras",
  "YKBNK": "https://www.bloomberght.com/borsa/hisse/yapi-kredi-bank"
};

const tahminliFiyat = async (req, res) => {
  const hisse = req.query.hisse?.toUpperCase();
  const hisseUrl = urlMap[hisse];

  if (!hisseUrl) return res.status(400).json({ error: "Geçersiz hisse sembolü." });

  try {
    const response = await axios.get(hisseUrl);
    const $ = cheerio.load(response.data);

    const extract = (label) =>
      $(`td:contains("${label}")`).next("td").text().trim().replace(/\./g, "").replace(",", ".");

    const veri = {
      alis: extract("ALIŞ"),
      satis: extract("SATIŞ"),
      fark: extract("FARK"),
      onceki: extract("ÖNCEKİ KAPANIŞ"),
      yuksek: extract("EN YÜKSEK"),
      dusuk: extract("EN DÜŞÜK"),
      hacim: extract("HACİM"),
      hacimlot: extract("HACİM(LOT)"),
      lastPrice: $(".lastPrice").first().text().trim().replace(",", ".")
    };
    console.log("Veri çekildi:", veri);

    const tarihDizisi = Array.from({ length: 10 }, (_, i) => {
      const t = new Date();
      t.setDate(t.getDate() + i + 1);
      return t.toISOString().split("T")[0];
    });

    const prompt = `
Sen bir veri analisti ve finansal tahmin uzmanısın. Ne olursa olsun her halükarda bir tahmin yapacaksın.
Asla üzgünüm demeyeceksin, çünkü zaten sözde bir tahmin yapıyorsun.
${hisse} hissesi için Bloomberg verileri:
- ALIŞ: ${veri.alis}
- SATIŞ: ${veri.satis}
- FARK: ${veri.fark}
- ÖNCEKİ KAPANIŞ: ${veri.onceki}
- EN YÜKSEK: ${veri.yuksek}
- EN DÜŞÜK: ${veri.dusuk}
- HACİM: ${veri.hacim}
- HACİM(LOT): ${veri.hacimlot}
- SON FİYAT: ${veri.lastPrice}

Bu verileri kullanarak, önümüzdeki 10 gün için ${hisse} hissesinin fiyat tahminini yap.Fiyat tahmini yaparken stabil ilerleyen bir grafik değil daha dalgalı bir grafik istiyorum.

Ne olursa olsun bir tahmin yapmaya çalış. Zaten sözde bir tahmin yapıyorsun, bu yüzden verileri kullanarak bir tahminde bulunabilirsin.
Bu verilere göre şu anki tarihten itibaren önümüzdeki 10 günün fiyat tahminini yap ve aşağıdaki JSON formatında döndür. Başka bir şey yazma, sadece JSON formatında cevap ver.
Kesinlikle json formatı dışında bir şey yazma, sadece JSON formatında cevap ver.
Lütfen sadece JSON formatında cevap ver, başka bir şey yazma. Cevap verirken ne başında ne sonunda herhangi bir cümle kurma. Aşağıdaki gibi bir JSON döndür:

JSON formatı:

{
  "tarih": ["${tarihDizisi.join('","')}"],
  "fiyat": [${veri.lastPrice}, ...]
}
`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const content = gptResponse.choices[0].message.content;
    console.log("GPT cevabı:", content);
    // ...önceki kodlar aynı
    const parsed = JSON.parse(content);

    res.json({
    tahmin: parsed,
    veriler: veri // Bloomberg verilerini de gönderiyoruz
    });

  } catch (error) {
    console.error("Tahmin hatası:", error.message);
    res.status(500).json({ error: "Veri çekme veya GPT hatası", detay: error.message });
  }
};

module.exports = { tahminliFiyat };
