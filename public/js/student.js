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
  $('.dir-up-a').on('click', func);
  // function(event) {
  //   event.preventDefault();
  //   var adr = $(this).attr('href');
  //   //var dirname = $(this).text();
  //   $('.dir').remove();
  //   $('.file').remove();
  //   $.ajax({
  //     url: adr
  //   })
  //   .done(function(data) {
  //     data._dir.forEach(item => {
  //       var _tr = $('<tr/>').addClass('dir').appendTo($('.table-table-table'));
  //       var _td = $('<td/>').appendTo(_tr);
  //       $('<img/>').attr('src', 'http://localhost:3000/images/folder.png')
  //         .attr('alt', 'Папочка').attr('style', 'width: 5%;').appendTo(_td);
  //       $('<a/>').attr('href', adr+'/'+item).attr('role', 'tab').addClass('text-light dir-get').text(item).on('click', func).appendTo(_td);
  //     });
  //     data._file.forEach(item => {
  //       var _tr = $('<tr/>').addClass('file').appendTo($('.table-table-table'));
  //       var _td = $('<td/>').appendTo(_tr);
  //       $('<img/>').attr('src', 'http://localhost:3000/images/file.png')
  //         .attr('alt', 'Файлик').attr('style', 'width: 5%;').appendTo(_td);
  //       $('<a/>').attr('href', adr.replace('folder','file')+'/'+item).attr('role', 'tab').addClass('text-light').text(item).on('click', func).appendTo(_td);
  //     });
  //   });
  // });
  $('.dir-get').on('click', func);
  // function (event) {
  //   event.preventDefault();
  //   var _url = $(this).attr('href').replace('/0/', '/');
  //   //var dirname = $(this).text();
  //   var adr = $(this).attr('href').replace('/0/', '/');
  //   $('.dir').remove();
  //   $('.file').remove();
  //   $.ajax({
  //     url: _url,
  //     method: 'get'
  //   })
  //   .done(function(data) {
  //     data._dir.forEach(item => {
  //       var _tr = $('<tr/>').addClass('dir').appendTo($('.table-table-table'));
  //       var _td = $('<td/>').appendTo(_tr);
  //       $('<img/>').attr('src', 'http://localhost:3000/images/folder.png')
  //         .attr('alt', 'Папочка').attr('style', 'width: 5%;').appendTo(_td);
  //       $('<a/>').attr('href', adr+'/'+item).attr('role', 'tab').addClass('text-light dir-get').text(item).on('click', func).appendTo(_td);
  //     });
  //     data._file.forEach(item => {
  //       var _tr = $('<tr/>').addClass('file').appendTo($('.table-table-table'));
  //       var _td = $('<td/>').appendTo(_tr);
  //       $('<img/>').attr('src', 'http://localhost:3000/images/file.png')
  //         .attr('alt', 'Файлик').attr('style', 'width: 5%;').appendTo(_td);
  //       $('<a/>').attr('href', adr.replace('folder','file')+'/'+item).attr('role', 'tab').addClass('text-light').text(item).on('click', func).appendTo(_td);
  //     });
  //   })
  // })
  function func(event) {
    event.preventDefault();
    var _url = $(this).attr('href').replace('/0/', '/');
    //var dirname = $(this).text();
    var adr = $(this).attr('href').replace('/0/', '/');
    $('.dir').remove();
    $('.file').remove();
    $.ajax({
      url: _url,
      method: 'get'
    })
    .done(function(data) {
      data._dir.forEach(item => {
        var _tr = $('<tr/>').addClass('dir').appendTo($('.table-table-table'));
        var _td = $('<td/>').appendTo(_tr);
        $('<img/>').attr('src', 'http://localhost:3000/images/folder.png')
          .attr('alt', 'Папочка').attr('style', 'width: 5%;').appendTo(_td);
        $('<a/>').attr('href', adr+'/'+item).attr('role', 'tab').addClass('text-light dir-get').text(item).on('click', func).appendTo(_td);
      });
      data._file.forEach(item => {
        var _tr = $('<tr/>').addClass('file').appendTo($('.table-table-table'));
        var _td = $('<td/>').appendTo(_tr);
        $('<img/>').attr('src', 'http://localhost:3000/images/file.png')
          .attr('alt', 'Файлик').attr('style', 'width: 5%;').appendTo(_td);
        $('<a/>').attr('href', adr.replace('folder','file')+'/'+item).attr('role', 'tab').addClass('text-light').text(item).on('click', func).appendTo(_td);
      });
    })
  }
    //$.post($('.section-form').attr('action'), {tasks: daTa});
  
  // $('.delete-task').on('click', function(event) {
  //   console.log(event.target);
  //   $(event.target).parent().remove();
  // })
});