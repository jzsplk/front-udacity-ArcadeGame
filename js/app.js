//这里是我们游戏中的一些常数
var WIDTH = 101,
HEIGHT = 83,
BASIC_SPEED = 100,
HighScore = 0;

var ScoreFlag = true;
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

    matrix.reset();

    return matrix;
})();

//移除obstacle的函数
var removeObstacle = function() {
    if(allObstacles.length === 0) {
        return;
    }

    var randomIndex = Math.floor(Math.random() * allObstacles.length);

    //复原pavement中元素
    var row = allObstacles[randomIndex].y / HEIGHT - 1;
    var col = allObstacles[randomIndex].x / WIDTH;
    pavement[row][col] = false;

    allObstacles.splice(randomIndex ,1);
};

//生成Enemy函数
function addEnemy(num) {
    for(var i = 0; i < num; i++) {
        var enemy = new Enemy();
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
    this.speed = BASIC_SPEED + (50 * Math.ceil(Math.random() * 3));
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
    //为了不让障碍物或宝物生成在同一地点
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
        var obstacle = new Obstacle();
        allObstacles.push(obstacle);
    }
}

//Treasure类为Entity的子类，当player碰到了treasure,treature消失并触发效果
var Treasure = function() {
    Entity.call(this);
};

Treasure.prototype = Object.create(Entity.prototype);
Treasure.prototype.constructor = Treasure;

Treasure.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 15, 60, 105);
}

//Treasure类的子类



// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
// 这是我们的玩家
var Player = function() {
    // Player的默认属性，x,y,hp,score,sprite
    this.x = 3 * WIDTH;
    this.y = 5 * HEIGHT;
    this.hp = 100;
    this.score = 0;
    // player的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/char-boy.png';
};

//让过河后的player复位
Player.prototype.resetPlayer = function() {
    
        var resetPlayer = setTimeout(function() {
            player.y = 5 * HEIGHT;
            player.x = 2 * WIDTH;
            ScoreFlag = true;
            // player.hp = 100;
        }, 300);
        
};

//处理碰撞的函数,判断是否碰撞，50为实验出的经验值
function collision(item) {
    if( (item instanceof Enemy) && ( (item.y === player.y) && (Math.abs(item.x - player.x) < 50) )) {
        return true;
    }
    else if ( (item instanceof Obstacle) && ( (item.y === player.y) && (item.x === player.x) ) ) {
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
        if(collision(element)) {
            player.hp -= element.damage;
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
            ScoreFlag = false;
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
        alert("game over!");
        this.score = 0;
        player.resetPlayer();
        this.hp = 100;
    }

    //在屏幕显示分数及血量
    $('.hp').html(player.hp);
    $('.score').html(player.score);
    $('.highscore').html(HighScore);

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
            this.x -= WIDTH;
            break;
        case 'right':
            this.x += WIDTH;
            break;
        case 'up':
            this.y -= HEIGHT;
            break;
        case 'down':
            this.y += HEIGHT;
            break;
        case 'space':
            removeObstacle();
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
addObstacle(4);
addEnemy(5);



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
