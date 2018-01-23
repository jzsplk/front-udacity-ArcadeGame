//这里是我们游戏中的一些常数
var WIDTH = 101,
HEIGHT = 83,
BASIC_SPEED = 100,
HighScore = 0;

//为了控制触发次数
var ScoreFlag = true;
var endFlag = true;
var backgroundFlag = true;

//记录哪些节点被占用
var pavement = (function() {
    var matrix = [];

    //重制自己
    matrix.reset = function() {
        for(var i = 0; i < 4; i++) {
            matrix[i] = [];
            for(var j = 0; j < 5; j++) {
                matrix[i][j] = false;
            }
        }
    };

    matrix.occupiedNumber = function() {
        var num = 0;
        this.forEach(function(eachRow) {
            eachRow.forEach(function(eachCell) {
                num += (eachCell ? 1: 0);
            });
        });
        return num;
    };

    matrix.reset();

    return matrix;
})();

//启动倒计时，不断减少dt
var timerId;

//蓝宝石被捡到时触发的函数
var BlueGemAction = function() {
    leftTime = 5000;
    startTimer();
}

//倒计时的剩余时间
var leftTime = 0;

//倒计时函数
var startTimer = function() {
    Engine.setTimeSpeed(0.2);
    var maxTime = 5000;
    leftTime = Math.min(maxTime, leftTime);
    var dt = 10;

    //清除上一次的timer
    clearInterval(timerId);

    //倒计时器，leftTime减少到0时，触发恢复流速
    timerId = setInterval(function() {
        leftTime -= dt;
        leftTime = Math.max(leftTime - dt, 0);
        if(leftTime <= 0) {
            Engine.setTimeSpeed(1);
            clearInterval(timerId);
        }
    }, dt);
};


//生成Enemy函数
function addEnemy(name, num) {
    for(var i = 0; i < num; i++) {
        var enemy = new name();
        enemy.initProperty();
        allEnemies.push(enemy);
    }
}

// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = 3 * WIDTH;
    this.y = 2 * HEIGHT;
    this.speed = BASIC_SPEED;
    this.damage = 4;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.initProperty = function() {
    this.x = -(Math.ceil(Math.random() * 3) * WIDTH);
    this.y = (Math.ceil(Math.random() * 4)) * HEIGHT;
    this.speed = BASIC_SPEED * 0.01 + (50 * Math.ceil(Math.random() * 3));
};

//控制移动的函数
Enemy.prototype.move = function(dt) {
    this.x += dt * this.speed; 
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.move(dt);
    
    if(this.x > 5 * WIDTH) {
        this.initProperty();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 15, 60, 105);
};

//Tiger动态的Emeny
var Tiger = function() {
    // Tiger的默认属性，sprite,width,height,ticksPerFrame
    this.height = 73;
    this.width = 1000;
    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.numberOfFrames = 8;
    this.frameIndex = 0;
    this.speed = BASIC_SPEED;
    // player的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/flying-0.png';
};

//定义速度跟位置的函数
Tiger.prototype.initProperty = function() {
    this.x = -(Math.ceil(Math.random() * 3) * WIDTH);
    this.y = (Math.ceil(Math.random() * 4)) * HEIGHT;
    this.speed = BASIC_SPEED + (10 * Math.ceil(Math.random() * 2));
};

//控制移动的函数
Tiger.prototype.move = function(dt) {
    this.x += dt * this.speed; 
};

// 此为游戏必须的函数，用来更新敌人的位置
// tickCount为控制动画的参数
Tiger.prototype.update = function(dt) {
    this.tickCount += 1;

            if (this.tickCount > this.ticksPerFrame) {

                this.tickCount = 0;
                
                // If the current frame index is in range
                if (this.frameIndex < this.numberOfFrames - 1) {  
                    // Go to the next frame
                    this.frameIndex += 1;
                } else {
                    this.frameIndex = 0;
                }
            }
    this.move(dt);
    
    if(this.x > 5 * WIDTH) {
        this.initProperty();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Tiger.prototype.render = function() {

    // Draw the animation
    ctx.drawImage(
    Resources.get(this.sprite),
    this.frameIndex * this.width / this.numberOfFrames,
    0,
    this.width / this.numberOfFrames,
    this.height,
    this.x,
    this.y + 40,
    this.width / this.numberOfFrames,
    this.height);
};


// Entity, 障碍跟宝物的父类
var Entity = function() {
    this.initPosition();
};

Entity.prototype.initPosition = function() {
    //用来表示宝物跟障碍在节点中的坐标
    var col, row;
    //随机生成一个坐标并赋值给障碍或宝物的x，y值

    col = Math.floor(Math.random() * 5);
    row = Math.floor(Math.random() * 4);
    this.x = WIDTH * col;
    this.y = HEIGHT * (row + 1);
    //为了不让障碍物或宝物生成在同一地点,不在玩家处产生宝物或障碍
    while(pavement[row][col] === true || (this.x === player.x && this.y === player.y) ) {
         col = Math.floor(Math.random() * 5);
         row = Math.floor(Math.random() * 4);
         this.x = WIDTH * col;
         this.y = HEIGHT * (row + 1); 
    }
    
    //在pavement记录此坐标
    pavement[row][col] = true;
    console.log(pavement);
};



// Obstacle为Entity的子类
var Obstacle = function() {
    Entity.call(this);
    this.sprite = 'images/Rock.png';
};

Obstacle.prototype = Object.create(Entity.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.render = function() {
     ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 15, 60, 105);
}

//生成Obstacle函数
function addObstacle(num) {
    for(var i = 0; i < num; i++) {
        //控制添加石头，在被占据的格子超过10时不添加障碍
        if(pavement.occupiedNumber() < 9) {
            var obstacle = new Obstacle();
            allObstacles.push(obstacle);
        }
        
    }
}

//移除obstacle的函数
var removeObstacle = function() {
    if(allObstacles.length === 0) {
        return;
    }

    if(player.keynum <= 0) {
        return;
    }

    for(var i = 0; i < allObstacles.length; i++) {
        if(player.x === allObstacles[i].x && (player.keynum > 0)) {
            var row = allObstacles[i].y / HEIGHT - 1;
            var col = allObstacles[i].x / WIDTH;
            pavement[row][col] = false;
            player.keynum -= 1;
            allObstacles.splice(i ,1);
        } 
    }
    

    // var randomIndex = Math.floor(Math.random() * allObstacles.length);

    // //复原pavement中元素
    // var row = allObstacles[randomIndex].y / HEIGHT - 1;
    // var col = allObstacles[randomIndex].x / WIDTH;
    // pavement[row][col] = false;
    // player.keynum -= 1;
    // allObstacles.splice(randomIndex ,1);
};

//Treasure类为Entity的子类，当player碰到了treasure,treature消失并触发效果
var Treasure = function() {
    Entity.call(this);
};

Treasure.prototype = Object.create(Entity.prototype);
Treasure.prototype.constructor = Treasure;

Treasure.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 15, 60, 105);
}

Treasure.prototype.update = function(dt) {
    
};

//添加宝物的函数
function addRandomTreasure(num) {
    var HeartWeight = 10,
    KeyWeight = 10,
    BlueGemWeight = 10,
    GreenGemWeight = 10,
    OrangeGemWeight = 10,
    CoinWeight = 10;

    var TotalWeight = HeartWeight + KeyWeight + BlueGemWeight + GreenGemWeight + OrangeGemWeight + CoinWeight;


    for(var i = 0; i < num; i++) {
        var randomNum = Math.ceil(Math.random() * TotalWeight);
        if(randomNum < HeartWeight ) {
            var treasure = new Heart();
        }
        else if(randomNum < (HeartWeight + KeyWeight)) {
            var treasure = new Key();
        }
        else if(randomNum  < (HeartWeight + KeyWeight + BlueGemWeight)) {
            var treasure = new BlueGem();
        }
        else if(randomNum < (HeartWeight + KeyWeight + BlueGemWeight + GreenGemWeight)) {
            var treasure = new GreenGem();
        }
        else if(randomNum < (HeartWeight + KeyWeight + BlueGemWeight + GreenGemWeight + CoinWeight)) {
            var treasure = new Coin();
        }
        else{
            var treasure = new OrangeGem();
        }
        
        allTreasures.push(treasure);
    }
}

//判断碰到宝物后应执行何动作的函数
var hitTreasureAction = function(obj) {
    if(obj instanceof Key) {
        player.keynum += 1;
    }
    else if(obj instanceof Heart) {
        if(player.hp < 70) {
            player.hp += 30;
        } else {
            player.hp = 100;
        }
    }
    else if(obj instanceof BlueGem) {
        BlueGemAction();
    }
    else if(obj instanceof GreenGem) {
        player.jump_distance = 2;
    }
    else if(obj instanceof Coin) {
        player.score += 1000;
    }
    else if(obj instanceof OrangeGem) {
        allEnemies.forEach(function(enemy) {
            enemy.x = - 6 * WIDTH;
        });
    }
};

//监测碰到Treasure并执行的函数
var hitTreasure = function() {
    for (var i = 0; i < allTreasures.length; i++) {
        if(player.x === allTreasures[i].x && player.y === allTreasures[i].y) {
            var row = allTreasures[i].y / HEIGHT - 1;
            var col = allTreasures[i].x / WIDTH;
            pavement[row][col] = false;
            hitTreasureAction(allTreasures[i]);
            allTreasures.splice(i, 1);
            
        }
    }
};
//Treasure类的子类，Key
var Key = function() {
    Treasure.call(this);
    this.sprite = 'images/Key.png'
}

Key.prototype = Object.create(Treasure.prototype);
Key.prototype.constructor = Key;

//Treasure类的子类，Heart
var Heart = function() {
    Treasure.call(this);
    this.sprite = 'images/Heart.png'
}

Heart.prototype = Object.create(Treasure.prototype);
Heart.prototype.constructor = Heart;

//Treasure类的子类，BlueGem
var BlueGem = function() {
    Treasure.call(this);
    this.sprite = 'images/Gem Blue.png'
}

BlueGem.prototype = Object.create(Treasure.prototype);
BlueGem.prototype.constructor = BlueGem;

//Treasure类的子类，GreenGem
var GreenGem = function() {
    Treasure.call(this);
    this.sprite = 'images/Gem Green.png'
}

GreenGem.prototype = Object.create(Treasure.prototype);
GreenGem.prototype.constructor = GreenGem;

//Treasure类的子类，OrangeGem
var OrangeGem = function() {
    Treasure.call(this);
    this.sprite = 'images/Gem Orange.png'
}

OrangeGem.prototype = Object.create(Treasure.prototype);
OrangeGem.prototype.constructor = OrangeGem;

//具有动画效果的Treasure
//Treasure类的子类，Coin
var Coin = function() {
    Treasure.call(this);
    this.height = 100;
    this.width = 1000;
    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.numberOfFrames = 10;
    this.frameIndex = 0;
    //可以动态的sprite sheet图片
    this.sprite = 'images/coin-sprite-animation.png';
}

Coin.prototype = Object.create(Treasure.prototype);
Coin.prototype.constructor = Coin;

// 此为游戏必须的函数，用来更新使得annimation可以出现
// tickCount为控制动画的参数
Coin.prototype.update = function(dt) {
    this.tickCount += 1;

            if (this.tickCount > this.ticksPerFrame) {

                this.tickCount = 0;
                
                // If the current frame index is in range
                if (this.frameIndex < this.numberOfFrames - 1) {  
                    // Go to the next frame
                    this.frameIndex += 1;
                } else {
                    this.frameIndex = 0;
                }
            }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Coin.prototype.render = function() {

    // Draw the animation
    ctx.drawImage(
    Resources.get(this.sprite),
    this.frameIndex * this.width / this.numberOfFrames,
    0,
    this.width / this.numberOfFrames,
    this.height,
    this.x,
    this.y + 40,
    this.width / this.numberOfFrames -20,
    this.height -20);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
// 这是我们的玩家
var Player = function() {
    // Player的默认属性，x,y,hp,score,sprite
    this.x = 3 * WIDTH;
    this.y = 5 * HEIGHT;
    this.hp = 100;
    this.score = 1;
    this.keynum = 0;
    // this.name = win.prompt('Please enter your name', 'xc');
    //跳跃的距离
    this.jump_distance = 1;
    // player的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/char-boy.png';
};

//让过河后的player复位
Player.prototype.resetPlayer = function() {

        // var randomIndex = Math.floor(Math.random() * 3);
    
        var resetPlayer = setTimeout(function() {
            player.y = 5 * HEIGHT;
            player.x = 2 * WIDTH;
            player.jump_distance = 1;
            //主题这里改变地图，地图还是会闪动
            // Engine.changeMap(randomIndex);
            ScoreFlag = true;
            endFlag = true;
            // player.hp = 100;
        }, 300);
        
};

//处理与Enemy或Obstable碰撞的函数,判断是否碰撞，50，80为实验出的经验值
function collision(item) {
    if( (item instanceof Enemy) && ( (item.y === player.y) && (Math.abs(item.x - player.x) < 50) )) {
        return true;
    }
    else if ( (item instanceof Obstacle) && ( (item.y === player.y) && (item.x === player.x) ) ) {
        return true;
    }
    else if ((item instanceof Tiger) &&  ( (item.y === player.y) && (Math.abs(item.x - player.x) < 80) ) ) {
        return true;
    }
    else {
        return false;
    }
}

//处理player与Obstacle碰撞的函数
function checkCollisionsWithObstacle(array) {
     for (var i = 0; i < array.length; i++) {
        if(collision(array[i])) {
            return true;
        }
     }
}

//处理player与Enemy碰撞的函数
Player.prototype.checkCollisionsWithEnemy = function(array) {
    array.forEach(function(element) {
        if(collision(element) && element instanceof Tiger) {
            player.x = element.x;
            
            if((player.x > 4 * WIDTH) & backgroundFlag) {

                var randomIndex = Math.floor(Math.random() * 3);
                Engine.changeMap(randomIndex);
                runWithTiger();
                console.log('到底了');
                backgroundFlag = false;
            }
        }
        else if(collision(element) && element instanceof Enemy) {
            player.hp -= 4;
        }
    }); 
};

//处理player与Obstacle碰撞的函数，但是不起作用，清探究原因
Player.prototype.checkCollisionsWithObstacle = function(array) {
    array.forEach(function(element) {
        collision(element);       
    }); 
};
// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Player.prototype.update = function(dt) {
    
    // 当player到达河对岸的逻辑，此处用ScoreFlag来控制其只触发一次
    if(this.y < HEIGHT) {
        this.y = 0;
        if(ScoreFlag === true) {
            this.score += 100;
            addRandomTreasure(1);
            //以50%概率生成障碍
            var randomProblity = Math.random();
            if(randomProblity < 0.5) {
                addObstacle(1);
            }
          
            ScoreFlag = false;
            backgroundFlag = true;
        }
        this.resetPlayer();


    }
    else if(this.y > 5 * HEIGHT) {
        this.y = 5 * HEIGHT;
    };

    //监控player与Enemy的碰撞
    this.checkCollisionsWithEnemy(allEnemies);
    
    //当player血量低于0，做如下行动
    if(this.hp <= 0 ) {
        if(endFlag === true) {
            endGame();
            endFlag = false;
        }
    }

    //在屏幕显示分数及血量
    $('.hp').html(player.hp);
    $('.score').html(player.score);
    $('.highscore').html(HighScore);
    $('.keynumber').html(player.keynum);
    $('.name').html(Data.userName);

    //如果player走出x的屏幕范围，控制其在屏幕内
    if(this.x < 0) {
        this.x = 0
    }
    else if(this.x > 4 * WIDTH) {
        this.x = 4 * WIDTH;
    }

    //更新记录最高分数
    if(HighScore < this.score) {
        HighScore = this.score;
    }

    //监控player碰到Treasure的事件
    hitTreasure();
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 10);
};


//player 键盘控制函数
Player.prototype.handleInput = function(e) {
    //记录之前的x,y值
    var lastX = this.x,
    lastY = this.y;

    switch(e) {
        case 'left':
            this.x -= player.jump_distance * WIDTH;
            break;
        case 'right':
            this.x += player.jump_distance * WIDTH;
            break;
        case 'up':
            this.y -= player.jump_distance * HEIGHT;
            break;
        case 'down':
            this.y += player.jump_distance * HEIGHT;
            break;
        case 'space':
            removeObstacle();
            // var randomIndex = Math.floor(Math.random() * 3);
            // Engine.changeMap(randomIndex);
            // // Engine.setTimeSpeed(0.2);
            break;
        default:
            return;
    }

    //如果碰撞到obstacle，返回之前记录值，相当于不能移动
    if (checkCollisionsWithObstacle(allObstacles)) {
        this.x = lastX;
        this.y = lastY
     }
};







// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();
var allEnemies = [];
var allObstacles = [];
var allTreasures = [];




//用来获取并改变用户名的函数
var changeName = function() {
    Data.userName = Data.win.prompt('请输入您的尊号', Data.userName) || '没有名字的人';
};


//初始化游戏函数
var initGame = function () {
    changeName();
    player.score = 0;
    player.resetPlayer();
    player.hp = 100;
    player.keynum = 0;
    allEnemies=[];
    allObstacles = [];
    allTreasures = [];
    pavement.reset();
    addObstacle(0);
    addEnemy(Enemy, 5);
    addEnemy(Tiger, 1);
    addRandomTreasure(2);
};

//被老虎带往下一个场景
var runWithTiger = function () {
    allEnemies=[];
    allObstacles = [];
    allTreasures = [];
    pavement.reset();
    addObstacle(1);
    addEnemy(Enemy, 5);
    addEnemy(Tiger, 1);
    addRandomTreasure(2);
};

initGame(); 

//end Game function
function endGame() {
    swal({
            position: 'left',
            type: 'success',
            title: 'Game OVer！！',
            text: '得到 ' + player.score + ' 分,' + '排名' + player.score + '名， ' + ' Winner Winner Chicken Dinner!',
            confirmButtonColor: '#9bcb3c',
            confirmButtonText: '再来一局',
    }).then(function(isConfirm) {
        if(isConfirm) {
            Data.saveUserScore(Data.userName, player.score);
            initGame();
        }
    });
}


//scoreboard


// //


// var max = 10,  offset = 0 ,  result ;     
// var scoreBoardService  = new App42ScoreBoard();   
// gameService.getAllGamesWithPaging(max,offset,{    success: function(object) {    var game = JSON.parse(object);    result = game.app42.response.games.game;  console.log("result is " + result)  },    error: function(error) {    }    });     


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
