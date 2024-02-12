const dbConn = require('../db/mysqlconnect')
const bcrypt = require('bcrypt')


const register = (req, res) => {
    const { name,surname,mail,tel_no, password } = req.body
    bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => {
        dbConn.query('SELECT * FROM kullanicilar WHERE email=?', [mail], (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    res.send({message:"Bu mail adresi kullanılmaktadır."})
                    
                } else {
                    dbConn.query('INSERT INTO kullanicilar (adi,soyadi,email, password,tel_no) VALUES (?,?,?,?,?)', [name,surname,mail,hash,tel_no ], (err, rows) => {
                        if (!err) {
                            res.send({message:"Kayıt Başarılı"})
                        } else {
                            console.log(err)
                        }
                    })
                }
            } else {
                console.log(err)
            }
        })
        
    })
    .catch(err => console.log(err))
}

module.exports = register