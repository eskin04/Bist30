// KİŞİYE AİT PORTFÖY BİLGİLERİNİ GETİRİR


const dbConn = require('../db/mysqlconnect');

const getPortfoy = (req, res) => {
    dbConn.query('CALL portfoy(?)', [req.query.id], (err, result) => {
        if (err) throw err;
        res.send(result[0])
    })
}

const updatePortfoy = (req, res) => {
    dbConn.query('CALL get_hisse(?)', [req.body.hisse_sembol], (err, result) => {
        if (err) throw err;
        let hisse = result[0][0]
        let hisse_id = hisse.hisse_id
        let fiyat = hisse.hisse_fiyat
        dbConn.query('SELECT portfoy_id FROM `portfoy` WHERE kullanici_id= ?', [req.body.kullanici_id], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(404).send({ message: "Portföy bulunamadı." });
            }
            let portfoy_id = result[0].portfoy_id;
            console.log(portfoy_id)
        console.log(hisse)
        dbConn.query('CALL portfoy_insert(?,?,?)', [hisse_id, portfoy_id, req.body.adet], (err, result) => {
            if (err) throw err;
            res.send(result[0])
            let bakiye = req.body.bakiye - (req.body.adet * fiyat)
            dbConn.query('CALL portfoy_update(?,?)', [req.body.kullanici_id,bakiye], (err, result) => {
                if (err) throw err;
                console.log(result[0])
            })
        })
        })
        
    })
    
}

module.exports = { getPortfoy, updatePortfoy }