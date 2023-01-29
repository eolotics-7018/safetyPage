import relacion from './trabajo_epp.json' assert { type : "json"};

function textoANombre(oracion) {
    let palabras = oracion.split(" ").map(palabra => {
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

    // $(".contenedor").on("click", function() {
    //     $(".fase:visible").fadeOut("slow", function() {
    //         if ($(this).hasClass("tiempo")) {
    //             $(".fase").first().fadeIn();
    //         } else {
    //             $(this).next().fadeIn();
    //         }
    //     });
    // });

    $(".contenedor").fadeIn(800, function() {
        $(".nombre .entrada").focus().keydown(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".aceptar").click();
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
    
    $(".aceptar").click(function() {
        var nombre = textoANombre($(".nombre .entrada").text().trim());
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
        console.log(area);
        siguienteFase();
    });

    $(".trabajos .opcion").click(function() {
        var trabajo = $(this).text();
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
        var tiempo = [parseInt($("#horas").val()), parseInt($("#minutos").val())];
        console.log(tiempo);
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
});