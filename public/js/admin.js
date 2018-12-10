const ap = 'http://localhost:3000/';
$(document).ready(function() {
    $('.form.admin.edit-teacher').submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'PUT',
            url: $(this).attr('action'),
            data: $(this).serializeArray(),
            dataType: 'json'
        });
        window.location.replace(ap+"admin");
    });
    // jQuery.ajaxSetup({
    //     async: false
    //   });
})