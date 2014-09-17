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

        console.log('Received Event: ' + id);
    },
    output: {
        _el: $('#output'),
        objectProperties: function(obj, name){
            if(!name) name = 'object';
            
            var str = '<br><br>' + name + ':<br>---------------------------------------------------------<br>';
            
            for(var i in obj){
                str += i + ': ' + obj[i] + '<br>';
            }
            
            this._el.html(str + this._el.html());
        },
        string: function(str){
            str += '<br><br>string:<br>---------------------------------------------------------<br>';
            this._el.html(str + this._el.html());
        }
    },
    storage: function(name, method, obj){
        if(!method) method = 'save';
        
        var storage = window.localStorage;
        
        switch(method){
            case 'show':
                app.output
                break;
            case 'remove':
                storage.removeItem(name);
                return true;
                break;
            case 'load':
                var item = storage.getItem(name);
                
                if(item){
                    return item;
                } else {
                    return false;
                }
                break;
            default:
            case 'save':
//                var exists = false;
//                if(storage.getItem(name)) exists = true;
                
                storage.setItem(name, obj);
        }
        
    },
    input:{
        _el: $('#input textarea'),
        load: function(){
            
        },
        save: function(){
            var val = this._el.val();
            
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

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
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
                alert('Failed because: ' + message);
            },
            //options
            { 
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL 
            }
        );
    },
    device: function(){
        app.output.objectProperties(device);
    },
    networkInformation: function(){
        app.output.objectProperties(navigator.connection);
    }
};
