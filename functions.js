var map, posicioninicial;
var apikey = "d890118bdd72ea2c15a196a419e3f82b"; //clave de acceso para la api openweathermap
 
function comenzar(){
        
  var miboton = document.getElementById("inicializar"); // declaro el boton para inicializar el mapa
  miboton.addEventListener("click",inicializar,false);  //pongo el boton a la escucha del evento click
  var mibotonbuscar = document.getElementById("search");
  mibotonbuscar.addEventListener("click",buscar,false);
  var caja  = document.getElementById("address");
  caja.addEventListener("keypress",buscador,false);

  // guarda coords en lat y lng
  GMaps.geolocate({
    success: function(position){
       var lat = position.coords.latitude;  
       var lng = position.coords.longitude;
       posicioninicial = [lat,lng];    //guardo en posicioninicial las coordenadas iniciales
       crearmapa(lat,lng);      // muestra mapa centrado en coords [lat, lng]
       map.addMarker({ lat: lat, lng: lng});   // marcador en [lat, lng]
       
    },
    error: function(error) { alert('Geolocalización falla: ' + error.message); },
    not_supported: function(){ alert("Su navegador no soporta geolocalización"); },
  });
}

function crearmapa(lat,lng){

  map = new GMaps({  
    el: '#map',
    lat: lat,
    lng: lng,
    click: seleccionarpunto,
  });
}

function seleccionarpunto(e){

  map.removeMarkers();    // borramos el marcador anterior
  lat = e.latLng.lat();   // guardamos los valores de la latitud y la longitud para dibujarlos en el mapa
  lng = e.latLng.lng();
  

  $.ajax({   // se realiza la llamada a la api de metereologia y se guarda la informacion relativa al tiempo actual
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + apikey + "&units=metric&lang=es",
    success: function( data ) {
       var datosactuales = data;
          procesaDatos(datosactuales);
    },
    error: function(){
      alert("¡Ups! No puedo obtener información de la API");
    }
  });
};

function procesaDatos(datosactuales){

 $.ajax({   // se realiza la llamada a la api de metereologia y se guarda la informacion relativa al pronostico del tiempo
    url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lng + "&appid=" + apikey + "&units=metric&lang=es",
    success: function( data ) {
     var datosfuturos = data;
          muestraDatos(datosactuales,datosfuturos);
    },
    error: function(){
      alert("¡Ups! No puedo obtener información de la API");
    }
  });
}

function muestraDatos(datosactuales,datosfuturos){    // mostramos los datos en el pop up

  var marker = map.addMarker({ lat: lat, lng: lng});   // ponemos el nuevo marcador con las coordenadas actuales
  var contentString = "<div>Temperatura actual: " + datosactuales.main.temp + " ºC - Nubosidad: " + datosactuales.clouds.all + " % </div> <br> <div>Tª media mañana: " + datosfuturos.list[0].main.temp + " ºC - Nubosidad mañana: " + datosfuturos.list[0].clouds.all + " % </div>  <br> <div>Tª media pasado mañana: " + datosfuturos.list[1].main.temp + " ºC - Nubosidad pasado mañana: " + datosfuturos.list[1].clouds.all + " % </div>";
  var infowindow = new google.maps.InfoWindow({content: contentString});
  infowindow.open(map, marker);
}

function inicializar(){     // mostramos el mapa en la posicion inicial 
      
	crearmapa(posicioninicial[0],posicioninicial[1]);    // muestra mapa centrado en coords [lat, lng]
  map.addMarker({ lat: posicioninicial[0], lng: posicioninicial[1]});   // añade marcador en [lat, lng]
  document.getElementById("address").value = "";
}

function buscar() {   // buscamos las coordenadas de una direccion y la buscamos en el mapa

  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function (results, status) {

    if (status == google.maps.GeocoderStatus.OK) {

      crearmapa(results[0].geometry.location.lat().toFixed(6),results[0].geometry.location.lng().toFixed(6))
      map.addMarker({ lat: results[0].geometry.location.lat().toFixed(6), lng: results[0].geometry.location.lng().toFixed(6)});   // marcador en [lat, lng]
      
    }else{ alert("Dirección no encontrada!!!"); }

  });
}

function buscador(e,valor){    // Busca la ciudad introducida cuando se pulsa enter

  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) buscar();   
}
   
window.addEventListener("load",comenzar,false);