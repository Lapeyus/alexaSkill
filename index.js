// 1. Skill Code =======================================================================================================
var Alexa = require('alexa-sdk');
var https = require('http');
var http_host = '186.177.153.239';
var host_port = 8080;
var auth = 'osmc:magdalena';

var controls = {        
    back:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"parentdir"},"id":1}',
    channels: '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"plugin.video.youtube","params":["/?subscriptions/list/&quot;,return"]},"id": 1}',
    ContextMenu:'{"jsonrpc":"2.0","method":"Input.ContextMenu","id":1}',
    down:'{"jsonrpc":"2.0","method":"Input.Down","id":1}',
    fast:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"fastforward"},"id":1}',
    favourites:'{"jsonrpc":"2.0","method":"GUI.ActivateWindow","params":{"window":"favourites"},"id":1}',
    fullscreen:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"fullscreen"},"id":1}',
    hi:'{"id":1,"jsonrpc":"2.0","method":"GUI.ShowNotification","params":{"title":"Alexa and kodi say:","message":"Hi there master","image":"info"}}',
    home:'{"jsonrpc":"2.0","method":"GUI.ActivateWindow","params":{"window":"home","id":1}',
    info:'{"jsonrpc":"2.0","method":"Input.Info","id":1}',
    left:'{"jsonrpc":"2.0","method":"Input.Left","id":1}',
    moviesearch: '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"plugin.video.exodus","params":["/?action=movieSearch"]},"id": 1}',
    music: '{"jsonrpc":"2.0","method":"GUI.ActivateWindow","params":{"window":"music"},"id":1}',
    mute:'{"jsonrpc":"2.0","method":"Application.SetMute","params":{"mute":true},"id":1}',
    next:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"skipnext"},"id":1}',
    jump:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"pagedown"},"id":1}',
    pageup:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"pageup"},"id":1}',
    pause:'{"jsonrpc":"2.0","method":"Player.PlayPause","params":{"playerid":1},"id":1}',
    play:'{"jsonrpc":"2.0","method":"Player.PlayPause","params":{"playerid":1},"id":1}',
    previous:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"skipprevious"},"id":1}',
    radio: '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":" plugin.audio.tuneinradio","params":["/?path=tune&amp;id=s13187&amp;name=Radio+Dos+99.5+%28Spanish+Music%29&quot;"]},"id": 1}',
    rewind:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"rewind"},"id":1}',
    right:'{"jsonrpc":"2.0","method":"Input.Right","id":1}',
    scream:'{"jsonrpc":"2.0","method":"Application.SetVolume","params":{"volume":100},"id":1}',
    screenshot:'{"jsonrpc":"2.0","method":"Input.ExecuteAction","params":{"action":"screenshot"},"id":1}',
    select:'{"jsonrpc":"2.0","method":"Input.Select","id":1}',
    series: '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"plugin.video.exodus","params":["/?action=calendar&amp;url=progress&quot;,return"]},"id": 1}',
    show:'{"jsonrpc":"2.0","method":"Input.ShowOSD","id":1}',
    sorry:'{"id":1,"jsonrpc":"2.0","method":"GUI.ShowNotification","params":{"title":"Alexa says:","message":"Sorry I did not understand the command","image":"warning"}}',
    speak:'{"jsonrpc":"2.0","method":"Application.SetVolume","params":{"volume":50},"id":1}',
    stop:'{"jsonrpc":"2.0","method":"Player.Stop","params":{"playerid":1},"id":1}',
    talk:'{"jsonrpc":"2.0","method":"Input.SendText","params":{"text":"home","done":true},"id":1}',
    tvSearch: '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"plugin.video.exodus","params":["/?action=tvSearch"]},"id": 1}',
    unmute:'{"jsonrpc":"2.0","method":"Application.SetMute","params":{"mute":false},"id":1}',
    up:'{"jsonrpc":"2.0","method":"Input.Up","id":1}',
    warning:'{"id":1,"jsonrpc":"2.0","method":"GUI.ShowNotification","params":{"title":"Alexa says:","message":"warning","image":"warning"}}',
    whisper:'{"jsonrpc":"2.0","method":"Application.SetVolume","params":{"volume":25},"id":1}',
}

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.appId = "amzn1.ask.skill.b9c02559-0ed8-4d1f-b680-6d32e0fb0844";
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('kodi');
    },
    'kodi': function () {
        var itemSlot = this.event.request.intent.slots.action;
        var myRequest = 'sorry';
        if (itemSlot && itemSlot.value) {
            myRequest = itemSlot.value.toLowerCase();
        }
        httpGets(myRequest,  (myResult) => {
                console.log("sent     : " + myRequest);
                console.log("received : " + JSON.stringify(myResult));
                var rspn = 'kodi '+ myRequest + ' ' + 'is ' + myResult;
                this.emit(':tell',  '');
            }
        );
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = "bye";
        this.emit(':tell', STOP_MESSAGE);
    }
};
// 2. Helper Function  =================================================================================================
function httpGets(myData, callback) {
    var options = {
        host: http_host,
        port: host_port,
        path: '/jsonrpc?request=' + encodeURIComponent(controls[myData]),
        method: 'GET',
        auth: auth,
        headers:{
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
        // if x509 certs are required:
        // key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
    
 //for(var i = 0; i<3; i++){
    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            function _isContains(json, value) {
                let contains = false;
                Object.keys(json).some(key => {
                    contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
                    return contains;
                    });
                return contains;
            }
            var json_obj = JSON.parse(returnData);
            var pop ="done"; 
            callback(json_obj);  // this will execute whatever function the caller defined, with one argument
        });
    });
    req.end();
// }
}