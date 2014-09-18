
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('camera').addEventListener('click', this.camera, false);
        document.getElementById('device').addEventListener('click', this.device, false);
        document.getElementById('network-information').addEventListener('click', this.networkInformation, false);
        document.getElementById('vibration').addEventListener('click', this.vibration, false);
        document.getElementById('geolocation').addEventListener('click', this.geolocation, false);
        document.getElementById('inappbrowser').addEventListener('click', this.inappbrowser, false);
        document.getElementById('notificationAlert').addEventListener('click', this.notificationAlert, false);
        document.getElementById('notificationConfirm').addEventListener('click', this.notificationConfirm, false);
        document.getElementById('notificationPrompt').addEventListener('click', this.notificationPrompt, false);
        document.getElementById('notificationBeep').addEventListener('click', this.notificationBeep, false);
        document.getElementById('showSplashscreen').addEventListener('click', this.showSplashscreen, false);
        document.getElementById('globalization').addEventListener('click', this.globalization, false);
        $('#input .save').on('click', this.input.save);
        $('#input .load').on('click', this.input.load);
        app.file.bindEvents();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.file.onDeviceReady();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        //muss in device ready
        document.addEventListener('pause', this.onpause, false);
        document.addEventListener('resume', this.onresume, false);
        document.addEventListener('backbutton', this.onbackbutton, false);
        document.addEventListener('menubutton', this.onmenubutton, false);
        window.addEventListener('batterystatus', this.batterystatus, false);
        
        var watchIDAcc = navigator.accelerometer.watchAcceleration(this.accelerometerSuccess, this.accelerometerError, { frequency: 1000 });
        
        var watchIDComp = navigator.compass.watchHeading(this.compassSuccess, this.compassError);
        
        console.log('Received Event: ' + id);
        
    },
    output: {
        _el: $('#output'),
        clear: function(){
            this._el.html('');
        },
        objectProperties: function(obj, name){
            if(!name) name = 'object';
            
            var str = name + ':<br>---------------------------------------------------------<br>';
            
            for(var i in obj){
                str += i + ': ' + ((typeof obj[i] !== 'function') ? obj[i] : '(function)')+ '<br>';
            }
            
            str += '<br><br>';
            
            this._el.html(str + this._el.html());
        },
        string: function(s){
            console.log(typeof str);
            var str = 'string:<br>---------------------------------------------------------<br>' + s+ '<br><br>';
            this._el.html(str + this._el.html());
        }
    },
    storage: function(name, method, obj){
        if(!method) method = 'save';
       
        
        switch(method){
            case 'show':
                console.log(window.localStorage);
                break;
            case 'remove':
                window.localStorage.removeItem(name);
                return true;
                break;
            case 'load':
                var item = window.localStorage.getItem(name);
                
                if(item){
                    return item;
                } else {
                    return false;
                }
                break;
            default:
            case 'save':
                var exists = false;
                if(window.localStorage.getItem(name)) exists = true;
                
                window.localStorage.setItem(name, obj);
        }
        
    },
    input:{
        _el: null,
        init: function(){
            this._el = $('#inputTextarea');
        },
        save: function(){
            this._el = $('#inputTextarea');
            var val = this._el.get(0).value;
            app.storage('input', 'save', val);
        },
        load: function(){
            var val = app.storage('input', 'load');
            
            app.output.string(val);
            
        }
    },
    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 

            alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled); 
            
            app.output.objectProperties(result, 'scanner.scan().result)');
            
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            alert("Scanning failed: ", error); 
        } );
    },
    camera: function(){
        navigator.camera.getPicture(
            //success
            function (imageData) {
                var $image = $('#photo');
                $image.attr('src', 'data:image/jpeg;base64,' + imageData);
            }, 
            //fail
            function (message) {
                alert('Camera failed: ' + message);
            },
            //options
            { 
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                correctOrientation: true,
                saveToPhotoAlbum: true
            }
        );
    },
    device: function(){
        app.output.objectProperties(device, 'device');
    },
    networkInformation: function(){
        app.output.objectProperties(navigator.connection, 'navigator.connection');
    },
    vibration: function(){
        navigator.notification.vibrate(1000); 
    },
    geolocation: function(){
        navigator.geolocation.getCurrentPosition(
            function(position){
                
                alert('Latitude: '          + position.coords.latitude          + '\n' +
                      'Longitude: '         + position.coords.longitude         + '\n' +
                      'Altitude: '          + position.coords.altitude          + '\n' +
                      'Accuracy: '          + position.coords.accuracy          + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                      'Heading: '           + position.coords.heading           + '\n' +
                      'Speed: '             + position.coords.speed             + '\n' +
                      'Timestamp: '         + position.timestamp                + '\n');
                app.output.objectProperties(position, 'geolocation');
            },
            function(error){
                app.output.objectProperties(error);
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }
        );
    },
    inappbrowser: function(){
        var ref = window.open('http://google.com', '_blank', 'location=no');
    },
    batterystatus: function(info){
        app.output.objectProperties(info, 'battery-status');
    },
    onpause: function(){
        console.log('pause');
        app.output.string('pause');
    },
    onresume: function(){
        console.log('resume');
        app.output.string('resume');
    },
    onbackbutton: function(){
        console.log('backbutton');
        app.output.string('backbutton');
    },
    onmenubutton: function(){
        console.log('menu');
        app.output.string('menu');
    },
    notificationAlert: function(){
        
        navigator.notification.alert(
            'You will dismiss this',  // message
            function(){
                 app.output.string('alert dismissed');
            },         // callback
            'ALERT',            // title
            'OK'                  // buttonName
        );
    },
    notificationConfirm: function(){
        
        navigator.notification.confirm(
            'Now you have Options', // message
             function(buttonIndex){
                app.output.string('You selected button with index ' + buttonIndex);
             },            // callback to invoke with index of button pressed
            'CONFIRM',           // title
            ['OK','NOT OK', 'Secret Option']     // buttonLabels
        );
    },
    notificationPrompt: function(){
        
        navigator.notification.prompt(
            'Please enter your name',  // message
            function(results){
                app.output.objectProperties(results, 'notificationPrompt - results')
            },                  // callback to invoke
            'PROMPT',            // title
            ['Ok','Exit'],             // buttonLabels
            'default text'                 // defaultText
        );
    },
    notificationBeep: function(){
        navigator.notification.beep(2);
    },
    accelerometerSuccess: function(acceleration){
        var str = 'Acceleration X: ' + acceleration.x + ' | ' +
                'Acceleration Y: ' + acceleration.y + ' | ' +
                'Acceleration Z: ' + acceleration.z + ' | ' +
                'Timestamp: '      + acceleration.timestamp;
        
        $('#acceleration').text(str);
    },
    accelerometerError: function(){
        $('#acceleration').text('error');
    },
    compassSuccess: function(heading){
        var str = 'Heading: ' + heading.magneticHeading;
        $('#orientation').text(str);
        
    },
    compassError: function(){
        $('#orientation').text('error');
    },
    showSplashscreen:function(){
        console.log('showSplashscreen');
        
        navigator.splashscreen.show();
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
        
    },
    globalization: function(){
        navigator.globalization.getPreferredLanguage(
            function (language) {app.output.objectProperties(language, 'getPreferredLanguage');},
            function () {app.output.string('Error getting language');}
        );

        navigator.globalization.getLocaleName(
            function (locale) {app.output.objectProperties(locale, 'getLocaleName');},
            function () {app.output.string('Error getting locale\n');}
        );
        
        navigator.globalization.dateToString(
            new Date(),
            function (date) { app.output.objectProperties(date, 'dateToString'); },
            function () { app.output.string('Error getting dateString\n'); },
            { formatLength: 'short', selector: 'date and time' }
        );

        navigator.globalization.getCurrencyPattern(
            'USD',
            function (pattern) { app.output.objectProperties(pattern, 'getCurrencyPattern USD'); },
            function () { app.output.string('Error getting pattern\n'); }
        );
        navigator.globalization.getCurrencyPattern(
            'EUR',
            function (pattern) { app.output.objectProperties(pattern, 'getCurrencyPattern EUR'); },
            function () { app.output.string('Error getting pattern\n'); }
        );
        navigator.globalization.getCurrencyPattern(
            'JPY',
            function (pattern) { app.output.objectProperties(pattern, 'getCurrencyPattern JPY'); },
            function () { app.output.string('Error getting pattern\n'); }
        );

        navigator.globalization.getDateNames(
            function (names) {
                var str;
                for (var i = 0; i < names.value.length; i++) {
                    str +=  ' / ' + names.value[i];
                }
                
                app.output.string('getDateNames: ' + str);
            },
            function () { app.output.string('Error getting names\n'); },
            { type: 'wide', item: 'months' }
        );
        
        /* ... */
    },
    file:{
        fs: null,
        error: function(e){
            console.log('error' + e);
            app.output.objectProperties(e);
        },
        bindEvents: function(){
            document.getElementById('fileGetFileNull').addEventListener('click', function(){
                app.file.getFile();
            }, false);
            document.getElementById('fileGetFileTest2').addEventListener('click', function(){
                app.file.getFile('//files/test2.txt');
            }, false);
            
        },
        onDeviceReady: function(){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.file.fileSystemReady, app.file.error);//TEMPORARY
        },
        fileSystemReady: function(filesystem){
            app.file.fs = filesystem;
            app.output.string('fileSystemReady');
            app.output.objectProperties(app.file.fs, 'filesystem' );
            app.output.objectProperties(app.file.fs.root, 'filesystem.root' );
            app.output.string('filesystem.root.toURL(): ' + app.file.fs.root.toURL()  );
            
        },
        getFile: function(file){
            console.log('getFile');
            app.output.string(window.appRootDir);
            var options = null;
            if(!file){
                file = "test.txt";
                options ={create:true, exclusive: false};
            }
            app.file.fs.root.getFile(file, options , app.file.gotFileEntry, app.file.error);
        },
        gotFileEntry: function(fileEntry){
            console.log('gotFileEntry');
            app.output.objectProperties(fileEntry, 'fileEntry');
            app.output.string(fileEntry.fullPath);
            fileEntry.file(app.file.gotFile, app.file.error);
        },
        gotFile: function(file){
            console.log('gotFile');
            app.file.readDataUrl(file);
            app.file.readAsText(file);
        },
        readDataUrl: function(file) {
            console.log('readDataUrl');
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                app.output.string("Read as data URL");
                app.output.objectProperties(evt.target.result);
                
            };
            reader.readAsDataURL(file);
        },
        readAsText: function(file) {
            console.log('readAsText');
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                app.output.string("Read as text");
                app.output.objectProperties(evt.target.result);
            };
            reader.readAsText(file);
        }
    }
};
