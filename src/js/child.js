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
    initListeners();
};

function initListeners(){
    var _offset = Math.ceil(Math.random()*800);

    fin.desktop.InterApplicationBus.subscribe("*",
        "bounds-changed-event",
        function (message, uuid) {
            console.log("BOUNDS CHANGED --- ");
            console.log(message.bounds.width);
            _childApp.setBounds(_offset,_offset, message.bounds.width, message.bounds.height)

        });

}

function publishMessage(){
    var _random = Math.random()*300;
    console.log("_random ",_random)
  fin.desktop.InterApplicationBus.publish("universal-message", {
    num: _random,
    text: "The random number is: "
  });
}

