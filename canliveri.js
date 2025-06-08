const axios = require('axios');
const cheerio = require('cheerio');
const dbConn = require('./db/mysqlconnect');

const url ={
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
  }
  

//5 sanıyede bir veri çekiyor

function hissefiyat(key, URL) {
    axios.get(URL)
        .then(response => {
            const $ = cheerio.load(response.data);
            const fiyatText = $('span.lastPrice').first().text().trim();

            const formatted = fiyatText.replace(',', '.');
            const fiyat = parseFloat(formatted);

            if (isNaN(fiyat)) {
                console.log(`[HATA] ${key} fiyat alınamadı: '${fiyatText}'`);
                return;
            }

            const yuvarlanmisFiyat = fiyat.toFixed(2);

            dbConn.query(
                'UPDATE hisseler SET hisse_fiyat=? WHERE hisse_sembol=?',
                [yuvarlanmisFiyat, key],
                (err, result) => {
                    if (err) {
                        console.error(`[MYSQL] ${key} güncellenemedi`, err);
                    } 
                }
            );
        })
        .catch(error => {
            console.error(`[HTTP] ${key} veri alınamadı`, error.message);
        });
}


function hissefiyatlar()
{
   for (const [key, value] of Object.entries(url)) {
    hissefiyat(key,value);
   }

}

function hisseler()
{
    setInterval(hissefiyatlar, 15000);
}

module.exports = { hisseler }

