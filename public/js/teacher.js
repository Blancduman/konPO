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
      $('.section-form')
        .attr('action', a)
        .attr('method', 'post');
      var list = $('.task-list');
      list.empty();
      data.task.forEach(element => {
        var id = Math.floor(Math.random() * 26) + Date.now();
        var li = $('<li/>')
        .addClass('list-group-item bg-dark')
        .css('word-wrap', 'break-word')
        .text(element.body);
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
          .addClass('label-success')
          .attr('for', id)
          .appendTo(dv);
          console.log(li);
      });
    });
  });
  
  $('select[name="duallistbox"]').bootstrapDualListbox({
    nonSelectedListLabel: 'Студенты',
    selectedListLabel: 'Доступ разрешен',
    preserveSelectionOnMove: 'moved',
    moveOnSelect: false,
    infoText: ''
  });

  $('.btn-add-task').on('click', function() {
    if ($('.add-task').val() != '') {
      var id = Math.floor(Math.random() * 26) + Date.now();
      var list =  $('.list-group.text-light.task-list');
      var li = $('<li/>')
          .addClass('list-group-item bg-dark')
          .css('word-wrap', 'break-word')
          .text($('.add-task').val())
          .appendTo(list);
          $('.add-task').val('');

      var dv = $('<div/>')
          .addClass('material-switch pull-right')
          .appendTo(li);
      $('<input/>')
          .attr('name', 'tasks[]')
          .attr('type', 'checkbox')
          .attr('id', id)
          .appendTo(dv);
      $('<label/>')
          .addClass('label-success mr-1')
          .attr('for', id)
          .appendTo(dv);
      $('<button/>')
        .addClass('btn btn-secondary delete-task p-1')
        .text('X')
        .attr('id', id)
        .on('click', function() {
          dv.parent().remove();
        })
        .appendTo(dv);
  }
  });
  // $('.delete-task').on('click', function(event) {
  //   console.log(event.target);
  //   $(event.target).parent().remove();
  // })
});