'use strict'

const baseURL = 'http://127.0.0.1:5000/';

function initUI() {
    $('#addUser').submit(addUser);
}


function addUser() {
    var formData = {
        'name': $('input[name=name]').val()
    }
    event.preventDefault();
    console.log($(this).serialize());
    $.ajax({headers: {
        'Access-Control-Allow-Origin': '*'
    },
        url: baseURL + 'addUser/',
        type: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        success: (data) => {
            console.log(data);
        }


    });
}



initUI();