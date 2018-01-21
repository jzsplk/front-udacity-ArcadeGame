function addEnemy(e,t){for(var r=0;r<t;r++){var a=new e;a.initProperty(),allEnemies.push(a)}}function addObstacle(e){for(var t=0;t<e;t++)if(pavement.occupiedNumber()<9){var r=new Obstacle;allObstacles.push(r)}}function addRandomTreasure(e){for(var t=10,r=10,a=10,i=10,s=10,n=10,o=60,h=0;h<e;h++){var c=Math.ceil(60*Math.random());if(c<10)var l=new Heart;else if(c<20)var l=new Key;else if(c<30)var l=new BlueGem;else if(c<40)var l=new GreenGem;else if(c<50)var l=new Coin;else var l=new OrangeGem;allTreasures.push(l)}}function collision(e){return e instanceof Enemy&&e.y===player.y&&Math.abs(e.x-player.x)<50||(e instanceof Obstacle&&e.y===player.y&&e.x===player.x||e instanceof Tiger&&e.y===player.y&&Math.abs(e.x-player.x)<80)}function checkCollisionsWithObstacle(e){for(var t=0;t<e.length;t++)if(collision(e[t]))return!0}var WIDTH=101,HEIGHT=83,BASIC_SPEED=100,HighScore=0,ScoreFlag=!0,pavement=function(){var e=[];return e.reset=function(){for(var t=0;t<4;t++){e[t]=[];for(var r=0;r<5;r++)e[t][r]=!1}},e.occupiedNumber=function(){var e=0;return this.forEach(function(t){t.forEach(function(t){e+=t?1:0})}),e},e.reset(),e}(),timerId,BlueGemAction=function(){leftTime=5e3,startTimer()},leftTime=0,startTimer=function(){Engine.setTimeSpeed(.2);var e=5e3;leftTime=Math.min(5e3,leftTime);var t=10;clearInterval(timerId),timerId=setInterval(function(){leftTime-=10,(leftTime=Math.max(leftTime-10,0))<=0&&(Engine.setTimeSpeed(1),clearInterval(timerId))},10)},Enemy=function(){this.x=3*WIDTH,this.y=2*HEIGHT,this.speed=BASIC_SPEED,this.damage=4,this.sprite="images/enemy-bug.png"};Enemy.prototype.initProperty=function(){this.x=-Math.ceil(3*Math.random())*WIDTH,this.y=Math.ceil(4*Math.random())*HEIGHT,this.speed=BASIC_SPEED+50*Math.ceil(3*Math.random())},Enemy.prototype.move=function(e){this.x+=e*this.speed},Enemy.prototype.update=function(e){this.move(e),this.x>5*WIDTH&&this.initProperty()},Enemy.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y+15,60,105)};var Tiger=function(){this.height=73,this.width=1e3,this.tickCount=0,this.ticksPerFrame=4,this.numberOfFrames=8,this.frameIndex=0,this.speed=BASIC_SPEED,this.jump_distance=1,this.sprite="images/flying-0.png"};Tiger.prototype.initProperty=function(){this.x=-Math.ceil(3*Math.random())*WIDTH,this.y=Math.ceil(4*Math.random())*HEIGHT,this.speed=BASIC_SPEED+10*Math.ceil(2*Math.random())},Tiger.prototype.move=function(e){this.x+=e*this.speed},Tiger.prototype.update=function(e){this.tickCount+=1,this.tickCount>this.ticksPerFrame&&(this.tickCount=0,this.frameIndex<this.numberOfFrames-1?this.frameIndex+=1:this.frameIndex=0),this.move(e),this.x>5*WIDTH&&this.initProperty()},Tiger.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.frameIndex*this.width/this.numberOfFrames,0,this.width/this.numberOfFrames,this.height,this.x,this.y+40,this.width/this.numberOfFrames,this.height)};var Entity=function(){this.initPosition()};Entity.prototype.initPosition=function(){var e,t;for(e=Math.floor(5*Math.random()),t=Math.floor(4*Math.random()),this.x=WIDTH*e,this.y=HEIGHT*(t+1);!0===pavement[t][e]||this.x===player.x&&this.y===player.y;)e=Math.floor(5*Math.random()),t=Math.floor(4*Math.random()),this.x=WIDTH*e,this.y=HEIGHT*(t+1);pavement[t][e]=!0,console.log(pavement)};var Obstacle=function(){Entity.call(this),this.sprite="images/Rock.png"};Obstacle.prototype=Object.create(Entity.prototype),Obstacle.prototype.constructor=Obstacle,Obstacle.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x+20,this.y+15,60,105)};var removeObstacle=function(){if(0!==allObstacles.length&&!(player.keynum<=0))for(var e=0;e<allObstacles.length;e++)if(player.x===allObstacles[e].x&&player.keynum>0){var t=allObstacles[e].y/HEIGHT-1,r=allObstacles[e].x/WIDTH;pavement[t][r]=!1,player.keynum-=1,allObstacles.splice(e,1)}},Treasure=function(){Entity.call(this)};Treasure.prototype=Object.create(Entity.prototype),Treasure.prototype.constructor=Treasure,Treasure.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x+20,this.y+15,60,105)},Treasure.prototype.update=function(e){};var hitTreasureAction=function(e){e instanceof Key?player.keynum+=1:e instanceof Heart?player.hp<70?player.hp+=30:player.hp=100:e instanceof BlueGem?BlueGemAction():e instanceof GreenGem?player.jump_distance=2:e instanceof Coin?player.score+=1e3:e instanceof OrangeGem&&allEnemies.forEach(function(e){e.x=6*HEIGHT})},hitTreasure=function(){for(var e=0;e<allTreasures.length;e++)if(player.x===allTreasures[e].x&&player.y===allTreasures[e].y){var t=allTreasures[e].y/HEIGHT-1,r=allTreasures[e].x/WIDTH;pavement[t][r]=!1,hitTreasureAction(allTreasures[e]),allTreasures.splice(e,1)}},Key=function(){Treasure.call(this),this.sprite="images/Key.png"};Key.prototype=Object.create(Treasure.prototype),Key.prototype.constructor=Key;var Heart=function(){Treasure.call(this),this.sprite="images/Heart.png"};Heart.prototype=Object.create(Treasure.prototype),Heart.prototype.constructor=Heart;var BlueGem=function(){Treasure.call(this),this.sprite="images/Gem Blue.png"};BlueGem.prototype=Object.create(Treasure.prototype),BlueGem.prototype.constructor=BlueGem;var GreenGem=function(){Treasure.call(this),this.sprite="images/Gem Green.png"};GreenGem.prototype=Object.create(Treasure.prototype),GreenGem.prototype.constructor=GreenGem;var OrangeGem=function(){Treasure.call(this),this.sprite="images/Gem Orange.png"};OrangeGem.prototype=Object.create(Treasure.prototype),OrangeGem.prototype.constructor=OrangeGem;var Coin=function(){Treasure.call(this),this.height=100,this.width=1e3,this.tickCount=0,this.ticksPerFrame=4,this.numberOfFrames=10,this.frameIndex=0,this.sprite="images/coin-sprite-animation.png"};Coin.prototype=Object.create(Treasure.prototype),Coin.prototype.constructor=Coin,Coin.prototype.update=function(e){this.tickCount+=1,this.tickCount>this.ticksPerFrame&&(this.tickCount=0,this.frameIndex<this.numberOfFrames-1?this.frameIndex+=1:this.frameIndex=0)},Coin.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.frameIndex*this.width/this.numberOfFrames,0,this.width/this.numberOfFrames,this.height,this.x,this.y+40,this.width/this.numberOfFrames-20,this.height-20)};var Player=function(){this.x=3*WIDTH,this.y=5*HEIGHT,this.hp=100,this.score=0,this.keynum=0,this.jump_distance=1,this.sprite="images/char-boy.png"};Player.prototype.resetPlayer=function(){var e=setTimeout(function(){player.y=5*HEIGHT,player.x=2*WIDTH,player.jump_distance=1,ScoreFlag=!0},300)},Player.prototype.checkCollisionsWithEnemy=function(e){e.forEach(function(e){collision(e)&&e instanceof Tiger?player.x=e.x:collision(e)&&e instanceof Enemy&&(player.hp-=4)})},Player.prototype.checkCollisionsWithObstacle=function(e){e.forEach(function(e){collision(e)})},Player.prototype.update=function(e){if(this.y<HEIGHT){if(this.y=0,!0===ScoreFlag){this.score+=100,addRandomTreasure(1);Math.random()<.5&&addObstacle(1),ScoreFlag=!1}this.resetPlayer()}else this.y>5*HEIGHT&&(this.y=5*HEIGHT);if(this.checkCollisionsWithEnemy(allEnemies),this.hp<=0){alert(Data.userName+" game over! 得分为："+player.score),Data.saveUserScore(Data.userName,player.score),initGame();var t=setTimeout(function(){changeName()},500)}$(".hp").html(player.hp),$(".score").html(player.score),$(".highscore").html(HighScore),$(".keynumber").html(player.keynum),$(".name").html(Data.userName),this.x<0?this.x=0:this.x>4*WIDTH&&(this.x=4*WIDTH),HighScore<this.score&&(HighScore=this.score),hitTreasure()},Player.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y-10)},Player.prototype.handleInput=function(e){var t=this.x,r=this.y;switch(e){case"left":this.x-=player.jump_distance*WIDTH,console.log(Data.userName);break;case"right":this.x+=player.jump_distance*WIDTH;break;case"up":this.y-=player.jump_distance*HEIGHT;break;case"down":this.y+=player.jump_distance*HEIGHT;break;case"space":removeObstacle();var a=Math.floor(3*Math.random());Engine.changeMap(a);break;default:return}checkCollisionsWithObstacle(allObstacles)&&(this.x=t,this.y=r)};var player=new Player,allEnemies=[],allObstacles=[],allTreasures=[],changeName=function(){Data.userName=Data.win.prompt("请输入您的尊号","太乙真人")},updateRanking=function(){},initGame=function(){player.score=0,player.resetPlayer(),player.hp=100,player.keynum=0,allEnemies=[],allObstacles=[],allTreasures=[],pavement.reset(),addObstacle(0),addEnemy(Enemy,5),addEnemy(Tiger,1),addRandomTreasure(2)};initGame(),document.addEventListener("keyup",function(e){var t={37:"left",38:"up",39:"right",40:"down",32:"space"};player.handleInput(t[e.keyCode])});