let contenido = document.querySelector("#respuestaAPI");

//Función similar a $().ready
document.addEventListener("DOMContentLoaded", function(event) {
    init();    
})

function init(){
    $('#datosIncorrectos').hide();
    const form = document.querySelector("#formularioDirecciones");
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        contenido.innerHTML='';
        const direccion = document.querySelector("#direccion").value;
        const numero = document.querySelector("#numero").value;
        const pisoYdepto = document.querySelector("#pisoYDepto").value;
        const provincia = document.querySelector("#provincia").value;
        const objetoAEnviar = {direccion, numero, provincia};
        console.log(objetoAEnviar);

        if (direccion === '' || numero === ''){
            $('#datosIncorrectos').toggle(500).delay(1500).toggle(500);
        } else {
            fnSendGeoRef(objetoAEnviar);
        }
    })
}

//Destructuring de objetos.
function fnSendGeoRef ({direccion, numero, provincia}){
    
    if (provincia !== ''){
        //Utilizamos la API geoRef que nos provee el gobierno, para normalizar direcciones.
        fetch (`https://apis.datos.gob.ar/georef/api/direcciones?direccion=${direccion}${numero}&provincia=${provincia}`)
            .then(res=> res.json())
            .then(data => {
                console.log(data);
                let direccion = data.direcciones[0].nomenclatura;
                crearHTML(direccion);
        })
            .catch(error => console.log("Oops something went wrong: " + error));

    }else{
        //En caso de no obtener valores de provincia, el request es distinto de antes.
        fetch (`https://apis.datos.gob.ar/georef/api/direcciones?direccion=${direccion}${numero}`)
            .then(res=> res.json())
            .then(data=> {
                console.log(data);
                let direcciones = data.direcciones;
                for (direccion of direcciones){
                    crearHTML(direccion.nomenclatura);
                }
            })
            .catch(error => console.log("Oops something went wrong: " + error));; 
    }
}

function crearHTML (direccion){
    contenido.innerHTML += `<div class="row">
                                <h3>Dirección normalizada: ${direccion}</h3>
                            </div>`;
}