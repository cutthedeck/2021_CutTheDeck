$(function() {
  
  if (window.localStorage.getItem('user')) {
    $(" .chat-container").fadeToggle("slow");
  } else {
    socket.emit('changeName');
  }
  //.draggable();

  // function for showing rules of a game
  $(" .fade").click(function(){

      $(" #boxed").fadeToggle("slow");
  });

  //Display Chat inside a game
  $(" .fade_chat").click(function(){

    if(!window.localStorage.getItem('user')){
      var user = prompt("Please enter your user name");

      if (user) {

        window.localStorage.setItem('user', user);
        socket.emit('changeName');
        username = window.localStorage.getItem('user');
        socket.emit('joinRoom', {username: username, room:room});
        $(" .chat-container").fadeToggle("slow");

        return false;


      }
      else{
        alert("Must enter a user name before using the chat");
    }

  } else{
    $(" .chat-container").fadeToggle("slow");
  }
  });

  //changing the user name
  $(" .userName").click(function(){
    window.localStorage.removeItem('user');
    var user = prompt("Please enter your user name");
    user.replace(/(<([^>]+)>)/gi, "");
    window.localStorage.setItem('user', user);

    socket.emit('changeName');
    username = window.localStorage.getItem('user');
    socket.emit('joinRoom', {username: username, room:room});
return false;
  });

  // function for showing options of a game
  $(" .fade-options").click(function(){
    $(" #options").fadeToggle("slow");  
  });
  $("#change-card-back").click(function(){
    $("#navHome").css("display", "none");
    $("#overlay").removeClass("hide");
    $("#overlay").addClass("display");
  });

  $("#back-btn").click(function(){
    $("#overlay").removeClass("display");
    $("#overlay").addClass("hide");
    $("#navHome").css("display", "block");
    if($("#options").css('display') == "block") {
      $("#options").css("display", "none");
    }
  });


  $(function() {
    $("input[type=\"radio\"]").click(function(){
        localStorage.setItem("card-back", this.value);
    });
  });

});
