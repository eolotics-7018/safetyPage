import relacion from './trabajo_epp.json' assert { type : "json"};

function textoANombre(oracion) {

    let palabras = oracion.toLowerCase().split(" ").map(palabra => {
        return palabra[0].toUpperCase() + palabra.slice(1);
    })
    return palabras.join(" ");
}

function siguienteFase(funcionExtra, funcionCadena) {
    funcionExtra = funcionExtra || function() {};
    funcionCadena = funcionCadena || function() {};

    $(".fase:visible").fadeOut("slow", function(){
        funcionExtra();
        $(this).next().fadeIn("slow", funcionCadena);
    });
}

$(document).ready(function() {

    const respuestas = {
        nombre: "",
        area: "",
        trabajo: "",
        lugar: "",
        duracion: ":",
        inicio: ":",
        fin: ":"
    };

    $(".contenedor").fadeIn(800, function() {
        $(".nombre .entrada").focus().keydown(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".nombre .aceptar").click();
            }
        }).keyup(function() {
            if ($(this).text().trim() != "") {
                if ($(".botones > button").hasClass("desactivado")) {
                    $(".botones > button").removeClass("desactivado");
                    $(".botones").animate({opacity:1});
                }
            } else {
                $(".botones").animate({opacity:0}, function() {$(".botones > button").addClass("desactivado")});
            }
        });
    });

    $(".borrar").click(function() {
        $(".nombre .entrada").text("").focus();
        $(".botones").animate({opacity:0}, function() {$(".botones > button").addClass("desactivado")});
    });
    
    $(".nombre .aceptar").click(function() {
        var nombre = textoANombre($(".nombre .entrada").text().trim());
        respuestas.nombre = nombre;
        console.log(nombre);

        siguienteFase(function(){$(".atras").fadeIn("slow")});
    });

    $(".atras").click(function() {
        if ($(".fase:visible").fadeOut("slow", function(){
            $(this).prev().fadeIn();
        }).prev().hasClass("nombre")) {
            $(".atras").fadeOut();
        }
    });

    $(".siguiente").click(function() {siguienteFase()});

    $(".opcion").mousedown(function(){
        $(this).addClass("seleccion");
    });

    onmouseup = function() {
        $(".opcion").removeClass("seleccion");
    };

    $(".areas .opcion").click(function() {
        var area = $(this).text();
        respuestas.area = area;
        console.log(area);
        siguienteFase();
    });

    $(".trabajos .opcion").click(function() {
        var trabajo = $(this).text();
        respuestas.trabajo = trabajo;
        console.log(trabajo);
        $(".trabajo").fadeOut("slow", function(){
            $(".epp .caja").hide();
            relacion.trabajos.forEach(elemento => {
                if (elemento.nombre == trabajo) {
                    console.log(elemento.epp);
                    elemento.epp.forEach(epp => {
                        $(".caja:has(.imagen[alt="+epp+"])").show();
                    });
                    return;
                }
            });
            $(".equipo").fadeIn("slow");
        });
    });

    $(".lugares .opcion").click(function() {
        var lugar = $(this).text();
        respuestas.lugar = lugar;
        console.log(lugar);
        siguienteFase(function() {}, function() {$("#horas").focus()});
    });

    $(".tiempos .entrada").on("change keyup", function() {
        if ($("#horas").val() == 0 && $("#minutos").val() == 0) {
            $(".tiempo .siguiente").addClass("desactivado").animate({opacity: 0});
        } else {
            $(".tiempo .siguiente").removeClass("desactivado").animate({opacity:1});
        }
    }).focus(function(){
        this.select();
    });

    $(".tiempo .siguiente").click(function() {
        let horas = parseInt($("#horas").val()), minutos = parseInt($("#minutos").val());

        respuestas.duracion = horas + ":" + minutos;
        console.log(respuestas.duracion);
        
        let ahora = new Date();
        respuestas.inicio = ahora.toLocaleDateString() + " - " + ahora.toLocaleTimeString();
        console.log(respuestas.inicio);
        
        ahora.setMinutes(ahora.getMinutes() + minutos);
        ahora.setHours(ahora.getHours() + horas);
        respuestas.fin = ahora.toLocaleDateString() + " - " + ahora.toLocaleTimeString();
        console.log(respuestas.fin);
    });

    $("#horas").on("change keyup focus", function() {
        if ($(this).val() > 168) {
            $(this).val("168");
        } else if ($(this).val() < 0) {
            $(this).val("0");
        } else if ($(this).val() == 1) {
            $(this).next().text(" hora con");
        } else {
            $(this).next().text(" horas con");
        }
    });

    $("#minutos").on("change keyup focus", function() {
        if ($(this).val() >= 60) {
            $(this).val("59");
        } else if ($(this).val() < 0) {
            $(this).val("0");
        } else if ($(this).val() == 1) {
            $(this).next().text(" minuto");
        } else {
            $(this).next().text(" minutos");
        }
    }).keydown(function(e) {
        if (e.which == 13) {
            $(".tiempo .siguiente").click();
        }
    });

    $(".final .aceptar").click(function() {
        // console.log(respuestas);
        // console.log(JSON.stringify(respuestas));
        console.log($.param(respuestas));
        $("#php").attr("src", "https://sitiofandom.000webhostapp.com/php/almacena.php?" + $.param(respuestas));
    });
});

window.addEventListener('message', event => {
    // Comprobamos si el mensaje viene de el sitio que queremos
    if (event.origin.startsWith("https://sitiofandom.000webhostapp.com")) {
        alert(event.data);
    }
});