import relacion from './trabajo_epp.json' assert { type : "json"};

function textoAOracion(oracion) {
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
                $(".botones").animate({opacity:1});
            } else {
                $(".botones").animate({opacity:0});
            }
        });
    });

    $(".borrar").click(function() {
        $(".nombre .entrada").text("");
        $(".botones").animate({opacity:0});
    });
    
    $(".aceptar").click(function() {
        var nombre = textoAOracion($(".nombre .entrada").text().trim());
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

    $(".siguiente").click(function() {siguienteFase();});

    $(".areas .opcion").click(function() {
        var area = $(this).text();
        console.log(area);
        siguienteFase();
    });

    $(".trabajos .opcion").click(function() {
        var trabajo = $(this).text();
        console.log(trabajo);
        $(".trabajo").fadeOut("slow", function(){
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
        siguienteFase();
    })
})