const dbConn=require('../db/mysqlconnect')
const bcrypt=require('bcrypt')



const login=(req,res)=>{
    const {mail,password}=req.body
    dbConn.query('SELECT * FROM kullanicilar WHERE email=?',[mail],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                bcrypt.compare(password,rows[0].password,(err,result)=>{
                    if(result){
                        res.send(rows[0])
                    }else{
                        res.send({message:"Şifre Hatalı"})
                    }
                })
            }else{
                res.send({message:"Kullanıcı Bulunamadı"})
            }
        }else{
            res.send({message:"Veritabanı Hatası"})
            console.log(err)
        }
    })
}

module.exports=login