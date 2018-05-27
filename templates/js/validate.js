$(document).ready(function() {
    var validate = {
        'user_nickname': function() {
            $('.alert_nickname').append('<small class="text-danger" id="name_validate"></small>');
            var but_success = $('.but_succes_nickname');
            var nickValidate = $('#name_validate');
            var input_nickname = $('#nickname_s');
            if (input_nickname.val().length < 2) {
                validate.errors = true;
                nickValidate.html('More than 2 characters').show();
                but_success.hide();
                input_nickname.removeClass('border border-success').addClass('border border-danger');
            } else {
                nickValidate.hide();
                but_success.show();
                input_nickname.removeClass('border border-danger').addClass('border border-success');
            }
        },
        'user_email': function() {
            $('.alert_email').append('<small class="text-danger" id="email_validate"></small>');
            var but_success = $('.but_succes_email');
            var emailValidate = $('#email_validate');
            var input_email = $('#email');
            var patt = /^.+@.+[.].{2,}$/i;
            if (!patt.test(input_email.val())) {
                validate.errors = true;
                emailValidate.html('Incorrect email').show();
                but_success.hide();
                input_email.removeClass('border border-success').addClass('border border-danger');
            } else {
                emailValidate.hide();
                but_success.show();
                input_email.removeClass('border border-danger').addClass('border border-success');
            }
        },
        'user_password': function() {
            $('.alert_password').append('<small class="text-danger" id="password_validate"></small>');
            var but_success = $('.but_succes_password');
            var passwordValidate = $('#password_validate');
            var input_password = $('#password_s');
            if (input_password.val().length < 6) {
                validate.errors = true;
                passwordValidate.html('More than 6 characters').show();
                but_success.hide();
                input_password.removeClass('border border-success').addClass('border border-danger');
            } else {
                passwordValidate.hide();
                but_success.show();
                input_password.removeClass('border border-danger').addClass('border border-success');
            }
        }
    };
    $('#nickname_s').change(validate.user_nickname);
    $('#email').change(validate.user_email);
    $('#password_s').change(validate.user_password);
});