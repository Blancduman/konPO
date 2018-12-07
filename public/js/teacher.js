$(document).ready(function() {
  $('.section-select').on('click', function (event) {
    event.preventDefault();
    var a = $(this).attr('href');
    $.ajax({
      url: a,
      type: 'get'
    })
    .done(function(data) {
      $('.text-primary.text-center.section-title').text(data.name);
      var divdiv = $('.div-add-task');
      $('.form-control.bg-dark.border-0').empty();
      divdiv.empty();
      $('<input/>').addClass('form-control add-task').attr('type', 'text')
      .attr('placeholder', 'Добавить задание...').appendTo(divdiv);
      var ddiv = $('<div/>').addClass('input-group-append').appendTo(divdiv);
      $('<button/>').addClass('btn-add-task btn btn-outline-danger text-primary').text('Добавить').on('click', function() {
        if ($('.add-task').val() != '') {
          var id = Math.floor(Math.random() * 26) + Date.now();
          var val = $('.add-task').val();
          var list =  $('.list-group.text-light.task-list');
          var li = $('<li/>')
              .addClass('list-group-item bg-dark task-item')
              .css('word-wrap', 'break-word')
              .text(val)
              .appendTo(list);
              $('.add-task').val('');
    
          var dv = $('<div/>')
              .addClass('material-switch pull-right')
              .appendTo(li);
          $('<input/>')
              .attr('name', 'tasks['+id+']['+val+']')
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
            .on('click', function() {
              dv.parent().remove();
            })
            .appendTo(dv);
      }
      }).appendTo(ddiv);
      $('.section-form')
        .attr('action', a);
      var list = $('.task-list');
      list.empty();
      data.task.forEach(element => {
        var id = Math.floor(Math.random() * 26) + Date.now();
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
        $('<button/>')
          .addClass('btn btn-secondary delete-task p-1')
          .text('X')
          .on('click', function() {
            dv.parent().remove();
          })
          .appendTo(dv)
        });
        $('<button/>').addClass('btn btn-primary task-submit-button').text('Готово').on('click', function(event) {
          event.preventDefault();
          var list = $('.list-group-item.bg-dark.task-item');
          var daTa = [];
          list.children().each(function() {
            daTa.push({id: $(this).find('input').attr('id'), body: $(this).parent().text().slice(0,-1), status: $(this).find('input').is(':checked')?true:false});
          });
          console.log(daTa);
          console.log(JSON.stringify(daTa));
          $.ajax({
            type: 'POST',
            url: $('.section-form').attr('action'),
            dataType: 'json',
            data: {'tasks': JSON.stringify(daTa)}
          });
          //$.post($('.section-form').attr('action'), {tasks: daTa});
        }).appendTo($('.form-control.bg-dark.border-0'));
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
      var val = $('.add-task').val();
      var list =  $('.list-group.text-light.task-list');
      var li = $('<li/>')
          .addClass('list-group-item bg-dark task-item')
          .css('word-wrap', 'break-word')
          .text(val)
          .appendTo(list);
          $('.add-task').val('');

      var dv = $('<div/>')
          .addClass('material-switch pull-right')
          .appendTo(li);
      $('<input/>')
          .attr('name', 'tasks['+id+']['+val+']')
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
        .on('click', function() {
          dv.parent().remove();
        })
        .appendTo(dv);
  }
  });
  $('.task-submit-button').on('click', function(event) {
    event.preventDefault();
    var list = $('.list-group-item.bg-dark.task-item');
    console.log(list);
    console.log(list.children());
    var daTa = [];
    list.children().each(function() {
      daTa.push({id: $(this).find('input').attr('id'), body: $(this).parent().text(), status: $(this).find('input').is(':checked')?true:false});
    });
    console.log(daTa);
    console.log(JSON.stringify(daTa));
    $.ajax({
      type: 'POST',
      url: $('.section-form').attr('action'),
      dataType: 'json',
      data: {'tasks': JSON.stringify(daTa)}
    });
    //$.post($('.section-form').attr('action'), {tasks: daTa});
  });
  $('.form.teacher.edit-profile').submit(function(event) {
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: $(this).attr('action'),
        data: $(this).serializeArray(),
        dataType: 'json'
    });
    window.location.replace(ap+"student");
  });
  // $('.delete-task').on('click', function(event) {
  //   console.log(event.target);
  //   $(event.target).parent().remove();
  // })
});