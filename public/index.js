var user=JSON.parse(localStorage.getItem('user'))
document.getElementById('username').innerHTML = user.adi + ' ' + user.soyadi
document.getElementById('yatirim').innerHTML = (user.soyadi).toUpperCase() + ' YATIRIM'

console.log(user['adi'])

fetch('http://localhost:3000/api/en_fazla_kar_eden_sirket')
    .then(res => res.json())
    .then(res => {
        console.log(res)
        let kar = res.kar_son_ceyrek
        // basamaklarına göre virgül koyar ve 7 basamak olduğunda sonuna M ekler ama geri kalanı siler
        // 1.000.000 => 1M
        kar = kar.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' }).slice(0, -5)
        kar = kar + 'M'
        document.getElementById('en_fazla_kar_eden_sirket').innerHTML = res.hisse_ad
        document.getElementById('en_fazla_kar_eden_sirket_kar').innerHTML = kar
        document.getElementById('en_fazla_kar_eden_sirket_kar_yuzde').innerHTML = res.kar_degisim + '%'
    })  

fetch('http://localhost:3000/api/en_fazla_zarar_eden_sirket')
    .then(res => res.json())
    .then(res => {
        console.log(res.hisse_ad)
        let zarar = res.kar_son_ceyrek
        // basamaklarına göre virgül koyar ve 7 basamak olduğunda sonuna M ekler ama geri kalanı siler
        // 1.000.000 => 1M
        zarar = zarar.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' }).slice(0, -2)
        zarar = zarar + 'B'
        document.getElementById('en_fazla_zarar_eden_sirket').innerHTML = res.hisse_ad
        document.getElementById('en_fazla_zarar_eden_sirket_zarar').innerHTML = zarar
        document.getElementById('en_fazla_zarar_eden_sirket_zarar_yuzde').innerHTML = res.kar_degisim + '%'
    })

