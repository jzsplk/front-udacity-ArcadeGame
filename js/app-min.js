var WIDTH=101,HEIGHT=83,BASIC_SPEED=100,Enemy=function(){this.x=3*WIDTH,this.y=2*HEIGHT,this.speed=BASIC_SPEED,this.sprite="images/enemy-bug.png"};Enemy.prototype.move=function(e){this.x+=e*this.speed},Enemy.prototype.update=function(e){this.move(e),this.x>5*WIDTH&&(this.x=-WIDTH)},Enemy.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y,60,105)};var Player=function(){this.x=3*WIDTH,this.y=5*HEIGHT,this.sprite="images/char-boy.png"};Player.prototype.update=function(e){},Player.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y)};var allEnemies=[],e1=new Enemy;allEnemies.push(e1);var player=new Player;document.addEventListener("keyup",function(e){var t={37:"left",38:"up",39:"right",40:"down"};player.handleInput(t[e.keyCode])});