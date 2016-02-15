var _mainWin, _interAppMessageField, apps = [], winId = 0;
//They were all 5.44.9.2. And before they were 4.40.2.0. We only have one openfin app and we spawn other apps from it.

document.addEventListener("DOMContentLoaded", function(){
    init();
});
//------

function init(){
    try{
        fin.desktop.main(function(){
            initWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

function initWithOpenFin(){
    // NB it is 'Window' not 'Application' that the EventListener is being attached to
    _mainWin = fin.desktop.Window.getCurrent();

    fin.desktop.System.getVersion(function (version) {
        try{
            document.querySelector('#of-version').innerText = "OpenFin version "+version;
        }catch(err){
            //---
        }
    });
    initRezizing();
    initInterApp();
    document.querySelector("#new-btt").addEventListener('click', function(e){
        initNewApp("APP_"+winId).then(function(value){
            winId++;
            apps.push(value);
        });
    });

    document.querySelector("#min-btt").addEventListener('click', function(e){
        minAll()
    });

    document.querySelector("#max-btt").addEventListener('click', function(e){
        maxAll();
    });

    _mainWin.addEventListener('close-requested', function(e) {
        var challenge = confirm('Closing this app will close all child apps.');
        if (challenge == true) {
            terminateAllApps();
            _mainWin.close(true);
        }else{
            console.log("The confirm was false")
        }
    });

/*
//create an new app
    initNewApp("BGCIROVolumeMatch").then(function(value){
        var _childWin = value.getWindow()
        _childWin.addEventListener('close-requested', function(e){
            console.log("close requested, but blocked. Close me from the main app.");
            _childWin.minimize();
        });
        apps.push(value);
    });
// and a second - for good measure...
    initNewApp("BGCIROVolumeMatch2").then(function(value){
        var _childWin2 = value.getWindow()
        _childWin2.addEventListener('close-requested', function(e){
            console.log("close requested, but blocked. Close me from the main app.");
            _childWin2.minimize();
        });
        apps.push(value);
    });

    // and a third - for even better measure...
    initNewApp("BGCIROVolumeMatch3").then(function(value){
        var _childWin3 = value.getWindow()
        _childWin3.addEventListener('close-requested', function(e){
            console.log("close requested, but blocked. Close me from the main app.");
            _childWin3.minimize();
        });
        apps.push(value);
    });
    */
}


function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

function terminateAllApps(){
    for(var app in apps ){
        apps[app].close();
    }
}

function initInterApp(){
    console.log("Init with interapp called");
    _interAppMessageField = document.querySelector("#inter-app-message")
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });

    fin.desktop.InterApplicationBus.subscribe("*",
        "universal-message",
        function (message, uuid) {
            var _message = "The application " + uuid + " send this message " + message;
            _interAppMessageField.innerHTML = message.text + message.num;
            console.log(_message);
        });
};

function initRezizing(){
    _mainWin.addEventListener("bounds-changed", function (event) {
        console.log("The window has been moved or resized ", event);
        fin.desktop.InterApplicationBus.publish("bounds-changed-event", {
            bounds: event
        });
    }, function () {
        console.log("The registration was successful");
    },function (reason) {
        console.log("failure:" + reason);
    });
}

function minAll(){
    for(var app in apps ){
        apps[app].getWindow().minimize();
    }
}

function maxAll(){
    for(var app in apps ){
        apps[app].getWindow().restore();
    }
}


function initNewApp(uuid){
    return new Promise(function(resolve, reject){
        var SpawnedApplication = new fin.desktop.Application({
            name: "A New OpenFinApp",
            uuid: uuid,
            url: "http://localhost:9097/child.html",
            mainWindowOptions: {
                name: "OpenFin Application",
                autoShow: true,
                defaultCentered: false,
                alwaysOnTop: false,
                saveWindowState: true,
                icon: "favicon.ico"
            }
        }, function () {
            // Ensure the spawned application are closed when the main application is closed.
            console.log("running");
            SpawnedApplication.run();
            resolve(SpawnedApplication)
        });
    })

}
