var _childApp, _messageButton;

document.addEventListener("DOMContentLoaded", function(){
  initChild();
});

function initChild(){

  fin.desktop.main(function(){
      initChildWithOpenFin();
  })
}

initChildWithOpenFin = function(){
  _childApp = fin.desktop.Window.getCurrent();
  _childApp.show();
  _messageButton = document.querySelector("#post-interapp").addEventListener('click', function(){
      publishMessage();
  });

};

function publishMessage(){
    var _random = Math.random()*300;
    console.log("_random ",_random)
  fin.desktop.InterApplicationBus.publish("universal-message", {
    num: _random,
    text: "The random number is: "
  });
}

