var map, lat, lng, posicioninicial,geocoder;
var x,y;      //posicion del raton en la pantalla
var apikey = "d890118bdd72ea2c15a196a419e3f82b"; //clave de acceso para la api openweathermap
 
function comenzar(){
        
  var miboton = document.getElementById("inicializar"); // declaro el boton para inicializar el mapa
  miboton.addEventListener("click",inicializar,false);  //pongo el boton a la escucha del evento click
  var mibotonbuscar = document.getElementById("search");
  mibotonbuscar.addEventListener("click",buscar,false);
  var seccion = document.getElementById("seccion");
  seccion.addEventListener("mousemove",posicionraton,false);
  var caja  = document.getElementById("address");
  caja.addEventListener("keypress",buscador,false);

  // guarda coords en lat y lng
  GMaps.geolocate({
    success: function(position){
       lat = position.coords.latitude;  
       lng = position.coords.longitude;
       posicioninicial = [lat,lng];    //guardo en posicioninicial las coordenadas iniciales
       crearmapa(lat,lng);      // muestra mapa centrado en coords [lat, lng]
       map.addMarker({ lat: lat, lng: lng});   // marcador en [lat, lng]
       geocoder = new google.maps.Geocoder();
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
    tap: seleccionarpunto
  });
}

function seleccionarpunto(e){

  map.removeMarkers();    // borramos el marcador anterior
  lat = e.latLng.lat();   // guardamos los valores de la latitud y la longitud para dibujarlos en el mapa
  lng = e.latLng.lng();
  map.addMarker({ lat: lat, lng: lng});   // ponemos el nuevo marcador con las coordenadas actuales

  //creamos un pop up donde se muestran los datos de openweathermap
  window.open("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&mode=html&appid=" + apikey + "&units=metric&lang=es","","status=no,directories=no,menubar=no,toolbar=no,scrollbars=no,location=no,resizable=no,titlebar=no, width=160, height=170, top=" + y + ", left=" + x);       
};

function inicializar(){     // mostramos el mapa en la posicion inicial 
      
	crearmapa(posicioninicial[0],posicioninicial[1]);    // muestra mapa centrado en coords [lat, lng]
  map.addMarker({ lat: posicioninicial[0], lng: posicioninicial[1]});   // añade marcador en [lat, lng]
  document.getElementById("address").value = "";  
}

function posicionraton(event){   // guardamos la posicion del raton en la pantalla para poder mostrar el pop up en el lugar correcto 

  x = event.clientX;
  y = event.clientY;
}

function buscar() {   // buscamos las coordenadas de una direccion y la buscamos en el mapa

  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function (results, status) {

  if (status == google.maps.GeocoderStatus.OK) {

    crearmapa(results[0].geometry.location.lat().toFixed(6),results[0].geometry.location.lng().toFixed(6))
    map.addMarker({ lat: results[0].geometry.location.lat().toFixed(6), lng: results[0].geometry.location.lng().toFixed(6)});   // marcador en [lat, lng]
  
  }else{ alert("Dirección no encontrada!!!"); }

  });
}

function buscador(e,valor){

  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) buscar();
}
   
window.addEventListener("load",comenzar,false);