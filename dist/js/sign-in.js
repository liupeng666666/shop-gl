$('.form-control').on('focus', function () {
    $(this).parent('.input-group').addClass('focused');
});

$('.form-control').on('blur', function () {
    $(this).parent('.input-group').removeClass('focused');
});
	

