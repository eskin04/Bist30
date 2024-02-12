var hisseLocation = window.location.href
hisseLocation=hisseLocation.split('?')[1].split('&')[0].split('=')[1]
var sembol = hisseLocation.split('%3A')[1]
console.log(sembol)
document.getElementById('hisseanalizadı').innerHTML = sembol +' Temel Analiz Verileri'
var user = JSON.parse(localStorage.getItem('user'))


fetch('http://localhost:3000/api/hisseler/?tvwidgetsymbol=' + hisseLocation)
    .then(res => res.json())
    .then(res => {
        console.log(res)
        res.satislar_son_ceyrek = res.satislar_son_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.satislar_ilk_ceyrek = res.satislar_ilk_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.favok_son_ceyrek = res.favok_son_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.favok_ilk_ceyrek = res.favok_ilk_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.kar_son_ceyrek = res.kar_son_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.kar_ilk_ceyrek = res.kar_ilk_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.ozkaynaklar_son_ceyrek = res.ozkaynaklar_son_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.ozkaynaklar_ilk_ceyrek = res.ozkaynaklar_ilk_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.net_borc_son_ceyrek = res.net_borc_son_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        res.net_borc_ilk_ceyrek = res.net_borc_ilk_ceyrek.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
        let html =  `
            <tr>
            <td>Satışlar</td>
            <td>${res.satislar_son_ceyrek}</td>
            <td>${res.satislar_ilk_ceyrek}</td>
            <td><label class="badge ${res.satislar_degisim>=0?'badge-success':'badge-danger'}">${res.satislar_degisim}%</label></td>
          </tr>
          <tr>
            <td>Favök</td>
            <td>${res.favok_son_ceyrek}</td>
            <td>${res.favok_ilk_ceyrek}</td>
            <td><label class="badge ${res.favok_degisim>=0?'badge-success':'badge-danger'}">${res.favok_degisim}%</label></td>
          </tr>
          <tr>
            <td>Kar</td>
            <td>${res.kar_son_ceyrek}</td>
            <td>${res.kar_ilk_ceyrek}</td>
            <td><label class="badge ${res.kar_degisim>=0?'badge-success':'badge-danger'}">${res.kar_degisim}%</label></td>
          </tr>
          <tr>
            <td>Özkaynaklar</td>
            <td>${res.ozkaynaklar_son_ceyrek}</td>
            <td>${res.ozkaynaklar_ilk_ceyrek}</td>
            <td><label class="badge ${res.ozkaynaklar_degisim>=0?'badge-success':'badge-danger'}">${res.ozkaynaklar_degisim}%</label></td>
          </tr>
          <tr>
            <td>Net Borç</td>
            <td>${res.net_borc_son_ceyrek}</td>
            <td>${res.net_borc_ilk_ceyrek}</td>
            <td><label class="badge ${res.net_borc_degisim>=0?'badge-success':'badge-danger'}">${res.net_borc_degisim}%</label></td>
          </tr>
            `
        document.getElementById('analizveri').innerHTML = html
    })

document.getElementById('hissesembol').innerHTML = sembol
console.log(user)
fetch('http://localhost:3000/api/portfoy/?id=' + user.kullanici_id)
.then(res => res.json())
.then(res => {
    console.log(res)
    let portfoy = res
    
    
    let bakiye = portfoy[0].bakiye.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
    document.getElementById('bakiye').innerHTML = bakiye
})

function postPortfoy()
{
  fetch('http://localhost:3000/api/portfoy/?id=' + user.kullanici_id)
.then(res => res.json())
.then(res => {
    console.log(res)
    let portfoy = res
    
    
    let bakiye = portfoy[0].bakiye
    fetch('http://localhost:3000/api/portfoy',{
      method:'POST',
      headers:{
          'Content-Type':'application/json'
      },
      body:JSON.stringify({
          kullanici_id:user.kullanici_id,
          hisse_sembol:sembol,
          adet:document.getElementById('adet').value,
          bakiye:bakiye
      })
  })
  .then(
    alert('Hisse Alım İşlemi Başarılı')

  )
  
})

}

function toggleForm() {
  var container = document.querySelector('.login-box');
  if(container.style.display === "none") {
    container.style.display = "block";
  }else{
    container.style.display = "none";
  }
  
}



