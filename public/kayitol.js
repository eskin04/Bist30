$(document).ready(function(){
    $(".veen .rgstr-btn button").click(function(){
        $('.veen .wrapper').addClass('move');
        $('.body').css('background','#1a1c1e');
        $(".veen .login-btn button").removeClass('active');
        $(this).addClass('active');

    });
    $(".veen .login-btn button").click(function(){
        $('.veen .wrapper').removeClass('move');
        $('.body').css('background','#6F4E37');
        $(".veen .rgstr-btn button").removeClass('active');
        $(this).addClass('active');
    });
});