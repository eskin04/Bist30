var hisseLocation = window.location.href
hisseLocation=hisseLocation.split('?')[1].split('&')[0].split('=')[1]
let hissesembol = hisseLocation.split('%3A')[1]

fetch('http://localhost:3000/api/hisseler/?tvwidgetsymbol=' + hisseLocation)
.then(response => response.json())
.then(element => {
	var enflasyon = 95;
	var kardegisim = 0;
	var borc = 0;
	var ozkaynak = 0;
	var puan = 0;
	var karsonceyrek = 0;
	var favok = 0;
	var satislar = 0;
	kardegisim = element.kar_degisim;
	borc = element.net_borc_son_ceyrek;
	ozkaynak = element.ozkaynaklar_son_ceyrek;
	karsonceyrek = element.kar_son_ceyrek;
	favok = element.favok_son_ceyrek;
	satislar = element.satislar_son_ceyrek;
	
	if(kardegisim > enflasyon){
		puan += 36;
	}
	if(borc/ozkaynak < 0.5){
		puan += 36;
	}
	if(karsonceyrek/ozkaynak > 0.3){
		puan += 36;
	}
	if(karsonceyrek > 0){
		puan += 36;
	}
	if(favok/(satislar*100) > 0.1){
		puan += 36;
	}
	let html =  `
	<div onclick="toggleForm()" class="btn ${puan/1.8<50?"btn-danger":puan/1.8<75?"btn-warning":"btn-success"}">${puan/1.8<25?"Güçlü Sat":puan/1.8<50?"Sat":puan/1.8<75?"Al":"Güçlü Al"}</div>`
	document.getElementById('analizbutton').innerHTML = html;
	rotateDial(puan);
	
});

var dial = $(".dial .inner");
	var gauge_value = $(".gauge .value");

		function rotateDial(puan)
		{
			
			var deg = 0;
			deg = (puan * 100) / 100;

			gauge_value.html(puan/1.8 + "%");


			dial.css({'transform': 'rotate('+deg+'deg)'});
		    dial.css({'-ms-transform': 'rotate('+deg+'deg)'});
		    dial.css({'-moz-transform': 'rotate('+deg+'deg)'});
		    dial.css({'-o-transform': 'rotate('+deg+'deg)'}); 
		    dial.css({'-webkit-transform': 'rotate('+deg+'deg)'});
		}

