var Horus = require("./index.js");
var horus = new Horus("http://localhost:9007");

//Set links to watch
horus.set([
    "https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal",
    "https://pt.wikipedia.org/wiki/Brasil"
], function(err){
    if(err)
        console.log(err);
    else
        console.log("Set OK");
});

//Get link status
horus.get("https://pt.wikipedia.org/wiki/Brasil", function(err, info){
    if(err)
        console.log(err);
    else
        console.log(info);
});

//Delete link
horus.delete("https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal", function(err){
    if(err)
        console.log(err);
});