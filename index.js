"use strict";

var url = require("url"),
    http = require("http"),
    https = require("https"),
    md5 = require("md5"),
    crc32 = require("crc-32"),
    querystring = require("querystring");

module.exports = function(apiUrl){
    var urlArr = url.parse(apiUrl);
    var protocol = (urlArr.protocol === "http:") ? http : https;
    var port = (urlArr.protocol === "http:") ? 80 : 443;
            
    return {
        /**
         * Function do set links to watch
         * 
         * @param array setArr
         * @param function cb
         * @return void
         */
        set: function(setArr, cb){
            if(typeof setArr === "string")
                var postData = querystring.stringify([setArr]);
            else if(typeof setArr === "object" || typeof setArr === "array")
                var postData = querystring.stringify(setArr);
            
            var options = {
                host: urlArr.hostname,
                path: "/set",
                port: urlArr.port,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
                                    
            var postRequest = protocol.request(options, function(res){
                var result = "";
                
                if(res.statusCode === 200){
                    res.on('error', function(error) {
                        if(typeof cb === "function")
                            cb(error);
                    });
                            
                    res.on('data', function (chunk) {
                        result += chunk;
                    });

                    res.on('end', function (chunk) {
                        if(typeof cb === "function"){
                            var resultObj = JSON.parse(result);
                            var err = (resultObj.status === "error") ? resultObj["msg"] : null;
                            cb(err, resultObj);
                        }    
                    });
                }
                else{
                    if(typeof cb === "function")
                        cb("Request return HTTP "+res.statusCode);
                }
            });
                        
            postRequest.write(postData);
            postRequest.end();
        },
        
        /**
         * Function do get link status
         * 
         * @param string link
         * @param function cb
         * @return void
         */
        get: function(link, cb){
            var options = {
                host: urlArr.hostname,
                port: urlArr.port,
                path: urlArr.path+"?link="+encodeURIComponent(link),
                method: 'GET'
            };
            
            var getRequest = protocol.request(options, function(res){
                var result = "";
                
                if(res.statusCode === 200){
                    res.on('error', function(error) {
                        if(typeof cb === "function")
                            cb(error);
                    });

                    res.on('data', function (chunk) {
                        result += chunk;
                    });

                    res.on('end', function (chunk) {
                        if(typeof cb === "function"){
                            var resultObj = JSON.parse(result);
                            var err = (resultObj.status === "error") ? resultObj["msg"] : null
                            cb(err, resultObj);
                        }                        
                    });
                }
                else{
                    if(typeof cb === "function")
                        cb("Request return HTTP "+res.statusCode);
                }
            });
            
            getRequest.end();
        },
        
        /**
         * Function to remove link to waitch list
         * 
         * @returns {undefined}
         */
        delete: function(link, cb){
            var id = Math.abs(crc32.str(md5(link)));
            
            var options = {
                host: urlArr.hostname,
                port: urlArr.port,
                path: "/delete/"+id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
                                    
            var deleteRequest = protocol.request(options, function(res){
                var result = "";
                
                if(res.statusCode === 200){
                    res.on('error', function(error){
                        if(typeof cb === "function")
                            cb(error);
                    });

                    res.on('data', function(chunk){
                        result += chunk;
                    });

                    res.on('end', function(chunk){
                        if(typeof cb === "function"){
                            var resultObj = JSON.parse(result);
                            var err = (resultObj.status === "error") ? resultObj["msg"] : null
                            cb(err, resultObj);
                        }    
                    });
                }
                else{
                    if(typeof cb === "function")
                        cb("Request return HTTP "+res.statusCode);
                }
            });
            
            deleteRequest.end();
        }
    }
}
