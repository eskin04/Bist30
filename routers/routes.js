const router=require('express').Router()
const register=require('../controllers/register')
const login=require('../controllers/login')
const {en_fazla_kar_eden_sirket,en_fazla_zarar_eden_sirket,hisseBysembol,hisseler}=require('../controllers/getHisse')
const {getPortfoy,updatePortfoy}=require('../controllers/getPortfoy')

router.post('/register',register)
router.post('/login',login)
router.get('/en_fazla_kar_eden_sirket',en_fazla_kar_eden_sirket)
router.get('/en_fazla_zarar_eden_sirket',en_fazla_zarar_eden_sirket)
router.get('/portfoy',getPortfoy)
router.get('/hisseler',hisseBysembol)
router.get('/analiz',hisseler)
router.post('/portfoy',updatePortfoy)

module.exports=router