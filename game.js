window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    var check = false;
    var mousex = 0;
    var mousey = 0;
    
   
    window.addEventListener('click', function (e) {
        const canvas = document.getElementById('canvas1');
        check = true;
        mousex = e.clientX - 15;
        mousey = e.clientY - canvas.getBoundingClientRect().top;
        console.log("click");

    });
    class Inputhandler {

    }

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
        }

    }
    class weapon_place {
        constructor(game, x, y) {
            this.width = 100;
            this.height = 100;
            this.y = y;
            this.x = x;
            this.color = 'black';
            this.game = game;
            this.empty = true;
            this.message = 'weaponplace';
            
           
            

            
        }
        draw(context) {

            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);

        }
        checkcollision(mousex, mousey) {
            if (this.game.selected) {
                if (mousex >= this.x && mousey >= this.y) {

                    if (this.x + this.width >= mousex && this.y + this.height >= mousey) {

                        
                        //console.log("clicked");
                        if (this.game.selectedtype == 'machinegun' && this.empty) {
                            this.type = new machinegun(game);
                            this.color = '#FF69B4';//pink
                            this.empty = false;

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
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        

    }
    class basiczombie extends Enemy {
        constructor(game) {
            super(game);
            this.damage = 2;
            this.health = 100;
            this.width = 50;
            this.height = 70;
            this.y = Math.random() * (this.game.height * 0.8 - this.height) + (this.game.height * 0.1);
            this.score = 10;

        }

    }

    class weaponbuton {
        constructor(game, x, y,type) {
            this.width = 75;
            this.height = 75;
            this.y = y;
            this.x = x;
            this.color = 'blue';
            this.game = game;
            this.type = type;
        }
        draw(context) {
        
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            
        }
        checkcollision(mousex, mousey,place) {

            if (mousex >= this.x && mousey >= this.y) {
                
                if (this.x + this.width >= mousex && this.y + this.height >= mousey) {
                    
                    
                    this.game.resetcolors();
                    this.color = 'yellow';
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
            this.buttons = [new weaponbuton(this, 10, 10, 'machinegun'), new weaponbuton(this, 95, 10, 'mortar'), new weaponbuton(this, 180, 10, 'sniper')];
            this.enemiesleft = 0;
            this.gameover = false;
            this.HP = 100;
            this.selected = false;
            this.selectedtype = '';
            this.message = 'game';
            this.notsorted = true;
            this.UI = new UI(this);
            this.coins = 0;
            this.kills = 0;
            this.wavenumber = 0;
            this.wavecountdown = 500;
            this.wavefinished = false;
            

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
                                this.coins += this.enemies[i].score;
                                this.kills += 1;
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
            if (this.HP <= 0) {
                this.gameover = true;
                console.log("GAME OVER");
                //player dead end game
            }
        }
        resetcolors() {
            this.buttons.forEach(button => {

                button.color = 'blue';
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
    }

    const game = new Game(canvas.width, canvas.height);
    //animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx)
        requestAnimationFrame(animate);

    }
    animate();

    

});
