var user = JSON.parse(localStorage.getItem('user'))

fetch('http://localhost:3000/api/portfoy/?id=' + user.kullanici_id)
.then(res => res.json())
.then(res => {
    console.log(res)
    let portfoy = res
    let portfoyHTML = ''
    let toplam = 0
    
    let bakiye = portfoy[0].bakiye.toLocaleString('tr-TR', { maximumFractionDigits: 2, style: 'currency', currency: 'TRY' })
    // virgülden sonrayı siler
    if(bakiye.includes(','))
    bakiye = bakiye.split(',')[0]
    portfoy.forEach(element => {
        let hisse_sembol = element.hisse_sembol.toLowerCase()
        let hisse_fiyat = element.hisse_fiyat.toLocaleString('tr-TR', { maximumFractionDigits: 2, style: 'currency', currency: 'TRY' })
        let carpim = element.hisse_fiyat * element.hisse_adet
        carpim = carpim.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })

        toplam += (element.hisse_fiyat * element.hisse_adet)
        portfoyHTML += `
        <div class="preview-item border-bottom">
                            <div class="preview-thumbnail">
                              <div class="preview-icon bg-primary">
                                <img src="https://fintables.com/_next/image?url=https%3A%2F%2Ffintables-prod.storage.googleapis.com%2Fmedia%2Fuploads%2Fcompany-logos%2F${hisse_sembol}_icon.png&w=48&q=75" alt="">
                              </div>
                            </div>
                            <div class="preview-item-content d-sm-flex flex-grow">
                              <div class="flex-grow">
                                <h6 class="preview-subject">${element.hisse_sembol}</h6>
                                <p class="text-muted mb-0">${hisse_fiyat}</p>
                              </div>
                              <div class="mr-auto text-sm-right pt-2 pt-sm-0">
                                <p class="text-muted">${element.hisse_adet} LOT</p>
                                <p class="text-muted mb-0">${carpim}</p>
                              </div>
                            </div>
                          </div>
        `
    });
    toplam = toplam.toLocaleString('tr-TR', { maximumFractionDigits: 0, style: 'currency', currency: 'TRY' })
    document.getElementById('toplam').innerHTML = toplam
    document.getElementById('bakiye').innerHTML = bakiye
    document.getElementById('portfoy').innerHTML = portfoyHTML
})