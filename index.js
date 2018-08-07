var lat;
var lng;
var urlSaLokacijom;
var stranica = document.getElementById('greska');
var detaljiLeta = document.getElementById('details');
var lista = document.getElementById('content');



/////////////////// geoLokacija //////////////////////////////////
function geoLokacija(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(prikazi, greska);
            
        } 
    }
geoLokacija();


function prikazi(pozicija){
    lat = pozicija.coords.latitude;
    lng = pozicija.coords.longitude;
    urlSaLokacijom = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + lat + "&lng=" + lng + "&fDstL=0&fDstU=300" ;
    console.log('lat=' + lat);
    console.log('lng=' + lng);
    var promise = pozoviApi(urlSaLokacijom);
    promise.then(function(rezult){
        uzmiPodatke(rezult);
    setInterval(function(){
        uzmiPodatke(rezult);
    }, 60000);
    });
    
    
}

function greska(error) {
   stranica.innerHTML = error.message;
}


//////////////////////////// konstruktorska leta ///////////////////////////////////
function Let(Kod, IstocnoZapano, Visina, Proizvodjac, Model, PolaznaTacka, Destinacija, Logo){
    this.Kod = Kod;
    this.IstocnoZapano = IstocnoZapano;
    this.Visina = Visina;
    this.Proizvodjac = Proizvodjac;
    this.Model = Model;
    this.PolaznaTacka = PolaznaTacka;
    this.Destinacija = Destinacija;
    this.Logo = Logo;
}



////////////////////// uzmi podatke sa api //////////////////////////////////
function uzmiPodatke(rez){
    var zapad;
    var rezultat = rez.acList;
    lista.innerHTML = "";
    rezultat.sort(function(a, b) {
        return b.Alt - a.Alt;
    });

    for(var i in rezultat){
        if(rezultat[i].Trak > 180){
         zapad = true;
        } else zapad = false;
         
         
        var let = new Let(rezultat[i].Id, zapad, rezultat[i].Alt, rezultat[i].Man, rezultat[i].Mdl, rezultat[i].From, rezultat[i].To, "logo" );
        crtajLet(let);
    }

}

/////////////////////// pozivanje api /////////////////////////////////////

function pozoviApi(url){
    return new Promise(function(resolve, reject){
        var httpreq = new XMLHttpRequest();
        httpreq.open("GET", url, true);
        httpreq.onload = function(){
            if(httpreq.status == 200){
                resolve(JSON.parse(httpreq.response));
            } else {
                reject(httpreq.statusText);
            }
        };
        httpreq.onerror = function(){
            reject(httpreq.statusText);
        };
        httpreq.send();
    });
   
}

//////////////////////////////////////////////// detalji leta ///////////////////////////////////
function getDetails(element){
    $("#content").hide();
    $("#details").show();
    $("#backButton").slideDown(500);
    detaljiLeta.innerHTML = "";
    var detalji;
    var rez = pozoviApi(urlSaLokacijom);
    rez.then(function(resul){
        var result = resul.acList;
        for(var i in result){
            if(element.children[0].id == result[i].Id){
                var logoSrc = makeLogo(result[i].Op); 
                detalji = new Let(result[i].Id, "zapad", result[i].Alt, result[i].Man, result[i].Mdl, result[i].From, result[i].To, logoSrc)
                crtajDetalje(detalji);
                break;
            }
        }
        function makeLogo(naziv){
           return "https://logo.clearbit.com/" + naziv.split(" ").join().replace(/,/g , "").toLowerCase() + ".com";
        }
    })
   
    
}

function backToList(){
    $("#content").show();
    $("#details").hide();
    $("#backButton").hide(500);
}

///////////////////////////////////////////////// crtaj let  ///////////////////////////////////
function crtajLet(let){
    var slika;
    var divGlavni = document.getElementById("content");
  
              var linkDiv = document.createElement("a");
              linkDiv.setAttribute("onclick", "getDetails(this)");
              divGlavni.appendChild(linkDiv);

              var avion = document.createElement("DIV");
              avion.setAttribute("class", "grid-container");
              avion.setAttribute("id", let.Kod);
              linkDiv.appendChild(avion);
             
                  var divV = document.createElement("DIV");
                  divV.setAttribute("class", "grid-item" );
                  avion.appendChild(divV);

                  var idA = document.createElement("DIV");
                  idA.setAttribute("class", "idAviona" );
                  idA.innerHTML = "Flight number: " + let.Kod;
                  divV.appendChild(idA);
      
                      
                  var visinaLeta = document.createElement("DIV");
                  visinaLeta.setAttribute("class", "visina" );     
                  visinaLeta.innerHTML = "Altitude: " + let.Visina + " ft";   
                  divV.appendChild(visinaLeta);
                  
                  var div2 = document.createElement("DIV");
                  div2.setAttribute("class", "grid-item" );
                  avion.appendChild(div2);

                  var zi = document.createElement("IMG");
                  zi.setAttribute("class", "grid-item" );
                  if(let.IstocnoZapano == true){
                      slika = "img/west.png";
                  } else slika = "img/east.png";
                  zi.setAttribute("src", slika );
                  zi.innerHTML = let.IstocnoZapano;        
                  div2.appendChild(zi);
              
                       
                          $('#content').animate({
                              padding: '3px',
                              opacity: '1',
                          }, 500);
                     
  
  }
  
  ///////////////// crtaj detalje //////////////////////////////////
  function crtajDetalje(let){

    var divGlavni = document.getElementById("details");
  
              var avion = document.createElement("DIV");
              avion.setAttribute("class", "grid-container");
              divGlavni.appendChild(avion);
             
                  var divV = document.createElement("DIV");
                  divV.setAttribute("class", "grid-item" );
                  avion.appendChild(divV);

                  var idA = document.createElement("DIV");
                  idA.setAttribute("class", "idAviona" );
                  idA.innerHTML = "Airplane Manufacturer: " + "<span>" + let.Proizvodjac + "</span>";
                  divV.appendChild(idA);

                  var idM = document.createElement("DIV");
                  idM.setAttribute("class", "idAviona" );
                  idM.innerHTML = "Airplane Model: " + "<p>" + let.Model + "</p>";
                  divV.appendChild(idM);

                  var idO = document.createElement("DIV");
                  idO.setAttribute("class", "idAviona" );
                  idO.innerHTML = "Origin airport: " +  "<p>" + let.PolaznaTacka + "</p>";
                  divV.appendChild(idO);

                  var idD = document.createElement("DIV");
                  idD.setAttribute("class", "idAviona" );
                  idD.innerHTML = "Destination airport: "  + "<p>" + let.Destinacija + "</p>";
                  divV.appendChild(idD);
      
                  
                  var div2 = document.createElement("DIV");
                  div2.setAttribute("class", "grid-item" );
                  avion.appendChild(div2);

                  var zi = document.createElement("IMG");
                  zi.setAttribute("class", "grid-item" );
                  zi.setAttribute("id", "slikaKompanije" );
                  zi.setAttribute("onerror", "this.onerror=null;this.src='https://logo.clearbit.com/airplane-pictures.net';this.style='opacity:.8';" );
                  zi.setAttribute("src", let.Logo );
                  div2.appendChild(zi);
                 
                  $('#details').animate({
                    padding: '3px',
                    opacity: '1',
                }, 500);

}