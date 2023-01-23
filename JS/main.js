$(document).ready(function() {

    $(".contenedor").on("click", function() {
        $(".fase:visible").fadeOut("slow", function() {
            if ($(this).hasClass("tiempo")) {
                $(".fase").first().fadeIn();
            } else {
                $(this).next().fadeIn();
            }
        });
    });
})