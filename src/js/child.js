var _childApp, _messageButton, _sendButton;

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

    _sendButton = document.querySelector("#post-many-interapp").addEventListener('click', function(){
        publishMany();
    });

    _sendButton = document.querySelector("#send-interapp").addEventListener('click', function(){
        sendMessage();
    });


    _sendButton = document.querySelector("#send-bad-interapp").addEventListener('click', function(){
        sendBadMessage();
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


/*

An error occured: {"msg":{"action":"send-message","payload":{"destinationUuid":"cortexdesktoplauncher","destinationWindowName":"favouriting-app","directMsg":true,"sourceWindowName":"allAppsWindow","topic":{"AppKey":"RN","ApplicationIcon":null,"AssetClasses":["FX"],"CategoryName":"Services","Description":"RN","DisplayOrder":0,"EnableViaSailpoint":false,"FavoriteAppOrder":0,"Id":551,"InternalUri":"\\RiskNavigator\\RiskUI.exe","IsFavorite":true,"IsNewApp":false,"IsSuggested":false,"LongName":"Risk Navigator","MarketingUri":"http://risknavigator.staging.echonet/risk/static/","MaxNumberOfInstances":1,"ShortDescription":"RN","ShortName":"RN","category":"Services","longName":"Risk Navigator","shortName":"RN"}},"sourceId":16390},"reason":"No subscribed connections.","success":false}

*/

function publishMany(num){
    var _count = 0;

var _int = setInterval(function(){
    _count ++;
    if(_count < 1000){
        publishMessage()
    }else{
        clearInterval(_int);
    }
}, 1)

}

function sendBadMessage(){
    var _random = Math.random()*300;

    var successCallback = function(e) {
        console.log("SUCCESSFULLY SENT ")
    };

    var errorCallback = function(e) {
        console.log("ERROR MESSAGE ", e)
    };

    fin.desktop.InterApplicationBus.send('OpenFin_appseed', null, 'universal-message', {
        num: _random,
        text: "The random number is: "
    },successCallback, errorCallback);
}


function sendMessage(){
    var _random = Math.random()*300;

    var successCallback = function(e) {
        console.log("SUCCESSFULLY SENT ")
    };

    var errorCallback = function(e) {
        console.log("ERROR MESSAGE ", e)
    };

    fin.desktop.InterApplicationBus.send('interapp-events-test', null, 'universal-message', {
        num: _random,
        text: "The random number is: "
    },successCallback, errorCallback);
}




function publishMessage(){
    var _random = Math.random()*300;
  fin.desktop.InterApplicationBus.publish("universal-message", {
    "num": _random,
    "text": "The random number is: ",
    "AppKey":"RN",
    "ApplicationIcon":null,
    "AssetClasses":["FX"],
    "CategoryName":"Services",
    "Description":"RN",
    "DisplayOrder":0,
    "EnableViaSailpoint":false,
    "FavoriteAppOrder":0,
    "Id":551,
    "InternalUri":"\\RiskNavigator\\RiskUI.exe",
    "IsFavorite":true,
    "IsNewApp":false,
    "IsSuggested":false,
    "LongName":"Risk Navigator",
    "MarketingUri":"http://risknavigator.staging.echonet/risk/static/",
    "MaxNumberOfInstances":1,
    "ShortDescription":"RN",
    "ShortName":"RN",
    "category":"Services",
    "longName":"Risk Navigator",
    "shortName":"RN"
  });
}
