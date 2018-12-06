$(document).ready(function() {
  $('.section-select').on('click', function (event) {
    event.preventDefault();
    var a = $(this).attr('href');
    $.ajax({
      url: a,
      type: 'get'
    })
    .done(function(data) {
      console.log(data);
      $('.form-control.bg-dark.border-0').empty();
      $('.text-primary.text-center.section-title').text(data.name);
      $('.task-list').empty();
      if (data.task.length !=0) {
        $('.section-form')
          .attr('action', a);
        data.task.forEach(element => {
          var id = element._id;
          var list = $('.task-list');
          var li = $('<li/>')
          .addClass('list-group-item bg-dark task-item')
          .css('word-wrap', 'break-word')
          .text(element.body)
          .appendTo(list);
          var dv = $('<div/>')
            .addClass('material-switch pull-right')
            .appendTo(li);
          $('<input/>')
            .attr('name', 'tasks[]')
            .attr('type', 'checkbox')
            .attr('id', id)
            .prop('checked', element.status?true:false)
            .appendTo(dv);
          $('<label/>')
            .addClass('label-success mr-1')
            .attr('for', id)
            .appendTo(dv);
          });
          $('<button/>').addClass('btn btn-primary task-submit-button').text('Готово').on('click', function(event) {
            event.preventDefault();
            var list = $('.list-group-item.bg-dark.task-item');
            var daTa = [];
            list.children().each(function() {
              daTa.push({id: $(this).find('input').attr('id'), body: $(this).parent().text(), status: $(this).find('input').is(':checked')?true:false});
            });
            $.ajax({
              type: 'put',
              url: $('.section-form').attr('action'),
              dataType: 'json',
              data: {'tasks': JSON.stringify(daTa)}
            });
            //$.post($('.section-form').attr('action'), {tasks: daTa});
          }).appendTo($('.form-control.bg-dark.border-0'));
        }
    });
  });
    //$.post($('.section-form').attr('action'), {tasks: daTa});
  
  // $('.delete-task').on('click', function(event) {
  //   console.log(event.target);
  //   $(event.target).parent().remove();
  // })
});