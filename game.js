window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    var check = false;
    var mousex = 0;
    var mousey = 0;

    class Inputhandler {

    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = Math.random() * 0 + 20;

            this.speed = Math.random() * 0.8 + 1;
            this.markedfordeletion = false;

        }
        update(deltaTime) {
            this.x += this.speed;
            if (this.x + this.width > 1365) {
                this.speed = 0;
                this.markedfordeletion = true;
                this.game.enemiesleft -= 1;
                this.game.takedamage -= this.dmaage;

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
            this.damage = 10;
            this.health = 100;
            this.width = 50;
            this.height = 70;
            this.y = Math.random() * (this.game.height * 0.8 - this.height) + (this.game.height * 0.1);

        }
    }

    class weaponbuton {
        constructor(game, x, y) {
            this.width = 75;
            this.height = 75;
            this.y = y;
            this.x = x;
            this.color = 'blue';
            this.game = game;
        }
        draw(context) {
        
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            
        }
        checkcollision(mousex, mousey,place) {
            if (mousex >= this.x && mousey >= this.y) {
                console.log("first check done");
                if (this.x + this.width >= mousex && this.y + this.height >= mousey) {
                    console.log("clicked at place ");
                    console.log(place);
                    this.game.resetcolors();
                    this.color = 'yellow';
                }
            }
            


        }
    }
    class Layer {

    }
    class backgroung {

    }

    class UI {

    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.buttons = [new weaponbuton(this, 10, 10), new weaponbuton(this, 95, 10), new weaponbuton(this, 180, 10)];
            this.enemiesleft = 0;
            this.gameover = false;
            this.HP = 100;
            

        }
        update(deltaTime) {
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedfordeletion);

            if (this.enemiesleft <= 0 && this.gameover == false) {
                for (let i = 0; i < 20; i++) {
                    this.addEnemy();
                }
            }
            
           
            
            window.addEventListener('click', function (e) {
                check = true;
                mousex = e.clientX -15;
                mousey = e.clientY - canvas.getBoundingClientRect().top;
                
                
            });
            console.log(mousex);
            if (check == true) {
                console.log("clicked");
                console.log("checking");
                this.ccb(mousex,mousey);
                check = false;
            }
            
        }
        ccb(mousex, mousey) {
            var i = 0;
            this.buttons.forEach(button => {
                
                button.checkcollision(mousex, mousey,i)
                i+=1
            });
        }

        draw(context) {
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.buttons.forEach(button => {
                button.draw(context)
            });
        }
        addEnemy() {
            this.enemies.push(new basiczombie(this));
            this.enemiesleft += 1;
        }
        takedamage(damage) {
            if ((this.HP - damage) > 0) {
                this.HP -= damage;
            }
            else if (this.HP <=0){
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
