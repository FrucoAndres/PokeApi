var artyom = new Artyom();
var artyomInitialized = false;

function limpiarCajaTexto() {
    document.getElementById("txt-buscar").value = "";
}

// Esta función se ejecuta cuando se hace clic en el botón de activación de voz
document.querySelector("#btn-activarVoz").addEventListener('click', function () {
    if (!artyomInitialized) {
        artyom.initialize({
            lang: "es-ES",
            debug: true,
            listen: true,
            continuous: true,
            speed: 0.9,
            mode: "normal"
        });

        artyomInitialized = true;
    }

    artyom.say("busqueda por voz activada");
});

$(document).ready(function() {
    $('#btn-buscar').click(function() {
        var searchTerm = $('#txt-buscar').val();
        if (searchTerm.trim() === '') {
            alert('Por favor ingresa un término de búsqueda');
        } else {
            buscarPokemon();
            limpiarCajaTexto();
        }
    }
    )

});

function buscarPokemon() {

    var searchTerm = $("#txt-buscar").val().toLowerCase(); // Obtener el valor del input
    console.log("Valor del input:", searchTerm); // Imprimir el valor del input en la consola

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + searchTerm,
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            console.log(data.sprites.other.home.front_default);
            $("#img3").html(`<img src="${data.sprites.other.home.front_default}">`);
            console.log(data.stats[0].base_stat);
            limpiarCajaTexto();
        },
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                alert("¡El Pokémon no fue encontrado!");
            } else {
                alert("Ha ocurrido un error: " + error);
            }
        }
    });
    

    mostrarInformacionPokemon(searchTerm);


}

artyom.addCommands({
    indexes: ["Hola.", "adiós.", "buscar *", "comando"],
    smart: true,
    action: function (i, recognized) {
        if (i == 0) {
            artyom.say("saludo");
        } else if (i == 1) {
            artyom.say("chao");
        } else if (i == 2) {
            if (recognized !== undefined) {
                palabras = recognized.split(" ");
                var ultimaPalabra = palabras[palabras.length - 1];
                var searchTerm = ultimaPalabra.toLowerCase().replace(/\./g, ''); // Convertir a minúsculas y quitar puntos
                console.log("Pokemon: ", searchTerm);
                $("#txt-buscar").val(searchTerm);
                buscarPokemon();
                limpiarCajaTexto();
            } else {
                console.log("No se detectó un nombre de Pokémon.");
            }
        } else if (i == 3) {
            console.log("recibido");
        }
    }
});

function mostrarInformacionPokemon(searchTerm) {

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + searchTerm,
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            console.log(data.sprites.other.home.front_default);
            $("#img3").html(`<img src="${data.sprites.other.home.front_default}">`);
            console.log(data.stats[0].base_stat);
            var habilidades = new Array(data.abilities.length);

            for (var i = 0; i < data.abilities.length; i++) {
                habilidades.push(data.abilities[i].ability.name);
            }

            // Editar el apartado de habilidades
            var habilidadesHTML = "<p>";
            habilidades.forEach(function (habilidad) {
                habilidadesHTML += "<p>" + habilidad + "</p>";
            });
            habilidadesHTML += "</p>";

            document.getElementById("habilidades").innerHTML = habilidadesHTML;


            var habilidades = new Array(data.abilities.length);
            var estadisticas = [
                { nombre: "HP", valor: data.stats[0].base_stat },
                { nombre: "Ataque", valor: data.stats[1].base_stat },
                { nombre: "Defensa", valor: data.stats[2].base_stat },
                { nombre: "Ataque especial", valor: data.stats[3].base_stat },
                { nombre: "Defensa especial", valor: data.stats[4].base_stat },
                { nombre: "Velocidad", valor: data.stats[5].base_stat }
            ];
            // Editar el apartado de estadísticas
            var estadisticasHTML = "<p>";
            estadisticas.forEach(function (stat) {
                estadisticasHTML += "<p>" + stat.nombre + ": <span class='" + getColorClass(stat.valor) + "'>" + stat.valor + "</span></p>";
            });
            estadisticasHTML += "</p>";
            document.getElementById("estadisticas").innerHTML = estadisticasHTML;

            $("#img1").html(`<img src="https://cdn.dribbble.com/users/521912/screenshots/14003796/media/94a2502f4e4d577395fec0e60e8372c2.gif"alt="Imagen 1" id="imagen1">`);
            $("#img2").html(`<img src="https://i.pinimg.com/originals/8a/4a/72/8a4a7213b43f4ec4f99db406be655f9e.gif" alt="Imagen 2" id="imagen2">`);

            alternarImagen("imagen1", [
                "" + data.sprites.back_default + "",
                "" + data.sprites.front_default + ""
            ]);

            alternarImagen("imagen2", [
                "" + data.sprites.back_shiny_female + "",
                "" + data.sprites.front_shiny_female + ""
            ]);
        }
    });


};

// Función para determinar la clase de color basada en el valor de la estadística
function getColorClass(valor) {
    if (valor <= 40) {
        return "malo";
    } else if (valor <= 70) {
        return "regular";
    } else {
        return "bueno";
    }
};

function alternarImagen(idImagen, nuevasImagenes) {
    var imagen = document.getElementById(idImagen);
    console.log(imagen); // Agrega esta línea
    if (imagen) {
        var indice = 0;
        setInterval(function() {
            if (nuevasImagenes[indice]) {
                imagen.src = nuevasImagenes[indice];
            }
            indice = (indice + 1) % nuevasImagenes.length; // Avanza al siguiente índice circularmente
        }, 1500); // Cambiar imagen cada 1.5 segundos (1500 milisegundos)
        
        // Verificar si la imagen se ha cargado correctamente
        imagen.onerror = function() {
            console.error("Error al cargar la imagen.");
            // Si la imagen no se carga, establecer la imagen de respaldo
            imagen.src ="https://th.bing.com/th/id/R.1dbba2ef016e9771aba049a4849b06f5?rik=DfATQ28Uj24olA&pid=ImgRaw&r=0";

        };
    } else {
        console.error("La imagen con el ID especificado no se encontró.");
    }
};



