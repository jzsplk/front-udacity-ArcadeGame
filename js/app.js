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
    var col, row;
    

    col = Math.floor(Math.random() * 5);
    row = Math.floor(Math.random() * 4);
    this.x = WIDTH * col;
    this.y = HEIGHT * (row + 1);
    pavement[row][col] = true;
    console.log(pavement);
};



// Obstacle为Entity的子类
var Obstacle = function() {
    Entity.call(this);
    this.sprite = 'images/Rock.png';
    this.kind = 'obstacle';
};

Obstacle.prototype = Object.create(Entity.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.render = function() {
     ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 15, 60, 105);
}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
// 这是我们的玩家
var Player = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = 3 * WIDTH;
    this.y = 5 * HEIGHT;
    this.hp = 100;
    this.score = 0;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
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

//处理碰撞时间的函数,判断是否碰撞，50为实验出的经验值
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

Player.prototype.checkCollisionsWithObstacle = function(array) {
    array.forEach(function(element) {
        collision(element);       
    }); 
};
// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Player.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
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

    this.checkCollisionsWithEnemy(allEnemies);
    

    if(this.hp <= 0 ) {
        alert("game over!");
        this.score = 0;
        player.resetPlayer();
        this.hp = 100;
    }

    $('.hp').html(player.hp);
    $('.score').html(player.score);
    $('.highscore').html(HighScore);

    if(this.x < 0) {
        this.x = 0
    }
    else if(this.x > 4 * WIDTH) {
        this.x = 4 * WIDTH;
    };

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
        default:
            return;
    }

    if (checkCollisionsWithObstacle(allObstacles)) {
        this.x = lastX;
        this.y = lastY
     }
};


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var e1 = new Enemy();
e1.speed = 0;
var allEnemies = [];
var allObstacles = [];
var o1 = new Obstacle();
var o2 = new Obstacle();
allObstacles.push(o1);
allObstacles.push(o2);
addEnemy(5);
var player = new Player();


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
