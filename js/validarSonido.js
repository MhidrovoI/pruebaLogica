//array de los sonidos
const sonidos = ["brr", "birip", "brrah", "croac", "fiu", "plop", "pep", "cri cric", "trri trri", "bri bri"];

//array de las canciones
const cancion1 =["brr", "fiu", "cric cric", "brrah"];
const cancion2 =["pep", "birip", "trri trri", "croac"];
const cancion3 =["bri bri", "plop", "cric cric", "brrah"];

//funcion para buscar el sonido en el array sonidos
function buscarSonido(sonidoAn){
    //Econtrar el sonido que el usuario hablo
    const sonidoEncontrado = sonidos.find(sonido => sonidoAn.includes(sonido));
    //verificar si se encontro el sonido
    if(sonidoEncontrado){
        return true;

    }else{
        return false;

    }

}

//funcion para buscar la cancion
function buscarCancion(letraAn){
    const canciones = [cancion1, cancion2, cancion3];

    //iterar sobre canciones para encontrar la posicion de la palabra
    for(let i=0 ; i< canciones.length; i++){
        const letraCan = canciones[i];
        const indice = letraCan.indexOf(letraAn);

        //verificar que la encuentre
        if(indice !== -1){
            if(indice < letraCan.length-1){
                const cantarCan = letraCan.slice(indice + 1);
                cancionCont(cantarCan);
            }else{
                Swal.fire({
                    title: "Informativo" ,
                    text: `La letra "${letraAn}" es el final de la canción`, 
                    icon: "Info",
                    confirmButtonText: "Ok",
                    allowOutsideClick:false //evita que de clic afuera para salir
                });
                return false;

            }
        }

    }
}


//funcion para que el navegador continue la cancion
function cancionCont(canto){
    //Crear la instancia
    const hablar = new SpeechSynthesisUtterance(canto);
    hablar.lang ="es-Es";
    speechSynthesis.speak(hablar);

}


//Se realiza uso del boton hablar
$(document).ready(function(){
    //btnHablar
    $('#btnHablar').click(function(event){
        //evite que el form se envie
        event.preventDefault();
        //Validar que la Api sea compatible con el navegador
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            //Crear instancia de reconocimiento de voz
            const reconocimientoVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
            const reconocerVoz = new reconocimientoVoz();

            //configurar la instancia
            reconocerVoz.lang = "es-Es";
            reconocerVoz.interimResults = false;
            reconocerVoz.maxAlternatives = 1;

            //Iniciar grabaciom
            reconocerVoz.start();
            //mostrar texto
            $("#alertarVoz").text("Escuchando....");

            //Procesar el resultado
            reconocerVoz.onresult = function(event){
                //Obtener el texto reconocido
                const sonidoObt = event.results[0][0].transcript.toLowerCase();
            
                //Validar que l sonido escuhado sea parte de los animales del lago
                if (buscarSonido(sonidoObt)){
                    $("#alertarVoz").text(`Sonido escuchado: "${sonidoObt}"`);
                    
                    // Eliminar el punto (y otros caracteres si es necesario) al final del sonido
                    const sonidoLimpiado = sonidoObt.endsWith('.') ? sonidoObt.slice(0, -1) : sonidoObt;
                    buscarCancion(sonidoLimpiado);

                }else{
                    Swal.fire({
                        title: "Error" ,
                        text: `El sonido "${sonidoObt}" no pertenece al lago musical`, 
                        icon: "error",
                        confirmButtonText: "Ok",
                        allowOutsideClick:false //evita que de clic afuera para salir
                    });
                    $("#alertarVoz").text("");
                    return false;
                }
                //$("#alertarVoz").text(`Sonido escuchado: "${sonidoObt}"`);
            }

            //En caso de error
            reconocerVoz.onerror = function(event){
                $("#alertarVoz").text(`Error: "${event.onerror}"`);
            }

            
        }
         else {
            Swal.fire({
                title: "Error" ,
                text: "El navegador no es compatible con la API de reconocimiento de voz", 
                icon: "error",
                confirmButtonText: "Ok",
                allowOutsideClick:false //evita que de clic afuera para salir
            });
            return false;
        }



    });

});