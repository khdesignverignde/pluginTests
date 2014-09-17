/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        $('#input .save').on('click', this.input.save);
        $('#input .load').on('click', this.input.load);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        //muss in device ready
        window.addEventListener('pause', this.onpause, false);
        window.addEventListener('backbutton', this.onbackbutton, false);
        window.addEventListener('menubutton', this.onmenubutton, false);
        window.addEventListener('batterystatus', this.batterystatus, false);

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
                str += i + ': ' + obj[i] + '<br>';
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
    onbackbutton: function(){
        console.log('backbutton');
        alert('you sure?');
    },
    onmenubutton: function(){
        console.log('menu');
        app.output.string('menu');
    }
};
