
var _isMobile = false;

window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

$(document).ready(function() {

    _isMobile = mobileAndTabletcheck();
    if(_isMobile) {
        $("#log-container").hide();
    }

    _viewWidth = window.innerWidth;
    _viewHeight = window.innerHeight;

    _myCar = localStorage.getItem("bf-car") || "car1";
    $("#selected-car-img").attr("src", "assets/img/cars/" + _myCar + ".png");

    _game = new Phaser.Game("100", "100", Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render });
    window.addEventListener('resize', resetGameSize);

    $(window).focus(function() {
        // _game.lastUpdateTime = _game.time.now;
    });

    $("#btn-play").click(function() {
        $(this).attr("disabled", "disabled");
        var name = $("#input-name").val();
        if(name == "") name = "Player";
        _myName = name;
        localStorage.setItem("bf-name", name);
        localStorage.setItem("bf-car", _myCar);

        _msgSendBuffer += "jn" + PaiUtil.formatName8(name) + _myCar.substring(3);

    });

    $("#btn-skins").click(function() {
        $("#cars-page-container-inner>div").remove()
        for(var i in _carNames) {
            $("#cars-page-container-inner").append($("<div class='car-container-outer' ><div class='car-container' ><img src='assets/img/cars/" + _carNames[i] + ".png' />" +
                "</div><div id='btn-car-"+_carNames[i]+"' class='car-select-btn' data-id='" + _carNames[i] + "' ></div></div>"));
        }
        $("#btn-car-" + _myCar).addClass("selected");
        $(".car-select-btn").click(function() {
            $(".car-select-btn.selected").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#car-choose-container").fadeIn();
    });
    $("#btn-select-car").click(function() {
        _myCar = $(".car-select-btn.selected").data('id');
        $("#selected-car-img").attr("src", "assets/img/cars/" + _myCar + ".png");
        $("#car-choose-container").fadeOut();
    });
    var carPages = Math.ceil(_carNames.length / 3);
    var btnPrevCars = $("#btn-prev-cars");
    var btnNextCars = $("#btn-next-cars");
    var carsPageInner = $("#cars-page-container-inner");

    var updateCarPageBtns = function() {
        if(_carPage == 0) btnPrevCars.addClass("disabled");
        else btnPrevCars.removeClass("disabled");

        if(_carPage == carPages - 1) btnNextCars.addClass("disabled");
        else btnNextCars.removeClass("disabled");
    };

    updateCarPageBtns();

    btnPrevCars.click(function() {
        if(_carPage == 0) return;
        _carPage--;
        updateCarPageBtns();
        carsPageInner.css("left", "-" + (_carPage * 600) + "px");
    });

    btnNextCars.click(function() {
        if(_carPage >= carPages - 1) return;
        _carPage++;
        updateCarPageBtns();
        carsPageInner.css("left", "-" + (_carPage * 600) + "px");
    });

    var name = localStorage.getItem("bf-name");
    $("#input-name").val(name);

    showHomeScreen();

    _kills = localStorage.getItem("bf-kills") || 0;

    $("#btn-help").click(function() {
        $("#help-container").show();
    });
    $("#btn-help-ok").click(function() {
        $("#help-container").hide();
    });
});

var _carPage = 0;

var _gameTimer = null;
var _showTimeSec = 0;

function startGame() {
    _game.camera.follow(_me.sprite);
    _ctrlJoystick.rotation = _me.direction;
    _sndEngine.loopFull(0.6);

    $("#overlay-home").fadeOut(300, function() {
        updateScore(_me.score);
        updateKills(0);
        startTimer();
    });
}

function startTimer() {
    _showTimeSec = 0;
    _gameTimer = setInterval(function() {
        _showTimeSec++;
        var m = parseInt(_showTimeSec / 60);
        var s = _showTimeSec % 60;
        var mm = m > 9? m.toString() : ("0" + m);
        var ss = s > 9? s.toString() : ("0" + s);
        $("#time-shower").html(mm + ":" + ss);
    }, 1000);
}

function stopTimer() {
    clearInterval(_gameTimer);
}

function showStartUI() {
    $("#loading-gif").hide();
    $("#start-ui").show();
}

function showHomeScreen() {
    _sndEngine && _sndEngine.stop();
    if(_gameTimer) stopTimer();
    $("#overlay-home").fadeIn(2000, function() {
        $("#btn-play").removeAttr("disabled");
    });
}

function updateKills(kills) {
    $("#kills-shower").html(kills);
}

function updateScore(score) {
    $("#score-shower").html(score);
}

function updateTopList() {
    var aliveList = [];
    var keys = Object.keys(_cars);
    for(var i = 0; i < keys.length; i++) {
        if(_cars[keys[i]].died) continue;
        aliveList.push({
            id: _cars[keys[i]].id,
            playerName: _cars[keys[i]].playerName,
            score: _cars[keys[i]].score
        });
    }
    var myid = -1;
    for(var i = 0; i < aliveList.length - 1; i++) {
        for(var j = i + 1; j < aliveList.length; j++) {
            if(aliveList[j].score > aliveList[i].score) {
                var tmp = aliveList[i];
                aliveList[i] = aliveList[j];
                aliveList[j] = tmp;
            }
        }
        if(_me && aliveList[i].id == _me.id) myid = i;
    }

    if(aliveList.length > 0 && _me && aliveList[aliveList.length - 1].id == _me.id) myid = aliveList.length - 1;

    if(_me && !_me.died && myid > 2 && myid >= 0) {
        var me_list = $("#me-list");
        me_list.show();
        me_list.find(".no").html(myid + 1);
        me_list.find(".name").html(_me.playerName);
        me_list.find(".score").html(_me.score);
    } else {
        $("#me-list").hide();
    }

    for(var i = 0; i < 3; i++) {
        var row = $("#top-" + (i+1));
        if(!aliveList[i]) {
            row.hide();
            continue;
        }
        row.show();
        row.find(".name").html(aliveList[i].playerName);
        row.find(".score").html(aliveList[i].score);
    }

    _bossId = aliveList[0] && aliveList[0].id;
}

function showLog(msg) {

    if(_isMobile) return;

    var logCnt = $("#log-container p").length;
    if(logCnt >= 6) {
        $("#log-container p:nth-child(1)").remove();
    }
    $("<p>"+msg+"</p>").appendTo($("#log-container")).hide().show('fast');
}

function showMessage(msg, type) {
    var msgCont = $("#alert-container");
    msgCont.removeClass("success error");
    msgCont.addClass("show " + type);
    msgCont.html(msg);
    setTimeout(function() {
        msgCont.removeClass("show");
    }, 3000);
}

function resetGameSize() {
    _viewWidth = window.innerWidth;
    _viewHeight = window.innerHeight;
    _game.scale.setGameSize(_viewWidth, _viewHeight);
    _game.camera.deadzone = new Phaser.Rectangle(window.innerWidth / 2 - 20, window.innerHeight / 2 - 20, 40, 40);
    _accelIndicator.setPos(_viewWidth - 100, _viewHeight / 2);

    var d = _isMobile ? 140 : 100;
    _ctrlJoystick.cameraOffset.setTo(_viewWidth - d, _viewHeight - d - 100);
    _ctrlAcc.cameraOffset.setTo(20, _viewHeight - 200);
}

function preload () {

    for(var i = 0; i < _carNames.length; i++) {
        _game.load.image(_carNames[i], 'assets/img/cars/'+_carNames[i]+'.png');
    }

    for(i = 1; i <= _maxBumperLevel; i++) {
        for(var j = 0; j < _carNames.length; j++) {
            _game.load.image('bm-' + _carNames[j] + '-' + i, 'assets/img/bumpers/'+_carNames[j] + '-' + i +'.png');
        }
    }

    for(i = 0; i < _yummyNames.length; i++) {
        _game.load.image('ym-' + _yummyNames[i], 'assets/img/yummies/' + _yummyNames[i] + '.png');
    }

    _game.load.image('acceleration', 'assets/img/acceleration.png');
    _game.load.image('acceleration-gray', 'assets/img/acceleration-gray.png');
    _game.load.image('ground', 'assets/img/back-tile.jpg');
    _game.load.image('tr-black', 'assets/img/tr-black.png');

    _game.load.image('king', 'assets/img/king-icon.png');
    _game.load.image('arrow', 'assets/img/arrow.png');

    _game.load.spritesheet('car-smoke', 'assets/img/smoke/main-smoke-x20.png', 20, 20, 5);
    _game.load.spritesheet('car-smoke-acc', 'assets/img/smoke/main-smoke-x54.png', 54, 54, 5);
    _game.load.spritesheet('car-explode1', 'assets/img/explode/car-1.png', 200, 200, 6);
    _game.load.spritesheet('car-track', 'assets/img/track.png', 4, 10, 16);

    _game.load.audio('snd-engine', 'assets/audio/music.ogg');
    _game.load.audio('snd-crash', 'assets/audio/explosion.mp3');
    _game.load.audio('snd-boost', 'assets/audio/boost.mp3');
    _game.load.audio('snd-bounce', 'assets/audio/bounce.mp3');

    _game.load.image('ctrl-joystick', 'assets/img/btns/joystick.png');
    _game.load.image('ctrl-acc', 'assets/img/btns/acceleration.png');

}

function takeRandomCar() {
    var id = parseInt(Math.random() * 1000) % _carNames.length;
    return _carNames[id];
}

function takeRandomYummy() {
    var id = parseInt(Math.random() * 1000) % _yummyNames.length;
    return _yummyNames[id];
}

function takeRandomName() {
    var len = parseInt(PaiUtil.random(3, 8));
    var name = "";
    var sounds = ['m','n','b','c','d','f','g','h','j','k','l','p','q','r','s','t','v','x','z' ];
    var vowels = ['a','oh','o','i','ee','ea','e','u','oo','y'];
    var snd = true;
    while(name.length < len) {
        name += snd ? sounds[parseInt(Math.random() * 1000) % sounds.length] : vowels[parseInt(Math.random() * 1000) % vowels.length];
        snd = !snd;
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
}

var _myCar = "car1", _myName;

var _carNames = ['car1', 'car2', 'car3', 'car4', 'car5', 'car6'];
var _yummyNames = ['yellow', 'blue', 'blue2', 'green', 'orange', 'purple'];
var _yummies = {};
var _kills = 0;

var _maxBumperLevel = 9;
var _enemyCount = 10;
var fmath = new FMath();
var _viewWidth;
var _viewHeight;
var _game;
var land;
var _me = {};
var _cars = {};
var _walls = [];

var _accelIndicator = null;

var _leaderIndicator;
var _bossId;

var _groundLayer;
var _carLayer;
var _skyLayer;
var _skyLayer2;
var _topLayer;

var _leftKey, _rightKey, _spaceKey;

var _bots = {};
var cursors;

var _sndEngine, _sndCrash, _sndBoost, _sndBounce;

var _ctrlJoystick, _ctrlAcc;

var _lastGameUpdateTime = 0;

function isInWorld(v) {
    return Math.abs(v) < 1950;
}

function takeRamdomAction() {
    var r = Math.random();
    if(r > 0.8) {
        return "attack";
    } else if(r > 0.6) {
        return "accelerate";
    } else if(r > 0.4) {
        return "turn180";
    } else {
        return "turnrd";
    }
}

function LeaderIndicator(game) {
    this.sprite = game.add.sprite(500, 500, 'king');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.6);
    // this.sprite.fixedToCamera = true;

    this.arrowSprite = game.make.sprite(0, 0, 'arrow');
    this.sprite.addChild(this.arrowSprite);
    this.arrowSprite.scale.set(0.6);
    this.arrowSprite.anchor.setTo(0.5, 3);

    _skyLayer2.add(this.sprite);

    this.update = function() {
        if(!_bossId) return;
        var leader = _cars[_bossId];
        if(!leader || !leader.sprite) return;

        if(leader.sprite.inCamera) {
            this.sprite.x = leader.sprite.x - 100;
            this.sprite.y = leader.sprite.y - 60;
            this.arrowSprite.visible = false;
        } else if(_me && _me.sprite) {
            this.arrowSprite.visible = true;
            var r = Math.min(_viewWidth, _viewHeight) * 0.4;
            var d = Phaser.Math.distance(_me.sprite.x, _me.sprite.y, leader.sprite.x, leader.sprite.y);
            this.sprite.x = _me.sprite.x + r * (leader.sprite.x - _me.sprite.x) / d;
            this.sprite.y = _me.sprite.y + r * (leader.sprite.y - _me.sprite.y) / d;
            this.arrowSprite.rotation = Math.PI / 2 + Phaser.Math.angleBetween(_me.sprite.x, _me.sprite.y, leader.sprite.x, leader.sprite.y);
        }
    }
}

function Acceleration(game) {

    this.sprite = game.add.sprite(0, 0, 'acceleration-gray');
    this.sprite.anchor.setTo(0.4, 0.7);
    this.sprite.alpha = 0.8;
    this.sprite.scale.set(0.3);
    this.sprite2 = game.make.sprite(0, 0, 'acceleration');
    this.sprite2.anchor.setTo(0.4, 0.7);
    this.sprite.addChild(this.sprite2);
    this.mask = game.make.graphics();
    this.sprite.addChild(this.mask);
    this.sprite2.mask = this.mask;
    this.maskMaxAngle = Math.PI - 0.6;
    this.maskMinAngle = 0.6;
    this.angleRange = Math.PI + 1.2;

    _topLayer.add(this.sprite);

    this.sprite.fixedToCamera = true;

    this.energy = 1;
    this.dicreaseSpeed = 0.0016;
    this.increaseSpeed = 0.0005;

    this.running = false;
    this.recharging = false;

    this.update = function() {
        if(this.recharging) {
            if(this.energy > 0.99) {
                this.recharging = false;
                this.energy = 1;
            } else {
                this.energy += this.increaseSpeed * (_game.time.now - _game.lastUpdateTime);
            }
        } else if(this.running) {
            if(this.energy < 0.1) {
                this.running = false;
                this.recharging = true;
            } else {
                this.energy -= this.dicreaseSpeed * (_game.time.now - _game.lastUpdateTime);
            }
        }

        var angle = this.maskMinAngle - this.angleRange * (1 - this.energy);

        this.mask.clear();
        this.mask.beginFill(0xffffff);
        this.mask.arc(0, 0, 500, angle, this.maskMaxAngle, true, 40);
        this.mask.endFill();
    };

    this.setPos = function(x, y) {
        this.sprite.cameraOffset.setTo(x, y);
    };

    this.consumeEnergy = function() {
        this.running = true;
        this.recharging = false;
    }
}

function Yummy(game, options) {
    this.id = options.id;
    this.moving = options.moving;
    this.speed = typeof options.speed == "number" ? options.speed : (Math.random() * 0.1 + 0.3);
    this.aliveTime = options.aliveTime || 600;
    this.bornTime = game.time.now;
    this.direction = options.direction || (Math.random() * Math.PI * 2);
    this.dx = this.speed * fmath.cos(this.direction);
    this.dy = this.speed * fmath.sin(this.direction);
    this.type = options.type || (parseInt(Math.random() * 256) % _yummyNames.length);
    this.typeName = 'ym-' + _yummyNames[this.type];
    this.sprite = game.add.sprite(options.x || 0, options.y || 0, this.typeName);
    this.sprite.anchor.set(0.5);
    this.price = options.price ? options.price * 5 : 5;
    this.sprite.scale.set(0.2 + 0.15 * this.price / 5);
    this.sprite.angle = options.angle || PaiUtil.random(0, 360);
    this.boundWidth = this.sprite.width / 2;
    this.boundHeight = this.sprite.height / 2;
    this.bounds = new Phaser.Rectangle(this.sprite.x - this.boundWidth / 2, this.sprite.y - this.boundHeight / 2, this.boundWidth, this.boundHeight);

    _groundLayer.add(this.sprite);

    this.update = function() {

        if(!this.moving) {
            this.dx = 0;
            this.dy = 0;
            this.speed = 0;
            return;
        } 

        if(this.dx < 0.01 && this.dy < 0.01) {
            this.dx = 0;
            this.dy = 0;
            this.moving = false;
        } 

        this.dx *= 0.94;
        this.dy *= 0.94;

        if(!isInWorld(this.sprite.x) || !isInWorld(this.sprite.y)) {
            this.destroy();
            delete _yummies[this.id];
            return;
        }

        this.sprite.x += this.dx * (game.time.now - game.lastUpdateTime);
        this.sprite.y += this.dy * (game.time.now - game.lastUpdateTime);
        this.bounds.x = this.sprite.x - this.boundWidth / 2;
        this.bounds.y = this.sprite.y - this.boundHeight / 2;
    };

    this.destroy = function() {
        this.sprite.destroy();
        delete _yummies[this.id];
    };

    this.intersects = function(other) {
        return this.bounds.intersects(other);
    };
}

function Car(game, options) {

    this.id = options.id;
    this.score = options.score || 0;
    this.died = false;
    this.kills = 0;
    this.yummies = 0;

    this.playerName = options.name || "Player";

    this.turnRaidus = options.turnRadius || 20;
    this.direction = options.direction || 0;
    this.eTD = this.direction;

    this.bumperLevel = PaiUtil.calcBumperLevel(this.score);
    this.justBorn = true;
    this.bornTime = game.time.now;
    this.speedA = 0.0007;
    this.speedAD = 0.0006;
    this.maxSpeed = 0.25;
    this.accelerate = false;
    this.accLast = 0;
    this.accTime = 600;
    this.speed = 0.0;
    this.carType = options.car || 'car1';

    this.sprite = game.add.sprite(options.x || 0, options.y || 0, options.car);
    this.sprite.anchor.setTo(0.5, 0.6);
    this.sprite.scale.set(0.8);

    this.bm_sprite = game.add.sprite(0, 0, 'bm-' + this.carType + '-' + this.bumperLevel);
    this.bm_sprite.anchor.setTo(0.5, 0.5);
    this.bm_sprite.scale.set(0.8);
    this.bm_pos = this.sprite.height / 2 + 15;
    this.bm_sprite.y = this.sprite.y + this.bm_pos * fmath.sin(this.direction);
    this.bm_sprite.x = this.sprite.x + this.bm_pos * fmath.cos(this.direction);


    var nameStyle = {
        font: "36px monospace",
        fill: "#ffffff",
        wordWrap: false,
        align: "center"};

    this.name_text = game.add.text(this.sprite.x, this.sprite.y - this.sprite.height * 0.7, this.playerName, nameStyle);
    this.name_text.anchor.set(0.5);
    _skyLayer2.add(this.name_text);

    this.sprite.alpha = 0.4;
    this.bm_sprite.alpha = 0.4;

    _carLayer.add(this.sprite);
    _carLayer.add(this.bm_sprite);

    this.dRot = 90;

    this.lastSmokeTime = 0;
    this.smokeRate = 40;
    this.smokePos = this.sprite.height / 2;
    this.smokeRamdom = 20;

    this.targetDirection = this.direction;


    this.rectCar = new PaiUtil.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width - 12, this.sprite.height * 0.8, this.direction);
    this.rectBumper = new PaiUtil.Rectangle(this.bm_sprite.x, this.bm_sprite.y, this.bm_sprite.width - 2, this.bm_sprite.height * 1.2, this.direction);

    this.robot = {
        enabled: options.robot,
        curAction: takeRamdomAction(),
        target: null,
        nextAction: game.time.now + 2000
    };

    this.bm_helper = new Phaser.Polygon([this.rectBumper.ltPt, this.rectBumper.rtPt, this.rectBumper.rbPt, this.rectBumper.lbPt]);
    this.helper = new Phaser.Polygon([this.rectCar.ltPt, this.rectCar.rtPt, this.rectCar.rbPt, this.rectCar.lbPt]);

    this.graphics = game.add.graphics(0, 0);

    this.turn = 0;
    this.oldTurn = 0;
    this.turnSpeed = 0.0035;

    this.tnCtl = 0;

    this.fromMobile = false;

    this.lastBounceSndTime = 0;

    showLog(this.playerName + " joined");

    this.move = function() {

        var stop = false;

        if(this.died) return;

        var elapsedTime = _game.time.now - _game.lastUpdateTime;

        if(_ybm) {

            if(!this.justBorn) {
                stop = this.checkBumpersCollision() || this.checkBodysCollision() || this.checkBumperCarCollision();
                if(this.sprite && _cars[this.id]) this.checkYummiesCollision();
            }

            if(!this.sprite || !_cars[this.id]) return;

            var dDirection = this.turnSpeed * elapsedTime;
            if(this.fromMobile) {
                var diff = -Phaser.Math.degToRad(Phaser.Math.getShortestAngle(Phaser.Math.radToDeg(this.targetDirection), Phaser.Math.radToDeg(this.direction)));

                if(Math.abs(diff) < dDirection) this.direction = this.targetDirection;
                else this.direction += dDirection * Math.sign(diff); // > 0 ? Math.min(dDirection , 0.1) : Math.max(dDirection , -0.1);

            } else {
                this.direction += dDirection * this.tnCtl;
            }
            
            this.direction = Phaser.Math.degToRad(Phaser.Math.getShortestAngle(0, Phaser.Math.radToDeg(this.direction)));

            if(this.accelerate) {
                if(game.time.now > this.accLast + this.accTime) this.accelerate = false;
                else {
                    this.speed = this.maxSpeed * 2;
                }
            } else if(this.speed < this.maxSpeed) this.speed += elapsedTime * this.speedA;
            else if(this.speed > this.maxSpeed) this.speed -= elapsedTime * this.speedAD;

            if(!isInWorld(this.sprite.x) || !isInWorld(this.sprite.y)) {
                var dir = Phaser.Math.angleBetween(this.sprite.x, this.sprite.y, 0, 0);
                var nextXPos = this.sprite.x + this.maxSpeed * elapsedTime * fmath.cos(dir) * 3;
                var nextYPos = this.sprite.y + this.maxSpeed * elapsedTime * fmath.sin(dir) * 3;
            } else {
                var nextXPos = this.sprite.x + this.speed * elapsedTime * fmath.cos(this.direction);
                var nextYPos = this.sprite.y + this.speed * elapsedTime * fmath.sin(this.direction);
            }

            if(isInWorld(nextXPos)) {
                this.sprite.x = nextXPos;
            }

            if(isInWorld(nextYPos)) {
                this.sprite.y = nextYPos;
            }

            this.sprite.angle = this.dRot + Phaser.Math.radToDeg(this.direction);
            this.bm_sprite.x = this.sprite.x + this.bm_pos * fmath.cos(this.direction);
            this.bm_sprite.y = this.sprite.y + this.bm_pos * fmath.sin(this.direction);
            this.bm_sprite.angle = this.sprite.angle;

            this.rectCar.update(this.sprite.x, this.sprite.y, this.direction + Phaser.Math.degToRad(this.dRot));
            this.rectBumper.update(this.bm_sprite.x, this.bm_sprite.y, this.direction + Phaser.Math.degToRad(this.dRot));

            this.bm_helper.setTo([this.rectBumper.ltPt, this.rectBumper.rtPt, this.rectBumper.rbPt, this.rectBumper.lbPt]);
            this.helper.setTo([this.rectCar.ltPt, this.rectCar.rtPt, this.rectCar.rbPt, this.rectCar.lbPt]);

            this.name_text.x = this.sprite.x;
            this.name_text.y = this.sprite.y - this.sprite.height * 0.7;

            if(!this.justBorn && (this.accelerate || Math.abs(diff) > 0.7) || Math.abs(this.tnCtl) > 0) {
                this.leaveTrack();
            }

        }

        
        this.createSmoke();

        // if(!this.justBorn && (this == _me || (_ybm && this.robot.enabled))) this.checkYummiesCollision();

    };

    this.updateFromServer = function(cont) {
        this.sprite.x = cont.x;
        this.sprite.y = cont.y;

        var dD = Math.abs(this.direction - cont.di);
        this.direction = cont.di;
        this.accelerate = cont.ac == "1";

        if(this.score != cont.sco) {
            this.score = cont.sco;
            this.checkBumperLevelUp();
            if(this == _me) updateScore(cont.sco);
        }

        // this.speed = cont.sp;
        if(cont.jb == "0" && this.justBorn) {
            this.justBorn = false;
            this.sprite.alpha = 1;
            this.bm_sprite.alpha = 1;
        }

        this.sprite.angle = this.dRot + Phaser.Math.radToDeg(cont.di);
        this.bm_sprite.x = this.sprite.x + this.bm_pos * fmath.cos(cont.di);
        this.bm_sprite.y = this.sprite.y + this.bm_pos * fmath.sin(cont.di);
        this.bm_sprite.angle = this.sprite.angle;

        this.rectCar.update(this.sprite.x, this.sprite.y, this.direction + Phaser.Math.degToRad(this.dRot));
        this.rectBumper.update(this.bm_sprite.x, this.bm_sprite.y, this.direction + Phaser.Math.degToRad(this.dRot));

        this.bm_helper.setTo([this.rectBumper.ltPt, this.rectBumper.rtPt, this.rectBumper.rbPt, this.rectBumper.lbPt]);
        this.helper.setTo([this.rectCar.ltPt, this.rectCar.rtPt, this.rectCar.rbPt, this.rectCar.lbPt]);

        this.name_text.x = this.sprite.x;
        this.name_text.y = this.sprite.y - this.sprite.height * 0.7;

        if(!this.justBorn && (this.accelerate || dD > 0.01)) {
            this.leaveTrack();
        }
    };

    this.update = function() {

        if(_ybm) {

            if(!this.sprite || !this.bm_sprite || this.died) return;
            if(this.justBorn && game.time.now > this.bornTime + 3000) {
                this.justBorn = false;
                this.sprite.alpha = 1;
                this.bm_sprite.alpha = 1;
            }
        }

        if(this.robot.enabled && _ybm) return this.updateAuto();
        else if(this == _me) { // switch control with keyboard or mouse
            var oldTd = this.eTD;
            if(_isMobile) {
                this.eTD = null;
                if(game.input.pointer1.isDown) {
                    var x = game.input.pointer1.x;
                    var y = game.input.pointer1.y;
                    if(x > _viewWidth / 2 && y > _viewHeight / 2) {
                        this.eTD = Phaser.Math.angleBetween(_ctrlJoystick.cameraOffset.x, _ctrlJoystick.cameraOffset.y, x, y);
                        _ctrlJoystick.rotation = this.eTD;
                    }
                }
                if(this.eTD && Math.abs(this.eTD - oldTd) > 0.1)
                    _updateBuf += "td" + this.id + PaiUtil.formatDir4(this.eTD);    
            } else {
                if(this.oldTurn != this.turn) {
                    _updateBuf += "tn" + this.id + (this.turn + 2);
                    this.oldTurn = this.turn;
                }
            }
            // this.targetDirection = Phaser.Math.angleBetweenPoints(new Phaser.Point(_viewWidth / 2, _viewHeight / 2), _game.input.activePointer );// _game.physics.p2.angleToPointer(this.sprite);
        }

        this.move();
    };

    this.createSmoke = function() {
        var now = game.time.now;
        if(now > this.lastSmokeTime + this.smokeRate) {
            new CarSmoke(game, {
                x: this.sprite.x - this.smokePos * Math.cos(Phaser.Math.degToRad(this.sprite.angle - 90)) + this.smokeRamdom * (Math.random() - 0.5),
                y: this.sprite.y - this.smokePos * Math.sin(Phaser.Math.degToRad(this.sprite.angle - 90)) + this.smokeRamdom * (Math.random() - 0.5),
                acc: this.accelerate
            });
            this.lastSmokeTime = now;
        }
    };

    this.leaveTrack = function() {
        new CarTrack(game, {
            px: this.rectCar.prevLeftPt.x,
            py: this.rectCar.prevLeftPt.y,
            x: this.rectCar.leftPt.x,
            y: this.rectCar.leftPt.y,
            direction: this.sprite.angle
        });
        new CarTrack(game, {
            px: this.rectCar.prevRightPt.x,
            py: this.rectCar.prevRightPt.y,
            x: this.rectCar.rightPt.x,
            y: this.rectCar.rightPt.y,
            direction: this.sprite.angle
        });
    };

    this.updateAuto = function() {

        if(game.time.now > this.robot.nextAction) {
            this.robot.curAction = takeRamdomAction();
            switch (this.robot.curAction) {
                case "attack":
                    if(!this.justBorn) {
                        this.robot.target = this.findNearestTarget();
                        if(this.robot.target)
                            this.robot.nextAction = game.time.now + 3000 + 7000 * Math.random();
                        else
                            this.robot.nextAction = game.time.now + 2000;
                    }
                    break;
                case "accelerate":
                    this.accelerate = true;
                    this.accLast = game.time.now;
                    break;
                case "turn180":
                    this.targetDirection = this.direction + Math.PI;
                    this.robot.nextAction = game.time.now + 1000 + 3000 * Math.random();
                    break;
                case "turnrd":
                    this.targetDirection = this.direction + Math.PI * 2 * (Math.random() - 0.5);
                    this.robot.nextAction = game.time.now + 1000 + 3000 * Math.random();
                    break;
                default:
                    break;
            }

        }

        if(this.robot.curAction == "attack" && !this.justBorn) {
            if(!this.robot.target || !this.robot.target.sprite) {
                this.robot.target = this.findNearestTarget();
            }
            if(this.robot.target && this.robot.target.sprite) {
                this.targetDirection = Phaser.Math.angleBetweenPoints(new Phaser.Point(this.sprite.x, this.sprite.y),
                    new Phaser.Point(this.robot.target.sprite.x, this.robot.target.sprite.y)) * 2 / 3;
            }
        }

        this.move();
    };

    this.findNearestTarget = function() {
        var myPos = new Phaser.Point(this.sprite.x, this.sprite.y);
        var minD = 10000;
        var nearestId = -1;
        var keys = Object.keys(_cars);
        for(var i in keys) {

            if(_cars[keys[i]] == this || _cars[keys[i]].died || _cars[keys[i]].justBorn) continue;

            var ePos = new Phaser.Point(_cars[keys[i]].sprite.x, _cars[keys[i]].sprite.y);
            var d = myPos.distance(ePos);
            if(d < minD) {
                minD = d;
                nearestId = i;
            }
        }
        if(nearestId >= 0) return _cars[keys[nearestId]];
        else return null;
    };

    this.destroy = function(nexplode) {
        if(!nexplode) {
            this.explode();
        }
        // _carLayer.remove(this.sprite);
        // _carLayer.remove(this.bm_sprite);
        // _skyLayer2.remove(this.name_text);

        this.sprite.destroy();
        this.bm_sprite.destroy();
        this.name_text.destroy();
        this.sprite = null;
        this.bm_sprite = null;
        this.died = true;
    };

    this.explode = function() {
        new CarExplosion(game, {
            x: this.sprite.x,
            y: this.sprite.y
        });
    };

    this.setBumperLevel = function(bl) {
        this.bumperLevel = bl;

        _carLayer.remove(this.bm_sprite);
        this.bm_sprite.destroy();

        this.bm_sprite = game.add.sprite(0, 0, 'bm-' + this.carType + '-' + this.bumperLevel);
        this.bm_sprite.anchor.setTo(0.5, 0.6);
        this.bm_sprite.y = this.sprite.y + this.bm_pos * fmath.sin(this.direction);
        this.bm_sprite.x = this.sprite.x + this.bm_pos * fmath.cos(this.direction);

        this.rectBumper.updateWidth(this.bm_sprite.width - 2);

        _carLayer.add(this.bm_sprite);
    };

    this.checkBumperLevelUp = function() {
        // var level = parseInt(Math.ceil(this.score / 100));
        var level = parseInt(Math.ceil(Math.sqrt(this.score / 50)));
        if(this.bumperLevel < level && this.bumperLevel < _maxBumperLevel) {
            this.setBumperLevel(Math.min(level, _maxBumperLevel));
        }
    };

    this.checkBumperCarCollision = function() {
        var keys = Object.keys(_cars);
        for(var i = keys.length - 1; i >= 0; i--) {
            if(_cars[keys[i]] == this || _cars[keys[i]].died || _cars[keys[i]].justBorn) continue;
            if(PaiUtil.interectRects(this.rectBumper, _cars[keys[i]].rectCar)) {

                onKill(this, _cars[keys[i]]);
                if(_ybm) this.checkBumperLevelUp();

                _updateBuf += ('kl' + this.id + keys[i]);
                return true;
            }
        }
        return false;
    };

    this.checkBumpersCollision = function() {
        var keys = Object.keys(_cars);
        for(var i = keys.length - 1; i >= 0; i--) {
            if(_cars[keys[i]] == this || _cars[keys[i]].died || _cars[keys[i]].justBorn) continue;
            if(PaiUtil.interectRects(this.rectBumper, _cars[keys[i]].rectBumper)) {
                _updateBuf += ('im' + this.id + keys[i]);
                onImpact(this, _cars[keys[i]]);
                return true;
            }
        }
        return false;
    };

    this.checkBodysCollision = function() {
        var keys = Object.keys(_cars);
        for(var j = keys.length - 1; j >= 0; j--) {
            var i = keys[j];
            if(_cars[i] == this || _cars[i].died || _cars[i].justBorn) continue;
            if(PaiUtil.interectRects(this.rectCar, _cars[i].rectCar)) {

                onCrash(this, _cars[i]);
                _updateBuf += ('cr' + this.id + i);

                return true;
            }
        }
        return false;
    };

    this.checkYummiesCollision = function() {
        this.sprite.updateTransform();
        var bounds = this.sprite.getBounds();
        bounds.x = this.sprite.x - bounds.width / 2;
        bounds.y = this.sprite.y - bounds.height / 2;
        var keys = Object.keys(_yummies);
        for(var k = keys.length - 1; k >= 0; k--) {
            var i = keys[k];
            if(_yummies[i] && !_yummies[i].moving && _yummies[i].intersects(bounds)) {
                _updateBuf += "ty" + this.id + i;
                this.score += _yummies[i].price;
                this.checkBumperLevelUp();
                onEatYummy(i);
            }
        }
    };

}

function CarExplosion(game, option) {
    this.sprite = game.add.sprite(option.x, option.y, 'car-explode1', 6);
    this.sprite.anchor.setTo(0.5);
    this.sprite.scale.set(0.8);
    _skyLayer.add(this.sprite);

    this.anim = this.sprite.animations.add('car-explode-show');
    this.anim.onComplete.add(function(sprite, animation) {
        animation.destroy();
        sprite.destroy();
    }, this);
    this.anim.play(20, false, false);
}

function CarSmoke(game, option) {
    if(option.acc) {
        this.sprite = game.add.sprite(option.x, option.y, 'car-smoke-acc', 5);
        this.sprite.scale.set(Math.random() * 0.6 + 0.5);
    } else {
        this.sprite = game.add.sprite(option.x, option.y, 'car-smoke', 5);
        this.sprite.scale.set(Math.random() + 0.6);
    }
    _carLayer.add(this.sprite);
    this.sprite.anchor.setTo(0.5);
    this.anim = this.sprite.animations.add('show');
    this.anim.onComplete.add(function(sprite, animation) {
        animation.destroy();
        sprite.destroy();
    }, this);
    this.anim.play(20, false, false);
}

function CarTrack(game, option) {

    var cx = (option.px + option.x) / 2;
    var cy = (option.py + option.y) / 2;
    var dx = option.x - option.px;
    var dy = option.y - option.py;

    this.sprite = game.add.sprite(cx, cy, 'car-track', 16);
    this.sprite.anchor.setTo(0.5);
    this.sprite.alpha = 0.5;
    // this.sprite.height = 40;
    var yScale = Math.sqrt(dx*dx + dy*dy) / this.sprite.height + 0.1;
    this.sprite.scale.setTo(0.8, yScale);
    _groundLayer.add(this.sprite);
    this.sprite.rotation = fmath.atan(dy / dx) + Math.PI / 2;
    this.anim = this.sprite.animations.add('car-track-show');

    this.anim.onComplete.add(function(sprite, animation) {
        animation.destroy();
        sprite.destroy();
    }, this);
    this.anim.play(40, false, false);
}

// _game.scale.setGameSize(window.innerWidth, window.innerHeight);

function create () {

    console.log('------------create game--------');

    _game.stage.disableVisibilityChange = true;

    //  Resize our _game world to be a 2000 x 2000 square
    _game.world.setBounds(-3000, -3000, 6000, 6000);

    _groundLayer = _game.add.group();
    _carLayer = _game.add.group();
    _skyLayer = _game.add.group();
    _skyLayer2 = _game.add.group();
    _topLayer = _game.add.group();


    //  Our tiled scrolling background
    land = _game.add.tileSprite(0, 0, 2500, 2500, 'ground');
    land.scale.set(0.8);
    land.fixedToCamera = true;
    _groundLayer.add(land);

    var _wall1 = _game.add.sprite(0, -2500, 'tr-black');
    _wall1.anchor.setTo(0.5);
    _wall1.width = 6000;
    _wall1.height = 1000;

    var _wall2 = _game.add.sprite(-2500, 0, 'tr-black');
    _wall2.anchor.setTo(0.5);
    _wall2.width = 1000;
    _wall2.height = 4000;

    var _wall3 = _game.add.sprite(2500, 0, 'tr-black');
    _wall3.anchor.setTo(0.5);
    _wall3.width = 1000;
    _wall3.height = 4000;

    var _wall4 = _game.add.sprite(0, 2500, 'tr-black');
    _wall4.anchor.setTo(0.5);
    _wall4.width = 6000;
    _wall4.height = 1000;

    _walls.push(_wall1, _wall2, _wall3, _wall4);
    for(var i in _walls) {
        _groundLayer.add(_walls[i]);
    }

    // createRobots(_enemyCount);

    _game.camera.deadzone = new Phaser.Rectangle(window.innerWidth / 2 - 20, window.innerHeight / 2 - 20, 40, 40);
    _game.camera.focusOnXY(0, 0);

    _accelIndicator = new Acceleration(_game);
    _accelIndicator.setPos(_viewWidth - 100, _viewHeight / 2);

    _leaderIndicator = new LeaderIndicator(_game);

    _ctrlJoystick = _game.add.sprite(0, 0, 'ctrl-joystick');
    _ctrlAcc = _game.add.button(0, 0, 'ctrl-acc');
    _ctrlJoystick.scale.set(_isMobile ? 1.2 : 0.8);
    _ctrlJoystick.anchor.set(0.5);
    _ctrlAcc.scale.set(0.8);
    _topLayer.add(_ctrlJoystick);
    _topLayer.add(_ctrlAcc);
    _ctrlJoystick.fixedToCamera = true;
    _ctrlAcc.fixedToCamera = true;
    var d = _isMobile ? 140 : 100;
    _ctrlJoystick.cameraOffset.setTo(_viewWidth - d, _viewHeight - d);
    _ctrlAcc.cameraOffset.setTo(20, _viewHeight - 100);

    _ctrlAcc.onInputDown.add(accelerate, this);

    _leftKey = _game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    _rightKey = _game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    _spaceKey = _game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    _spaceKey.onDown.add(accelerate, this);
    // _game.input.onDown.add(accelerate, this);

    _game.lastUpdateTime = _game.time.now;

    _sndEngine = _game.add.audio('snd-engine');
    _sndCrash = _game.add.audio('snd-crash');
    _sndBoost = _game.add.audio('snd-boost');
    _sndBounce = _game.add.audio('snd-bounce');

    resetGameSize();

    showStartUI();

    _lastGameUpdateTime = new Date().getTime();

    mp_start();
}

function accelerate() {
    if(!_me || _me.died) return;
    if(_accelIndicator.energy == 1) {
        mp_sendNow("ac" + _me.id);
        _accelIndicator.consumeEnergy();
        _sndBoost.play();
    }
}

function newBotId() {
    for(var i = 10; i < 100; i++) {
        var id = "b" + i;
        if(_cars[id]) continue;
        return id;
    }
    return null;
}

function newCarId() {
    for(var i = 10; i < 100; i++) {
        var id = "c" + i;
        if(_cars[id]) continue;
        return id;
    }
    return null;
}

function createRobots(n) {
    // console.log('----------create bots: ' + n);
    var res = '';
    for(var i = 0; i < n; i++) {
        var id = newBotId();
        if(!id) break;
        var e = new Car(_game, {
            x: PaiUtil.randPosInScope(),
            y: PaiUtil.randPosInScope(),
            car: takeRandomCar(),
            name: takeRandomName(),
            robot: true,
            score: parseInt(Math.random() * Math.random() * 400 ) * 10,
            direction: PaiUtil.random(-Math.PI, Math.PI),
            id: id
        });
        _cars[id] = e;

        res += mp_carCreateData(e);
    }
    return res;
}

function createNewCar(name, carType) {
    var id = newCarId();
    var c = new Car(_game, {
        x: PaiUtil.randPosInScope(),
        y: PaiUtil.randPosInScope(),
        car: carType,
        name: name,
        robot: false,
        direction: PaiUtil.random(-Math.PI, Math.PI),
        id: id
    });
    _cars[id] = c;
    return id;
}

function createMe(name, id) {
    
    return me;
}

function createCarByServer(data) {

    // console.log("-----create car: " + data.name + '('+data.id+')' + ", " + new Date().getTime()); // TEMP

    var c = new Car(_game,
        {
            x: data.x,
            y: data.y,
            car: 'car' + data.ct,
            robot: data.robo == "1",
            name: data.name,
            direction: data.di,
            id: data.id,
            score: data.sco,
            bumperLevel: PaiUtil.calcBumperLevel(data.sco)
        }
    );

    if(_cars[c.id] && _cars[c.id].sprite) {
        _cars[c.id].destroy(true);
    }
    _cars[c.id] = c;
    
}

var _lastYmId = 0;
function newYmId() {
    return PaiUtil.formatInt(_lastYmId++, 8);
}

function createYummie(data) {
    var id = data.id;
    var nid = parseInt(id.substring(1));
    if(nid >= _lastYmId) _lastYmId = nid + 1;
    var ym = new Yummy(_game,
        {id: id, x: data.x, y: data.y, speed: data.sp, direction: data.di,
            angle: data.ang, type: data.cat, moving: true, scale: 0.2 + 0.15 * data.pr, price: data.pr });
    _yummies[id] = ym;
}

function createYummies(n) {
    for(var i = 0; i < n; i++) {
        var id = "y" + newYmId();
        var pr = parseInt(Math.random() * 100) % 4 + 1;
        var ym = new Yummy(_game,
            {id: id, x: PaiUtil.randPosInScope(), y: PaiUtil.randPosInScope(), speed: Math.random() * 0.1 + 0.3, direction: Math.PI * 2 * Math.random() - Math.PI,
                angle: Math.round(Math.random() * 360), type: parseInt(Math.random() * 256) % _yummyNames.length, moving: true, scale: 0.2 + 0.15 * pr, price: pr });
        _yummies[id] = ym;
    }
}

function createYummies2(x, y, n) {
    var res = ''
    for(var i = 0; i < n; i++) {
        var id = "y" + newYmId();
        var pr = parseInt(Math.random() * 100) % 4 + 1;
        var ym = new Yummy(_game,
            {id: id, x: x, y: y, speed: Math.random() * 0.1 + 0.3, direction: Math.PI * 2 * Math.random() - Math.PI,
                angle: Math.round(Math.random() * 360), type: parseInt(Math.random() * 256) % _yummyNames.length, moving: true, scale: 0.2 + 0.15 * pr, price: pr });
        _yummies[id] = ym;
        res += mp_ymCreateData(ym);
    }
    return res;
}

var _turnRight = false;
var _turnLeft = false;

var _updateBuf = "";

function update () {

    if(_game.lastUpdateTime + 1000 < _game.time.now) {
        _game.lastUpdateTime = _game.time.now - 50;
    }

    land.tilePosition.x = -_game.camera.x * 1.25;
    land.tilePosition.y = -_game.camera.y * 1.25;

    if(_me && !_me.died) {
        var turn = 0;
        if (_leftKey.isDown || _turnLeft)
        {
            turn--;
        }
        if (_rightKey.isDown || _turnRight)
        {
            turn++;
        }
        _me.turn = turn;
    }

    var keys = Object.keys(_cars);
    var ud = '';
    _updateBuf = "";
    for(var i in keys) {
        if(!_cars[keys[i]] || _cars[keys[i]].died) continue;
        _cars[keys[i]].update();
        if(_ybm && _cars[keys[i]]) ud += mp_carUpdateData(_cars[keys[i]]);
    }
    if(_ybm) _updateBuf += "ud" + PaiUtil.formatInt(ud.length, 4) + ud;
    if(_updateBuf.length > 0) {
        mp_sendNow(_updateBuf);
    }

    var ykeys = Object.keys(_yummies);
    for(var k = ykeys.length - 1; k >= 0; k--) {
        var i = ykeys[k];
        if(_yummies[i].moving) _yummies[i].update();
    }

    _accelIndicator.update();

    updateTopList();

    _leaderIndicator.update();

    _game.lastUpdateTime = _game.time.now;
    _lastGameUpdateTime = new Date().getTime();
}

function render () {

}

