$(function() {


  // function for showing rules of a game
  $(" .fade").click(function(){
    $(" #rules").fadeToggle("slow");
  });

  //Display Chat inside a game
  $(" .fade_chat").click(function(){
    if(!window.localStorage.getItem('user')){
    var user = prompt("Please enter your user name");
    if (user) {

      localStorage.setItem('user', user);
      console.log(localStorage.getItem('user'));
      $(" .chat-container").fadeToggle("slow");
    }
    else{
      alert("Must enter a user name before using the chat");
    }

  }else{
    $(" .chat-container").fadeToggle("slow");
  }
  });

  



});
