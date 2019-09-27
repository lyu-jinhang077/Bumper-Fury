## Bumper Fury HTML5 Game

Bumper Fury HTML5 game project

### Live Demo
[http://games.thejinhu.com/bumper-fury](http://games.thejinhu.com/bumper-fury)

![Screenshot](https://raw.githubusercontent.com/TruePai/Bumper-Fury/master/assets/img/Screenshot_29.png)

### Dependencies
* [PhaserJS](http://phaser.io/)


### Features
* Physical emulation using Javascript & Phaser
* Multiplayer game with Node.js & WebSocket
* Artificial intelligence for bots
* Game logic management

Collision detection 
```javascript
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

```


### Browser Support
* Google Chrome
* Mozilla Firefox
* Safari
* Opera
* Edge 10+
* IE 11+


#### Feel free to update me with any issues or directly contact to [truepai@outloook.com](mailto:truepai@outlook.com)
