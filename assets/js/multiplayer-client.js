/**
 * Created by truep on 11/18/2018.
 */

var _ws;
// var _wsUrl = "ws://192.168.2.12:3015";
var _wsUrl = _settings.wsUrl;
var _wsOpened = false;

var _mpTimer;

var _mpUpdateRate = 300;
var _msgSendBuffer = "";
var _ybm = false;

var _lenCD = 37;
var _lenUD = 24;
var _lenCY = 32;

var _cmdLenTable = {
    "as": {type: "f", len: 11},
    "ds": {type: "f", len: 1},
    "ym": {type: "f", len: 0},
    "cs": {type: "a", len: 2, cnt: _lenCD},
    "ud": {type: "v", len: 4},
    "ys": {type: "a", len: 4, cnt: _lenCY},
    "cc": {type: "f", len: _lenCD},
    "cb": {type: "f", len: 2},
    "rm": {type: "f", len: 0},
    "rc": {type: "f", len: 3},
    "cy": {type: "f", len: 2},
    "ey": {type: "a", len: 2, cnt: _lenCY},
    "kl": {type: "f", len: 6},
    "cr": {type: "f", len: 6},
    "im": {type: "f", len: 6},
    "ty": {type: "f", len: 12},
    "ry": {type: "f", len: 4},
    "jn": {type: "f", len: 15},
    "id": {type: "f", len: 3},
    "dd": {type: "f", len: 6},
    "gd": {type: "v", len: 4},
    "td": {type: "f", len: 7},
    "kk": {type: "f", len: 3},
    "ac": {type: "f", len: 3},
    "tn": {type: "f", len: 4},
};

function mp_start() {
    try {
        _ws = new WebSocket(_wsUrl);
        _ws.onopen = function(msg) {
            console.log("☻ WS connected");
            _wsOpened = true;
            showMessage("Connected to game server", "success");
            mp_startThread();
        };
        _ws.onmessage = function(msg){
            if(!msg.isTrusted) {
                console.log("▲ Received untrusted message.");
            }
            try {
                mp_procMessage(msg.data);
            } catch(error) {
                console.log("parse nodejs message error: ", error);
            }
        };
        _ws.onerror = function(error) {
            console.log("☻ WS error: " + error);
            showMessage("Connection error", "error");
            if(!_wsOpened) {
            }
        };
        _ws.onclose = function(){
            console.log("☻ WS closed");
            showLog("Connection closed!");
            showMessage("Connection closed!", "error");
            _ws = null;
            _wsOpened = false;
        }
    } catch(e) {
        console.log("☻ WebSocket error: " + e.message);
    }
}

function parseMsg(msg) {
    if(msg.length < 2) return;
    var p = 0;
    var cmds = [];
    while(p < msg.length) {
        if(msg.length < p + 2) break;
        var cmd = msg.substring(p, p + 2);
        p += 2;
        if(_cmdLenTable.hasOwnProperty(cmd)) {
            var type = _cmdLenTable[cmd].type;
            var len = _cmdLenTable[cmd].len;
            var data;
            if(type == "f") {
                data = msg.substring(p, p + len);
                p += len;
            } else if(type == "v") {
                var lenInt = parseInt(msg.substring(p, p + len));
                p += len;
                data = msg.substring(p, p + lenInt);
                p += lenInt;
            } else if(type == "a") {
                var lenInt = parseInt(msg.substring(p, p + len));
                p += len;
                data = [];
                var cnt = _cmdLenTable[cmd].cnt;
                for(var i = 0; i < lenInt; i++) {
                    var itm = msg.substring(p, p + cnt);
                    p += cnt;
                    data.push(itm);
                }
            }

            cmds.push({type: cmd, data: data});
        }

    }
    return cmds;
}

var _shouldUpdate = false;
function mp_procMessage(msg) {
    var msgObj = parseMsg(msg);
    _shouldUpdate = false;
    for(var i in msgObj) {
        mp_procCommand(msgObj[i]);
    }
    if(_shouldUpdate) mp_send();
}

var _lastSU = new Date().getTime();
function mp_procCommand(cmd) {
    switch(cmd.type) {
        case "ym":
            _ybm = true;
            break;
        case "cb":
            if(_ybm) {
                createRobots(parseInt(cmd.data));
                // _msgSendBuffer += genGameCreateData();
            }
            break;

        case "jn":
            if(_ybm) {
                var name8 = cmd.data.substring(0, 8);
                var ct = cmd.data.substring(8, 9);
                var token = cmd.data.substring(9, 15);
                var keys = Object.keys(_cars);
                var kick = null;
                var granted = true;
                if(keys.length >= 20) {
                    for(var i in keys) {
                        if(_cars[keys[i]].robot.enabled) {
                            kick = keys[i];
                            break;
                        }
                    }
                    if(!kick) granted = false;
                }
                var msg = "";
                if(granted) {
                    if(kick) {
                        showLog(_cars[kick].playerName + " left");
                        _cars[kick].destroy(true);
                        delete _cars[kick];
                        msg += "rc" + kick;
                    } 
                    var id = createNewCar(PaiUtil.extractName(name8), 'car' + ct);
                    msg += "cc" + mp_carCreateData(_cars[id]);
                    msg += "id" + id + token;
                } else {
                    msg += "ds1" + token;
                }
                mp_sendNow(msg);
            }
            break;

        case "rc":
            if(_ybm) break;
            var id = cmd.data;
            if(_cars[id]) {
                showLog(_cars[id].playerName + " left");
                _cars[id].destroy(true);
                delete _cars[id];
            }
            break;

        case "kk":
            var id = cmd.data;
            if(_cars[id]) {
                showLog(_cars[id].playerName + " left");
                _cars[id].destroy(true);
                delete _cars[id];
                mp_sendNow("rc" + id);
            }
            break;

        case "cc":
            if(!_ybm) {
                var obj = mp_parseCreateData(cmd.data);
                createCarByServer(obj);
            }
            break;

        case "id":
            var id = cmd.data;
            if(_cars[id]) {
                _me = _cars[id];
                startGame();
            }
            break;

        case "dd":
            var token = cmd.data;
            var data = genGameCreateData();
            mp_sendNow("gd" + PaiUtil.formatInt(data.length + 6, 4) + token + data);
            break;

        case "gd":
            mp_procMessage(cmd.data);
            break;

        case "td":
            var id = cmd.data.substring(0,3);
            var td = PaiUtil.parseDirection(cmd.data.substring(3,7));
            if(_cars[id]) {
                _cars[id].fromMobile = true;
                _cars[id].targetDirection = td;
            }
            break;

        case "tn":
            var id = cmd.data.substring(0,3);
            var tn = parseInt(cmd.data.substring(3,4)) - 2;
            if(_cars[id]) {
                _cars[id].fromMobile = false;
                _cars[id].tnCtl = tn;
            }
            break;

        case "cs":
            if(_ybm) break;
            // var keys = Object.keys(_cars);
            // for(var i = keys.length - 1; i >= 0; i--) {
            //     var k = keys[i];
            //     if(_cars[k] && _cars[k].sprite) {
            //         _cars[k].destroy(true);
            //     }
            // }
            // _cars = {};
            for(var i in cmd.data) {
                var obj = mp_parseCreateData(cmd.data[i]);
                createCarByServer(obj);
            }
            break;

        case "ys":
            if(_ybm) break;
            // var keys = Object.keys(_yummies);
            // for(var i = keys.length - 1; i >= 0; i--) {
            //     var k = keys[i];
            //     if(_yummies[k] && _yummies[k].sprite) {
            //         _yummies[k].destroy();
            //     }
            // }
            // _yummies = {};
            for(var i in cmd.data) {
                var obj = mp_parseYmData(cmd.data[i]);
                createYummie(obj);
            }
            break;

        // case "as":
        //     var id = cmd.data.substring(0,3);
        //     var name = PaiUtil.extractName(cmd.data.substring(3,11));
        //     startGame(name, id);
        //     break;

        case "ds":
            showMessage();
            break;

        case "ud":
            if(_ybm) break;
            var p = 0;
            while(true) {
                if(p >= cmd.data.length - 1) break;
                var data = mp_parseUpdateData(cmd.data.substring(p, p+=_lenUD));
                if(_cars[data.id]) _cars[data.id].updateFromServer(data);
            }
            break;

        case "kl":
            var id1 = cmd.data.substring(0,3);
            var id2 = cmd.data.substring(3,6);

            var killer = _cars[id1];
            var died = _cars[id2];

            onKill(killer, died);

            break;

        case "cr":
            var id1 = cmd.data.substring(0,3);
            var id2 = cmd.data.substring(3,6);
            var car1 = _cars[id1];
            var car2 = _cars[id2];

            onCrash(car1, car2);

            break;

        case "im":
            var id1 = cmd.data.substring(0,3);
            var id2 = cmd.data.substring(3,6);
            var car1 = _cars[id1];
            var car2 = _cars[id2];

            onImpact(car1, car2);
            // console.log('-------- bump: ' + car1.playerName + ' and ' + car2.playerName);
            
            break;

        case "ac":
            var id = cmd.data;
            if(_cars[id]) {
                _cars[id].accelerate = true;
                _cars[id].accLast = _game.time.now;
                _cars[id].accTime = 600 + Math.sqrt(_cars[id].score) * 5;
            }
            break;

        case "cy":
            createYummies(parseInt(cmd.data));
            break;

        case "ty":
            var yid = cmd.data.substring(3,12);
            onEatYummy(yid);
            break;

        case "rc":
            if(_cars[cmd.data]) {
                showLog(_cars[cmd.data].playerName + " left");
                _cars[cmd.data].destroy(true);
                delete _cars[cmd.data];
            }
            break;

        case "rm":
            // console.log('----received rbm');
            _ybm = false;
            break;

        default:
            break;
    }
}


function mp_startThread() {
    mp_sendNow("ld");
    setInterval(mp_send, _mpUpdateRate);
    // mp_send();
}

function mp_send() {

    if(!_wsOpened) return;

    var active = new Date().getTime() < _lastGameUpdateTime + 500;
    var a = active?1:0;
    _msgSendBuffer += "av" + a;

    if(_ybm && !active) {
        _msgSendBuffer += "na";
    }

    _ws.send(_msgSendBuffer);
    _msgSendBuffer = "";
}

function mp_sendNow(msg) {
    if(_wsOpened) {
        _ws.send(msg);
    }
}

function genGameCreateData() {
    var keys = Object.keys(_cars);
    var res = '';
    for(var i in keys) {
        res += mp_carCreateData(_cars[keys[i]]);
    }

    var resy = '';
    var ykeys = Object.keys(_yummies);
    for(var i in ykeys) {
        resy += mp_ymCreateData(_yummies[ykeys[i]]);
    }
    return "cs" + PaiUtil.formatInt(keys.length, 2) + res + "ys" + PaiUtil.formatInt(ykeys.length, 4) + resy;
}

function genGameUpdateData() {
    var keys = Object.keys(_cars);
    var res = '';
    for(var i in keys) {
        res += mp_carUpdateData(_cars[keys[i]]);
    }
    return "cs" + PaiUtil.formatInt(keys.length, 2) + res;
}

function mp_carCreateData(car) {
    return PaiUtil.formatCoord5(car.sprite.x) + PaiUtil.formatCoord5(car.sprite.y) + "0" + PaiUtil.formatDir4(car.direction)
        + PaiUtil.formatName8(car.playerName) + car.carType.substring(3) + PaiUtil.formatInt(car.score, 5) + PaiUtil.formatInt(car.kills, 4) + (car.robot.enabled?1:0) + car.id;
}

function mp_carUpdateData(car) {
    // console.log("send update data: ", car.eX, car.eY);
    return PaiUtil.formatCoord5(car.sprite.x) + PaiUtil.formatCoord5(car.sprite.y) + (car.accelerate ? "1" : "0") + PaiUtil.formatDir4(car.direction)
        + PaiUtil.formatInt(car.score, 5) + car.id + (car.justBorn?"1":"0");
}

function mp_ymCreateData(ym) {
    return PaiUtil.formatCoord5(ym.sprite.x) + PaiUtil.formatCoord5(ym.sprite.y) + PaiUtil.formatDir4(ym.direction) + PaiUtil.formatAngle3(ym.sprite.angle) 
        + ym.price / 5 + PaiUtil.formatInt(Math.sqrt(ym.dx*ym.dx+ym.dy*ym.dy) * 100, 4) + ym.id + ym.type;

}

function mp_parseCreateData(data) {
    var x, y, ac, di, name, ct, sco, kil, robo, id;
    x = PaiUtil.parseCoord(data.substring(0,5));
    y = PaiUtil.parseCoord(data.substring(5,10));
    ac = data.substring(10,11);
    di = PaiUtil.parseDirection(data.substring(11,15));
    name = PaiUtil.extractName(data.substring(15,23));
    ct = parseInt(data.substring(23,24));
    sco = parseInt(data.substring(24,29));
    kil = parseInt(data.substring(29,33));
    robo = data.substring(33,34);
    id = data.substring(34,37);
    return {x:x, y:y, ac:ac, di:di, name:name, ct:ct, sco:sco, kil:kil, robo:robo, id:id};
}

function mp_parseUpdateData(data) {
    var x, y, ac, di, sco, id;
    x = PaiUtil.parseCoord(data.substring(0,5));
    y = PaiUtil.parseCoord(data.substring(5,10));
    ac = data.substring(10,11);
    di = PaiUtil.parseDirection(data.substring(11,15));
    sco = parseInt(data.substring(15,20));
    id = data.substring(20,23);
    jb = data.substring(23,24);
    // console.log("received update data: ", x, y);
    return {x:x, y:y, ac:ac, di:di, sco:sco, id:id, jb:jb};
}

function mp_parseYmData(data) {
    var x, y, di, ang, pr, sp, id, cat;
    x = PaiUtil.parseCoord(data.substring(0,5));
    y = PaiUtil.parseCoord(data.substring(5,10));
    di = PaiUtil.parseDirection(data.substring(10,14));
    ang = parseInt(data.substring(14,17));
    pr = parseInt(data.substring(17,18));
    sp = parseInt(data.substring(18,22)) / 100;
    id = data.substring(22,31);
    cat = parseInt(data.substring(31,32));
    // console.log("received update data: ", x, y);
    return {x:x, y:y, di:di, ang:ang, pr:pr, sp:sp, id:id, cat:cat};
}

function onKill(killer, died) {
    if(killer && died) {
        showLog(killer.playerName + ' killed ' + died.playerName);

        if(killer == _me || died == _me) {
            _sndCrash.play('', 0, 1);
        }

        if(died == _me) {
            showHomeScreen();
            _me = {};
            mp_sendNow("di");
        }

        if(killer == _me) {
            _me.kills++;
            updateKills(_me.kills);
        }

        if(_ybm) {
            killer.score += Math.max(50, parseInt(died.score / 50) * 10);
            var n = 3 + died.bumperLevel;
            var res = PaiUtil.formatInt(n, 4) + createYummies2(died.sprite.x, died.sprite.y, n);
            _updateBuf += "ys" + PaiUtil.formatInt(res.length, 4) + res;

            if(died.robot.enabled) {
                setTimeout(function() {
                    var cs = createRobots(1);
                    var data = "01" + cs;
                    mp_sendNow("cs" + PaiUtil.formatInt(data.length, 4) + data);
                }, 2000);
            }
        } 

        died.destroy();
        delete _cars[died.id];
        
        killer.speed = -0.2 * killer.maxSpeed;
        killer.checkBumperLevelUp();
    }
}

function onCrash(car1, car2) {
    if(car1 && car2) {
        // console.log('-------- crashed and died: ' + car1.playerName + '('+car1.id+')' + ' and ' + car2.playerName + '('+car2.id+')' + ", " + new Date().getTime()); // TEMP
        showLog("CRASHED! " + car1.playerName + ' -><- ' + car2.playerName );

        if(car1 == _me || car2 == _me) {
            _sndCrash.play('', 0, 1);
            showHomeScreen();
            _me = {};
            mp_sendNow("di");
        }

        if(_ybm) {
            var n1 = 3 + car1.bumperLevel;
            var n2 = 3 + car2.bumperLevel;
            var res = PaiUtil.formatInt(n1 + n2, 4) + createYummies2(car1.sprite.x, car1.sprite.y, n1) + createYummies2(car2.sprite.x, car2.sprite.y, n2);
            _updateBuf += "ys" + PaiUtil.formatInt(res.length, 4) + res;

            var cn = 0;
            if(car1.robot.enabled) cn++;
            if(car2.robot.enabled) cn++;
            if(cn > 0) {
                setTimeout(function() {
                    var cs = createRobots(cn);
                    var data = "0" + cn + cs;
                    mp_sendNow("cs" + PaiUtil.formatInt(data.length, 4) + data);
                }, 2000);
            }
        }

        car1.destroy();
        car2.destroy();

        delete _cars[car1.id];
        delete _cars[car2.id];
    }
}

function onImpact(car1, car2) {
    if(car1 && car2) {

        if(_ybm) {
            car1.accelerate = false;
            car2.accelerate = false;

            var angle = Phaser.Math.getShortestAngle(Phaser.Math.radToDeg(car1.direction), Phaser.Math.radToDeg(car2.direction));
            if(Math.abs(angle) < 80) {
                if(car1.bumperLevel < car2.bumperLevel) {
                    car1.speed = -car1.maxSpeed * (car2.accelerate ? 2.4 : 1.4);
                } else {
                    car2.speed = -car2.maxSpeed * (car1.accelerate ? 2.4 : 1.4);
                }
            } else {
                car1.speed = -car1.maxSpeed * (car2.accelerate ? 2.4 : 1.4);
                car2.speed = -car2.maxSpeed * (car1.accelerate ? 2.4 : 1.4);
            }
        }

        if(car1 == _me || car2 == _me) {
            if(_game.time.now > _me.lastBounceSndTime + 400) {
                _sndBounce.play();
                _me.lastBounceSndTime = _game.time.now;
            }
        }
    }
}

function onEatYummy(i) {
    if(_yummies[i]) {
        _yummies[i].destroy();
        delete _yummies[i];
    }
}