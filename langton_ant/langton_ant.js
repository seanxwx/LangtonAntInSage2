//
// SAGE2 application: Langton ant
// Author: Harold Zang
// Author: Suyang Zhang
//
// Copyright (c) 2017
//
var langton_ant = SAGE2_App.extend({
    init: function(data) {
        //Setup Variables
        _this = this;
        this.SAGE2Init("canvas", data);
        this.resizeEvents = "continuous";
        this.interval = 15; //Set the interval to 15. If it's less than 15, it will has synchronization issue.
        this.spdDown = 0; //The variable for change Speed function
        this.spdUp = 25;
        this.antSize = 5; //The variable for change ant's size.
        this.fillColor = "black"; //The variable for change ant's color
        this.backgroundColor = "white"; //The variable for change background color
        this.antNum = 0;

        this.ctx = this.element.getContext('2d');
        //Setup background color
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);

        this.enableControls = true;
        this.controls.finishedAddingControls();

        if (isMaster) {
            console.log("LangtonAnt> isMaster");
            setTimeout(this.langton_init, 1000);
        }

    },

    load: function(date) {},

    //Draw background color function
    drawbackground: function(date) {
        var bkColor = this.backgroundColor;
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.ctx.fillStyle = bkColor;
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);

    },

    draw: function(date) {},

    langton_init: function() {
        console.log("LangtonAnt> langton_init");
        this.timer = setInterval(_this.langton_tick(), this.interval);
    },

    langton_tick: function() {
        console.log("LangtonAnt> langton_tick");
        _this.broadcast("langton_update");
    },

    //Setup Right Click Funtions
    getContextEntries: function() {
        var entries = [];

        //Add New Ant
        entry = {};
        entry.description = "Setup a new ant";
        entry.callback = "setNewAnt";
        entry.parameters = {};
        entries.push(entry);

        //Initialize Setting
        entry = {};
        entry.description = "Initialization";
        entry.callback = "initialRestart";
        entry.parameters = {};
        entries.push(entry);

        //Restart Function
        entry = {};
        entry.description = "Restart";
        entry.callback = "restart";
        entry.parameters = {};
        entries.push(entry);

        //Ant Speed ++
        entry = {};
        entry.description = "SpeedUp";
        entry.callback = "speedUp";
        entry.parameters = {};
        entries.push(entry);

        //Ant Speed --
        entry = {};
        entry.description = "SpeedDown";
        entry.callback = "speedDown";
        entry.parameters = {};
        entries.push(entry);

        //Ant Size ++
        entry = {};
        entry.description = "AntSizeUp";
        entry.callback = "antSizeUp";
        entry.parameters = {};
        entries.push(entry);

        //Ant Size --
        entry = {};
        entry.description = "AntSizeDown";
        entry.callback = "antSizeDown";
        entry.parameters = {};
        entries.push(entry);

        //Set Ant Color
        entry = {};
        entry.description = "AntColor - CornflowerBlue";
        entry.callback = "setBlueColor";
        entry.parameters = {
            color: "CornflowerBlue"
        };
        entry.entryColor = "CornflowerBlue";
        entries.push(entry);

        entry = {};
        entry.description = "AntColor - FireBrick";
        entry.callback = "setFireBrickColor";
        entry.parameters = {
            color: "FireBrick"
        };
        entry.entryColor = "FireBrick";
        entries.push(entry);

        entry = {};
        entry.description = "AntColor - SeaGreen";
        entry.callback = "setGreenColor";
        entry.parameters = {
            color: "SeaGreen"
        };
        entry.entryColor = "SeaGreen";
        entries.push(entry);

        //Set Background Color
        entry = {};
        entry.description = "BackGroundColor - AliceBlue";
        entry.callback = "setBKBlueColor";
        entry.parameters = {
            color: "AliceBlue"
        };
        entry.entryColor = "AliceBlue";
        entries.push(entry);

        entry = {};
        entry.description = "BackGroundColor - MistyRose";
        entry.callback = "setBKMistyRoseColor";
        entry.parameters = {
            color: "MistyRose"
        };
        entry.entryColor = "MistyRose";
        entries.push(entry);

        entry = {};
        entry.description = "BackGroundColor - PapayaWhip";
        entry.callback = "setBKPapayaWhipColor";
        entry.parameters = {
            color: "PapayaWhip"
        };
        entry.entryColor = "PapayaWhip";
        entries.push(entry);

        entries.push({
            description: "separator"
        });

        return entries;
    },

    //Set New Ant Function  
    setNewAnt: function(msgParams) {
        /*create canvas width and height*/
        var canvaswidth = this.element.width;
        var canvasheight = this.element.height;
        this.antNum = this.antNum + 1;

        /*create an empty 2d array (1000*1000)*/
        var array = new Array(canvaswidth);
        for (var i = 0; i < canvaswidth; i++) {
            array[i] = new Array(canvaswidth);
        }

        /*create four direction variables*/
        var RIGHT = "r";
        var LEFT = "l";
        var UP = "u";
        var DOWN = "d";

        /*Initialization*/
        var sidelength = this.antSize;
        if (this.antNum === 1) {
            var x = Math.floor(canvaswidth / 4);
            var y = Math.floor(canvasheight / 4);
        } else if (this.antNum === 2) {
            var x = Math.floor(canvaswidth / 4);
            var y = Math.floor(canvasheight * 0.75);
        } else if (this.antNum === 3) {
            var x = Math.floor(canvaswidth * 0.75);
            var y = Math.floor(canvasheight / 4);
        } else if (this.antNum === 4) {
            var x = Math.floor(canvaswidth * 0.75);
            var y = Math.floor(canvasheight * 0.75);
        } else {
            var x = Math.floor(canvaswidth * Math.random());
            var y = Math.floor(canvasheight * Math.random());
        }
        // var num = 

        // var x = Math.floor(canvaswidth / num);
        // var y = Math.floor(canvasheight / num);


        // var x = Math.floor(Math.random()*300);
        // var y = Math.floor(Math.random()*300);
        var dir = Math.floor(Math.random() * 4) + 1;
        if (dir === 1) {
            var direction = UP;
        } else if (dir === 2) {
            var direction = DOWN;
        } else if (dir === 3) {
            var direction = LEFT;
        } else {
            var direction = RIGHT;
        }
        // var direction = UP;
        var antColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        var bkColor = this.backgroundColor;

        var ctx = this.element.getContext('2d');

        var ant = function() {
            /*Check array first*/
            /*if the ant lands on the white square, turn right, flip the square to black, move forward with one square*/

            if (array[x][y] === 0) {
                if (direction == UP) {
                    direction = RIGHT;
                } else if (direction == RIGHT) {
                    direction = DOWN;
                } else if (direction == DOWN) {
                    direction = LEFT;
                } else if (direction == LEFT) {
                    direction = UP;
                }

                ctx.fillStyle = antColor; //black
                ctx.fillRect(x, y + sidelength, sidelength, sidelength); //fill the square
                array[x][y] = 1;
            }

            /*if the ant lands on the white square, turn left, flip the square to white, move forward with one square*/
            else {
                /*array[x][y]===1*/
                if (direction == UP) {
                    direction = LEFT;
                } else if (direction == LEFT) {
                    direction = DOWN;
                } else if (direction == DOWN) {
                    direction = RIGHT;
                } else if (direction == RIGHT) {
                    direction = UP;
                }

                ctx.fillStyle = bkColor; //white
                ctx.fillRect(x, y + sidelength, sidelength, sidelength); //fill the square
                array[x][y] = 0;
            }

            /*Move forward by one sidelength*/
            if (direction == RIGHT) {
                x += sidelength;
            } else if (direction == UP) {
                y += sidelength;
            } else if (direction == LEFT) {
                x -= sidelength;
            } else {
                y -= sidelength;
            }

            switch (direction) {
                case UP:
                    //y -= 1;
                    if (y < 0) {
                        y = canvasheight - 1;
                    }
                    break;
                case RIGHT:
                    // x += 1;
                    if (x >= canvaswidth) {
                        x = 0;
                    }
                    break;
                case DOWN:
                    //y += 1;
                    if (y >= canvasheight) {
                        y = 0;
                    }
                    break;
                case LEFT:
                    //x -= 1;
                    if (x < 0) {
                        x = canvaswidth - 1;
                    }
                    break;
            }

            ctx.fillStyle = "#ff0000"; /*Fill the curent ant to red color*/
            ctx.fillRect(x, y + sidelength, sidelength, sidelength);
        };
        //setInterval(ant, interval);

        var spdNum = this.spdUp;
        eval("this.timer_" + this.antNum + "=" + setInterval(function() {
            for (var j = 0; j < spdNum; j++) {
                ant();
            }
        }, this.interval));

    },

    //Update Function
    langton_update: function(date) {
        console.log("langton_update");
        /*create canvas width and height*/
        var canvaswidth = this.element.width;
        var canvasheight = this.element.height;

        /*create an empty 2d array (1000*1000)*/
        var array = new Array(canvaswidth);
        for (var i = 0; i < canvaswidth; i++) {
            array[i] = new Array(canvaswidth);
        }

        /*create four direction variables*/
        var RIGHT = "r";
        var LEFT = "l";
        var UP = "u";
        var DOWN = "d";

        /*Initialization*/
        var sidelength = this.antSize;
        var x = Math.floor(canvaswidth / 2);
        var y = Math.floor(canvasheight / 2);
        var direction = UP;
        var antColor = this.fillColor;
        var bkColor = this.backgroundColor;

        var ctx = this.element.getContext('2d');

        var ant = function() {
            /*Check array first*/
            /*if the ant lands on the white square, turn right, flip the square to black, move forward with one square*/

            if (array[x][y] === 0) {
                if (direction == UP) {
                    direction = RIGHT;
                } else if (direction == RIGHT) {
                    direction = DOWN;
                } else if (direction == DOWN) {
                    direction = LEFT;
                } else if (direction == LEFT) {
                    direction = UP;
                }

                ctx.fillStyle = antColor; //black
                ctx.fillRect(x, y + sidelength, sidelength, sidelength); //fill the square
                array[x][y] = 1;
            }

            /*if the ant lands on the white square, turn left, flip the square to white, move forward with one square*/
            else {
                /*array[x][y]===1*/
                if (direction == UP) {
                    direction = LEFT;
                } else if (direction == LEFT) {
                    direction = DOWN;
                } else if (direction == DOWN) {
                    direction = RIGHT;
                } else if (direction == RIGHT) {
                    direction = UP;
                }

                ctx.fillStyle = bkColor; //white
                ctx.fillRect(x, y + sidelength, sidelength, sidelength); //fill the square
                array[x][y] = 0;
            }

            /*Move forward by one sidelength*/
            if (direction == RIGHT) {
                x += sidelength;
            } else if (direction == UP) {
                y += sidelength;
            } else if (direction == LEFT) {
                x -= sidelength;
            } else {
                y -= sidelength;
            }

            switch (direction) {
                case UP:
                    //y -= 1;
                    if (y < 0) {
                        y = canvasheight - 1;
                    }
                    break;
                case RIGHT:
                    // x += 1;
                    if (x >= canvaswidth) {
                        x = 0;
                    }
                    break;
                case DOWN:
                    //y += 1;
                    if (y >= canvasheight) {
                        y = 0;
                    }
                    break;
                case LEFT:
                    //x -= 1;
                    if (x < 0) {
                        x = canvaswidth - 1;
                    }
                    break;
            }

            ctx.fillStyle = "#ff0000"; /*Fill the curent ant to red color*/
            ctx.fillRect(x, y + sidelength, sidelength, sidelength);
        };
        //setInterval(ant, interval);

        var spdNum = this.spdUp;
        eval("this.timer_" + this.antNum + "=" + setInterval(function() {
            for (var j = 0; j < spdNum; j++) {
                ant();
            }
        }, this.interval));

    },

    clearAnt: function(date) {
        for (var k = 0; k <= this.antNum; k++) {
            clearInterval(eval("this.timer_" + k));
        }
    },

    animate: function(date) {

    },

    //Restart Function
    restart: function(date) {
        console.log("LangtonAnt> Restart");
        this.drawbackground();
        //clearInterval(this.timer);
        this.clearAnt();
        this.antNum = 0;
        this.langton_update();
    },

    //Initialization Function
    initialRestart: function(date) {
        console.log("LangtonAnt> InitialRestart");
        //Initialize all variables
        this.drawbackground();
        this.interval = 15;
        this.spdUp = 20;
        this.antSize = 5;
        this.fillColor = "black";
        this.backgroundColor = "white";
        //clearInterval(this.timer);
        this.clearAnt();
        this.antNum = 0;
        this.restart();
    },

    //Resize Function
    startResize: function(date) {

    },

    //Speed ++ Function
    speedUp: function(date) {
        this.spdUp = this.spdUp + 20;
        this.interval = 20;
        this.restart();
    },

    //Speed -- Function
    speedDown: function(date) {
        this.spdDown = this.spdDown + 50;
        this.interval = this.spdDown;
        this.restart();
    },

    //Size ++ Function
    antSizeUp: function(date) {
        this.antSize = this.antSize + 2;
        this.restart();
    },

    //Size -- Function
    antSizeDown: function(date) {
        this.antSize = this.antSize - 2;
        this.restart();
    },

    //Resize Function
    resize: function(date) {
        console.log("LangtonAnt> Resize");
        this.minDim = Math.min(this.element.width, this.element.height);
        this.restart();
    },

    //Set Ant Size functions
    setBlueColor: function(date) {
        this.fillColor = "CornflowerBlue";
        this.restart();
    },

    setFireBrickColor: function(date) {
        this.fillColor = "FireBrick";
        this.restart();
    },

    setGreenColor: function(date) {
        this.fillColor = "SeaGreen";
        this.restart();
    },

    //Set Background Color functions
    setBKBlueColor: function(date) {
        this.backgroundColor = "AliceBlue";
        this.restart();
    },

    setBKPapayaWhipColor: function(date) {
        this.backgroundColor = "PapayaWhip";
        this.restart();
    },

    setBKMistyRoseColor: function(date) {
        this.backgroundColor = "MistyRose";
        this.restart();
    },

    event: function(eventType, position, user_id, data, date) {
        console.log("LangtonAnt> event");
    }

});