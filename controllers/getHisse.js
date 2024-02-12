
// VERİ TABANINDAKİ YORDAMLARI ÇAĞIRAN REQUESTLERİN YAZILDIĞI KISIM

const dbConn= require('../db/mysqlconnect');

const en_fazla_kar_eden_sirket= (req, res) => {
    dbConn.query('CALL en_fazla_kar_eden_sirket()', (err, result) => {
        if (err) throw err;
        res.send(result[0][0])
    })
}

const en_fazla_zarar_eden_sirket= (req, res) => {
    dbConn.query('CALL en_fazla_zarar_eden_sirket()', (err, result) => {
        if (err) throw err;
        res.send(result[0][0])
    })
}

const hisseBysembol = (req, res) => {
    let sembol = req.query.tvwidgetsymbol.split(':')[1]
    dbConn.query('CALL temel_analiz_verileri(?)', [sembol], (err, result) => {
        if(!err){
            res.send(result[0][0])
        
        }
        else{
            console.log(err)
        }
    })
}

const hisseler = (req, res) => {
    dbConn.query('CALL hisse_analiz()', (err, result) => {
        if (err) throw err;
        res.send(result[0])
    })
}

module.exports = {en_fazla_kar_eden_sirket,en_fazla_zarar_eden_sirket,hisseBysembol,hisseler}