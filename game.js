window.addEventListener('load', function () {
    
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    var check = false;
    var mousex = 0;
    var mousey = 0;
    keypressed = false;
    
   
    window.addEventListener('click', function (e) {
        const canvas = document.getElementById('canvas1');
        check = true;
        mousex = e.clientX - 15;
        mousey = e.clientY - canvas.getBoundingClientRect().top;
        console.log("click");

    });

    window.addEventListener('keydown', function (e) {
        key = e.key;
        keypressed = true;
        
    });
    

    class weapon {
        constructor(game) {
            this.game = game;
            
        }
    }

    class machinegun extends weapon {
        constructor(game) {
            super(game);
            this.damage = 10;
            this.range = 1000;
            this.reloadtime = 0;
            this.firerate = 50; //number of updates before next fireing
            this.texture = 'pink';
            this.cooldown = this.firerate;
            this.image = document.getElementById('machinegun');
            this.firiing = false;
            this.cost = 100;
            
        }

    }
    class weapon_place {
        constructor(game, x, y) {
            this.width = 100;
            this.height = 100;
            this.y = y;
            this.x = x;
            this.game = game;
            this.empty = true;
            this.message = 'weaponplace';
            this.frame = 0;
            this.maxframe = 3;
            this.timetonextframe = 10;
            this.playanimation = false;
            this.defualtimage = document.getElementById('Place');
            

            
        }
        draw(context) {
            if (this.empty == true) {
                context.drawImage(this.defualtimage,0,0,50,50,this.x,this.y, this.width, this.height);
            }

            else if (this.playanimation) {
                context.drawImage(this.type.image, this.frame * 44, 0, 44, 27, this.x, this.y, this.width, this.height);
                if (this.frame < this.maxframe && this.timetonextframe == 0) {
                    this.frame++;
                    this.timetonextframe = 10;
                }
                else if (this.frame == this.maxframe && this.timetonextframe == 0) {
                    this.frame = 0;
                    this.timetonextframe = 10;
                    this.playanimation = false;
                }
                else {
                    this.timetonextframe -= 1;
                }
            }
            else { context.drawImage(this.type.image, 0, 0, 44, 27, this.x, this.y, this.width, this.height); }

        }
        
        checkcollision(mousex, mousey) {
            if (this.game.selected) {
                if (mousex >= this.x && mousey >= this.y) {

                    if (this.x + this.width >= mousex && this.y + this.height >= mousey) {

                        
                        //console.log("clicked");
                        if (this.game.selectedtype == 'machinegun' && this.empty) {
                            
                            if (this.game.coins - 100 >= 0) {
                                this.type = new machinegun(game);
                                this.game.coins -= this.type.cost;
                                this.empty = false;
                            }
                            

                        }

                    }
                }
            }



        }
    }
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = Math.random() * 0 + 20;
            this.limit = 1365;
            this.speed = Math.random() * 0.8 + 1;
            this.markedfordeletion = false;
            this.targeted = false;
            this.distancetowall = this.limit - this.x;
           

        }
        update(deltaTime) {
            this.x += this.speed;
            this.distancetowall = this.limit - this.x;
            if (this.x + this.width > this.limit) {
                this.speed = 0;
                this.markedfordeletion = true;
                this.game.enemiesleft -= 1;
                this.game.takedamage(this.damage);


            }

        }
        draw(context) {
            context.drawImage(this.image, this.frame * 75, 0, 75, 75, this.x, this.y, this.width, this.height);
            if (this.frame < this.maxframe && this.timetonextframe == 0) {
                this.frame++;
                this.timetonextframe = 10;
            }
            else if (this.frame == this.maxframe && this.timetonextframe == 0) {
                this.frame = 0;
                this.timetonextframe = 10;
            }
            else {
                this.timetonextframe -= 1;
            }
            console.log(this.timetonextframe);
        }
        

    }
    class basiczombie extends Enemy {
        constructor(game) {
            super(game);
            this.damage = 2;
            this.health = 100;
            this.width = 75;
            this.height = 75;
            this.y = Math.random() * (this.game.height * 0.8 - this.height) + (this.game.height * 0.1);
            this.score = 5;
            this.image = document.getElementById('basicZombie')
            this.frame = 0;
            this.maxframe = 3;

            this.timetonextframe = 10;

        }

    }

    class weaponbuton {
        constructor(game, x, y,type,image,image2) {
            this.width = 75;
            this.height = 75;
            this.y = y;
            this.x = x;
            this.color = 'blue';
            this.game = game;
            this.type = type;
            this.image = image;
            this.image2 = image2;
            this.imagetodisplay = 1;
        }
        draw(context) {
            if (this.imagetodisplay == 1) {
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            else if (this.imagetodisplay == 2) {
                context.drawImage(this.image2, this.x, this.y, this.width, this.height);
            }
            
            
        }
        checkcollision(mousex, mousey,place) {

            if (mousex >= this.x && mousey >= this.y) {
                
                if (this.x + this.width >= mousex && this.y + this.height >= mousey) {
                    
                    
                    this.game.resetimages();
                    this.imagetodisplay = 2;
                    this.game.selected = true;
                    this.game.selectedtype = this.type;
                }
            }
            


        }
    }
    class Layer {

    }
    class background {

    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontsize = 20;
            this.fontfamily = 'Helvetica';
            this.color = 'white';

        }
        draw(context) {
            context.save();
            context.font = this.fontsize + 'px ' + this.fontfamily;
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            ;
            
            context.drawImage(document.getElementById('heart'), 20, 440, 25, 25);
            context.drawImage(document.getElementById('skull'), 20, 410, 25, 25);
            context.drawImage(document.getElementById('coin'), 20, 470, 25, 25);
            
            //health
            context.fillText(this.game.HP, 50, 460);
            //wave
            context.fillText('WAVE ' + this.game.wavenumber, 700, 30);
            //kills
            context.fillText( this.game.kills, 50, 430);
            //reasources
            context.fillText(this.game.coins, 50, 490);

            context.restore();
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.weaponplaces = [new weapon_place(this, 1380, 20), new weapon_place(this, 1380, 140), new weapon_place(this, 1380, 260), new weapon_place(this, 1380, 380)];
            this.buttons = [new weaponbuton(this, 10, 10, 'machinegun', document.getElementById('button1'), document.getElementById('button1selec'))]; //, new weaponbuton(this, 95, 10, 'mortar'), new weaponbuton(this, 180, 10, 'sniper')
            this.enemiesleft = 0;
            this.gameover = false;
            this.HP = 100;
            this.selected = false;
            this.selectedtype = '';
            this.message = 'game';
            this.notsorted = true;
            this.UI = new UI(this);
            this.coins = 100;
            this.kills = 10;
            this.wavenumber = 0;
            this.wavecountdown = 500;
            this.wavefinished = false;
            this.entername = false;
            this.playername = '';
            this.nameentered = false;
            this.updatedleaderboard = false;
            

        }
        update(deltaTime) {
            if (this.wavenumber < 10) {
                if (this.wavecountdown <= 0) {
                    this.wavefinished = false;
                }
                if (this.enemiesleft <= 0 && this.gameover == false && this.wavefinished == false) {
                    this.wavecountdown = 500;
                    if (this.wavenumber < 10) { this.wavenumber += 1; }
                    for (let i = 0; i < (this.wavenumber * 5); i++) {
                        this.addEnemy();
                    }
                    
                    this.notsorted = true;
                }
                else if (this.enemiesleft == 0 && this.gameover == false && this.wavefinished == true) {
                    this.wavecountdown -= 1;
                    
                }
            }
            else if (this.wavenumber >= 10) {
                if (this.enemiesleft <=30) {
                    for (let i = 0; i < 75; i++) {
                        this.addEnemy();
                    }
                    this.notsorted = true;
                }
            }
           
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            if (check == true) {

                this.ccb(mousex, mousey);
                check = false;
            }

            //sort enemy array from least distance to greatest distance
            if (this.enemies.length > 1 && this.notsorted) {


                this.bblSort(this.enemies);
                this.notsorted = false;
                console.log("sorted");
            }
            this.weaponplaces.forEach(weapon => {

                if (!weapon.empty) {
                    if (weapon.type.cooldown == 0) {
                        for (let i = 0; i < this.enemies.length; i++) {
                            if (this.enemies[i].targeted == false && this.enemies[i].distancetowall <= weapon.type.range) {

                                this.enemies[i].targeted = true;
                                this.enemies[i].markedfordeletion = true;
                                this.enemiesleft -= 1;
                                this.coins += Math.round(this.enemies[i].score/(0.5*this.wavenumber));
                                this.kills += 1;
                                weapon.playanimation = true;
                                weapon.type.cooldown = weapon.type.firerate;
                                console.log("enemy killed");

                                break;
                            }
                        }
                    }
                    else { weapon.type.cooldown -= 1; }
                    
                }

            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedfordeletion);
            if (this.enemiesleft == 0) {
                
                
                this.wavefinished = true;
            }

        }
        ccb(mousex, mousey) {
            var i = 0;
            this.buttons.forEach(button => {

                button.checkcollision(mousex, mousey, i)
                i += 1
            });
            this.weaponplaces.forEach(place => {

                place.checkcollision(mousex, mousey)

            });
        }

        draw(context) {
            context.drawImage(document.getElementById('background'), 0, 0, 1500, 500);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.buttons.forEach(button => {
                button.draw(context)
            });
            this.weaponplaces.forEach(place => {
                place.draw(context)
            });
            this.UI.draw(context);
        }
        addEnemy() {
            this.enemies.push(new basiczombie(this));
            this.enemiesleft += 1;
        }
        takedamage(damage) {
            if ((this.HP - damage) >= 0) {
                this.HP -= damage;
            }
            if ((this.HP - damage < 0)) {
                this.HP = 0;
            }
            
        }
        resetimages() {
            this.buttons.forEach(button => {

                button.imagetodisplay = 1;
            });
        }
        bblSort(arr) {

            for (var i = 0; i < arr.length; i++) {

                // Last i elements are already in place  
                for (var j = 0; j < (arr.length - i - 1); j++) {

                    // Checking if the item at present iteration 
                    // is greater than the next iteration
                    if (arr[j].distancetowall > arr[j + 1].distancetowall) {

                        // If the condition is true
                        // then swap them
                        var temp = arr[j]
                        arr[j] = arr[j + 1]
                        arr[j + 1] = temp
                    }
                }
            }
        }
        checkendgame(context) {
            if (this.gameover == true) {
                this.enemies = [];
                this.weaponplaces = [];
                this.buttons = []; //, new weaponbuton(this, 95, 10, 'mortar'), new weaponbuton(this, 180, 10, 'sniper')
                this.enemiesleft = 0;
                context.drawImage(document.getElementById('background'), 0, 0, 1500, 500);

                context.save();
                context.font = 75 + 'px ' + 'Helvetica';
                context.fillStyle = 'red';
                context.shadowOffsetX = 2;
                context.shadowOffsetY = 2;
                context.shadowColor = 'black';
                context.fillText('GAME OVER!', 450, 60);
                context.font = 25 + 'px ' + 'Helvetica';
                context.fillText('The zombies destroyed the wall', 500, 100);

                context.restore();
                this.readDB(context);
            }
            

        }
        readDB(context) {
            
            fetch('leaderboard.json')
                .then(response => response.json())
                .then(data => {
                    this.placements = data.Places; 
                   
                })
                .catch(error => console.error('Error loading the JSON file:', error));
            console.log(this.placements[4].score);
            if (this.kills > this.placements[4].score) {
                this.entername = true;
                this.updatedleaderboard = false;
            }
            if (this.entername == true) {
                this.enterName(context);
            }
            if (this.kills > this.placements[4].score && this.nameentered == true && this.entername == false) {
                var place = 4;
                for (let i = 4; i >= 0; i--) {
                    if (this.placements[i].score < this.kills) {
                        place = i;
                    }
                }
                for (let i = 4; i > place; i--) {
                    this.placements[i].name = this.placements[i - 1].name;
                    this.placements[i].score = this.placements[i - 1].score;
                }
                this.placements[place].name = this.playername;
                this.placements[place].score = this.kills;

                this.updatedleaderboard = true;
                console.log(this.placements);
                this.kills = -1;
                var newleaderboard = JSON.stringify(this.placements, null, 2);
                // console.log(newleaderboard);
                console.log(this.placements);
                fetch('leaderboard.json')
                    .then(response => response.json())
                    .then(data => {
                        data.Places = newleaderboard;
                        console.log(data.Places);


                        const newData = JSON.stringify(data, null, 2);
                        console.log(newData);
                        fetch('leaderboard.json', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: newData,
                        })
                            .then(() => {
                                console.log("database updated");
                            })

                    })
                    .catch(error => console.error('Error loading the JSON file:', error));
                
                
            
            }

            else if(this.updatedleaderboard == true){
                context.save();
                context.drawImage(document.getElementById('leaderboard'), 480, 110, 410, 320);
                context.font = 25 + 'px ' + 'Helvetica';
                context.fillStyle = 'white';
                context.fillText('Place', 500, 150);
                context.fillText('Name', 650, 150);
                context.fillText('Score', 800, 150);

                

                for (let i = 1; i <= 5; i++) {
                    context.fillText(this.placements[i - 1].pos, 520, 150 + i * 50);
                    context.fillText(this.placements[i - 1].name, 650, 150 + i * 50);
                    context.fillText(this.placements[i - 1].score, 800, 150 + i * 50);

                }
                context.restore()
            }

        }
        enterName(context) {
            context.save();
            context.fillStyle = '#5F5F5F';
            context.fillRect(480, 130, 375, 75);
            context.fillStyle = '#333333'
            context.fillRect(635, 135, 215, 65);
            context.font = 50 + 'px ' + 'Helvetica';
            context.fillStyle = 'white';
            context.fillText('Name:', 485, 182);
            context.fillText(this.playername, 640, 182);
            context.font = 30 + 'px ' + 'Helvetica';
            context.fillText('Please enter your name for the leaderboard', 400, 250);
            context.fillText('Then press enter to confirm', 450, 300);
            
            if (keypressed == true) {
                
                
                if (key== 'Enter') {
                    this.entername = false;
                    this.nameentered = true;
                }
                else if (key.charCodeAt(0) == 32) {
                    this.playername = this.playername.concat(' ');
                }
                else if (key == 'Backspace' || key == 'Delete' ) {
                    if (this.playername.length > 0) {
                        this.playername = this.playername.substring(0, this.playername.length - 1);
                    }
                }
                else if (this.playername.length == 0) {
                    
                    if (key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122) {
                        this.playername = this.playername.concat(key.toUpperCase());
                        
                    }
                }
                else {
                    
                    this.playername = this.playername.concat(key);
                }
                keypressed = false;
            }
            
            
            context.restore()
        }
        
       
            
    }

    const game = new Game(canvas.width, canvas.height);
    //animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx)
        requestAnimationFrame(animate);
        game.checkendgame(ctx);

    }
    animate();

    

});
