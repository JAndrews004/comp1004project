window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;

    class Inputhandler {

    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = Math.random() * 0 + 20;

            this.speed = Math.random() * 0.8 + 1;
            this.markedfordeletion = false;

        }
        update() {
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
            this.enemiesleft = 0;
            this.gameover = false;
            this.HP = 100;

        }
        update(deltaTime) {
            this.enemies.forEach(enemy => {
                enemy.update();
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedfordeletion);

            if (this.enemiesleft <= 0 && this.gameover == false) {
                for (let i = 0; i < 20; i++) {
                    this.addEnemy();
                }
            }
        }

        draw(context) {
            this.enemies.forEach(enemy => {
                enemy.draw(context);
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
            else {
                //player dead end game
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
