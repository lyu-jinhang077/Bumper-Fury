/**
 * Created by truepai on 11/15/2018.
 *
 * @depencency: Phaser.js, fmath.js
 */

var PaiUtil = new (function() {

    this.Rectangle = function(cX, cY, width, height, rotation) {
        this.center = new Phaser.Point(cX, cY);
        this.width = width;
        this.height = height;
        this.rotation = rotation;

        this.diameter = Math.sqrt(this.width * this.width + this.height * this.height);

        this.lines = [];

        var rcos = fmath.cos(rotation);
        var rsin = fmath.sin(rotation);

        this.leftPt = new Phaser.Point(cX - this.width * rcos / 2, cY - this.width * rsin / 2 );
        this.rightPt = new Phaser.Point(cX + this.width * rcos / 2, cY + this.width * rsin / 2 );
        this.prevLeftPt = this.leftPt.clone();
        this.prevRightPt = this.rightPt.clone();

        this.ltPt = new Phaser.Point(this.leftPt.x - this.height * rsin / 2, this.leftPt.y + this.height * rcos / 2 );
        this.lbPt = new Phaser.Point(this.leftPt.x + this.height * rsin / 2, this.leftPt.y - this.height * rcos / 2 );
        this.rtPt = new Phaser.Point(this.rightPt.x - this.height * rsin / 2, this.rightPt.y + this.height * rcos / 2 );
        this.rbPt = new Phaser.Point(this.rightPt.x + this.height * rsin / 2, this.rightPt.y - this.height * rcos / 2 );

        this.lines.push(
            new Phaser.Line(this.ltPt.x, this.ltPt.y, this.rtPt.x, this.rtPt.y),
            new Phaser.Line(this.rtPt.x, this.rtPt.y, this.rbPt.x, this.rbPt.y),
            new Phaser.Line(this.rbPt.x, this.rbPt.y, this.lbPt.x, this.lbPt.y),
            new Phaser.Line(this.lbPt.x, this.lbPt.y, this.ltPt.x, this.ltPt.y)
        );

        this.updateWidth = function(width) {
            this.width = width;
            this.diameter = Math.sqrt(this.width * this.width + this.height * this.height);
        };

        this.update = function(cX, cY, rotation) {

            this.center.x = cX;
            this.center.y = cY;
            this.rotation = rotation;

            this.lines = [];

            var rcos = fmath.cos(rotation);
            var rsin = fmath.sin(rotation);

            this.prevLeftPt = this.leftPt.clone();
            this.prevRightPt = this.rightPt.clone();

            this.leftPt = new Phaser.Point(cX - this.width * rcos / 2, cY - this.width * rsin / 2 );
            this.rightPt = new Phaser.Point(cX + this.width * rcos / 2, cY + this.width * rsin / 2 );

            this.ltPt = new Phaser.Point(this.leftPt.x - this.height * rsin / 2, this.leftPt.y + this.height * rcos / 2 );
            this.lbPt = new Phaser.Point(this.leftPt.x + this.height * rsin / 2, this.leftPt.y - this.height * rcos / 2 );
            this.rtPt = new Phaser.Point(this.rightPt.x - this.height * rsin / 2, this.rightPt.y + this.height * rcos / 2 );
            this.rbPt = new Phaser.Point(this.rightPt.x + this.height * rsin / 2, this.rightPt.y - this.height * rcos / 2 );

            this.lines.push(
                new Phaser.Line(this.ltPt.x, this.ltPt.y, this.rtPt.x, this.rtPt.y),
                new Phaser.Line(this.rtPt.x, this.rtPt.y, this.rbPt.x, this.rbPt.y),
                new Phaser.Line(this.rbPt.x, this.rbPt.y, this.lbPt.x, this.lbPt.y),
                new Phaser.Line(this.lbPt.x, this.lbPt.y, this.ltPt.x, this.ltPt.y)
            );
        }

    };

    this.interectRects = function(rect1, rect2) {
        var dd = this.distance(rect1.center, rect2.center);
        var r1 = rect1.diameter / 2;
        var r2 = rect2.diameter / 2;
        if(dd > r1 + r2) return false;

        for(var i in rect1.lines) {
            for(var j in rect2.lines) {
                var res = rect1.lines[i].intersects(rect2.lines[j]);
                if(res) return res;
            }
        }

        return null;
    };

    this.distance = function(p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    };

    this.random = function(n1, n2) {
        return n1 + (n2 - n1) * Math.random();
    };

    this.round04f = function(v) {
        return Math.round(v * 10000) / 10000;
    };

    this.round01f = function(v) {
        return Math.round(v * 10) / 10;
    };

    this.parseCoord = function(c) {
        return parseFloat(c) / 10 - 3000;
    };

    this.parseDirection = function(c) {
        return parseFloat(c) / 1000 - 4;
    };

    this.formatCoord5 = function(v) {
        var i = parseInt(Math.round(v * 10) + 30000).toString();
        while(i.length < 5) {
            i = "0" + i;
        }
        return i;
    };

    this.formatDir4 = function(v) {
        var v = Phaser.Math.degToRad(Phaser.Math.getShortestAngle(0, Phaser.Math.radToDeg(v)));
        var i = parseInt(Math.round(v * 1000) + 4000).toString();
        while(i.length < 4) {
            i = "0" + i;
        }
        return i;
    };

    this.formatAngle3 = function(v) {
        var r = parseInt(v) % 360;
        if(r < 0) r += 360;
        return this.formatInt(r, 3);
    };

    this.strToByteArray = function(str) {
        var arr = new Uint8Array(str.length);
        for(var i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return arr;
    };

    this.byteArrayToStr = function(arr) {
        var byteArr = new Uint8Array(arr);
        var res = "";
        for(var i = 0; i < byteArr.length; i++) {
            res += String.fromCharCode(byteArr[i]);
        }
        return res;
    };

    this.formatName8 = function(str) {
        var name = str;
        if(name.length > 8) {
            return name.substring(0, 8);
        }
        while(name.length < 8) {
            name += "`";
        }
        return name;
    };

    this.extractName = function(str) {
        return str.replace(/`/g,"");
    };

    this.formatInt = function(v, len) {
        var i = parseInt(v).toString();
        if(i.length > len) return i.substring(0, len);
        while(i.length < len) {
            i = "0" + i;
        }
        return i;
    };

    this.calcBumperLevel = function(sco) {
        return Math.min(_maxBumperLevel, parseInt(Math.sqrt(sco / 50)) + 1);
    };

    this.randPosInScope = function() {
        return this.random(-1800, 1800);
    };

})();
