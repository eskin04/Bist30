const dbConn = require('../db/mysqlconnect');
const bcrypt = require('bcrypt');

const register = (req, res) => {
    const { name, surname, mail, tel_no, password } = req.body;
    const semboller = ['AKBNK', 'THYAO', 'FROTO', 'ASELS', 'SISE'];
    const baslangic_bakiye = 100000;

    bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
            dbConn.query('SELECT * FROM kullanicilar WHERE email=?', [mail], (err, rows) => {
                if (err) return console.log(err);
                if (rows.length > 0) return res.send({ message: "Bu mail adresi kullanılmaktadır." });

                // 1. Kullanıcı ekle
                dbConn.query(
                    'INSERT INTO kullanicilar (adi, soyadi, email, password, tel_no) VALUES (?, ?, ?, ?, ?)',
                    [name, surname, mail, hash, tel_no],
                    (err, result) => {
                        if (err) return console.log(err);
                        const kullanici_id = result.insertId;

                        // 2. Portföy ekle
                        dbConn.query(
                            'INSERT INTO portfoy (kullanici_id, bakiye) VALUES (?, ?)',
                            [kullanici_id, baslangic_bakiye],
                            (err, result2) => {
                                if (err) return console.log(err);
                                const portfoy_id = result2.insertId;

                                // 3. Rastgele hisse çek
                                const sembol = semboller[Math.floor(Math.random() * semboller.length)];
                                dbConn.query('CALL get_hisse(?)', [sembol], (err, result3) => {
                                    if (err) return console.log(err);

                                    const hisse = result3[0][0];
                                    const adet = Math.floor(50 + Math.random() * 50);
                                    const toplam_tutar = adet * hisse.hisse_fiyat;
                                    const yeni_bakiye = baslangic_bakiye - toplam_tutar;

                                    // 4. Portföy_hisse tablosuna ekle
                                    dbConn.query(
                                        'CALL portfoy_insert(?,?,?)',
                                        [hisse.hisse_id, portfoy_id, adet],
                                        (err, result4) => {
                                            if (err) return console.log(err);

                                            // 5. Portföy bakiyesini güncelle
                                            dbConn.query(
                                                'CALL portfoy_update(?,?)',
                                                [kullanici_id, yeni_bakiye],
                                                (err, result5) => {
                                                    if (err) return console.log(err);

                                                    res.send({ message: "Kayıt başarılı, portföy oluşturuldu." });
                                                }
                                            );
                                        }
                                    );
                                });
                            }
                        );
                    }
                );
            });
        })
        .catch(err => console.log(err));
};

module.exports = register;
