      $(function() {

        var dialogOpened = false;
        $(".dialog").css('z-index', -1);

        $("a").each(function(i) {
          var id = 'menu-selected-' + i;
          $("#menu-selected").clone().attr('id', id).appendTo($(this).parent());
          $(this).data('sound', id);
        }).mouseenter(function() {
          var sound = $("#" +  $(this).data('sound'))[0];
          $("a").each(function(i) {
            $(this).removeClass('selected');
          });
          $(this).toggleClass('selected');
          sound.pause();
          sound.play();
        });

        $(document).keydown(function(e) {
          console.log(e.keyCode)
            $(".content .menu .menu-item a").each(function(i) {
              if($(this).hasClass('selected')) {
                var selected = $(this);
                if(e.keyCode == 13) { // enter
                  if(dialogOpened) {
                    $( "#join2" ).trigger('click');
                  } else {
                    selected.trigger('click');
                    selected[0].click();
                  }
                } else if(e.keyCode == 38 && i > 0) { //up
                  var next = $( ".content .menu .menu-item a:eq(" + (i - 1) + ")" );
                  selected.removeClass('selected');
                  next.addClass('selected');
                  $("#" +  next.data('sound'))[0].play();
                } else if(e.keyCode == 40 && i < 2) { //down
                  var next = $( ".content .menu .menu-item a:eq(" + (i + 1) + ")" );
                  selected.removeClass('selected');
                  next.addClass('selected');
                  $("#" +  next.data('sound'))[0].play();
                } else if(e.keyCode == 27) { //down
                  $(".dialog").css('z-index', -1);
                  dialogOpened = false;
                }
                return false;
              }
            });
        });

        $( "#join" ).click(function() {
          $(".dialog").css('z-index', 10);
          dialogOpened = true;
        });

        $( "#join2" ).click(function() {
          document.location = 'controller/' + $( "#room" ).val();
        });
      });