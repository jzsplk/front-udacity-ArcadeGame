//定义游戏中常量
var WIDTH = 101;
var HEIGHT = 80;

// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/xiong-1.png';
};

//敌人初始化位置的函数
Enemy.prototype.initPosition = function() {
    this.x = - (WIDTH * (Math.ceil(Math.random() * 3)));
    this.y = HEIGHT * (Math.ceil(Math.random() * 4));
    this.speed = 90 + (100 * (Math.random() * 3));
};


// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.move(dt);
    if(this.x >WIDTH * 5) {
        this.initPosition();
    }
    this.checkCollisions();

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 40);
};

// 移动函数，让敌人移动
Enemy.prototype.move = function(dt) {
    this.x += this.speed*dt;
};

// 碰撞函数,负责监测碰撞的逻辑
Enemy.prototype.checkCollisions = function() {
    if((this.y === player.y) && (Math.abs(this.x -player.x) < 50)) {
        player.sprite = 'images/xiong-1.png';
        player.y = 500;
    }
};

// 2 这是我们的玩家要躲避的敌人2 
var Enemy1 = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/1511.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy1.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.move(dt);
    if(this.x > 5 * WIDTH) {
        this.initPosition();
    }
    this.checkCollisions();

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy1.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y+60, 80 , 80);
};

Enemy1.prototype.initPosition = function() {
    this.x = - (WIDTH * (Math.ceil(Math.random() * 3)));
    this.y = HEIGHT * (Math.ceil(Math.random() * 4));
    this.speed = 90 + (100 * (Math.random() * 3));
};

// 移动函数，让敌人移动
Enemy1.prototype.move = function(dt) {
    this.x += this.speed*dt;
};

// 碰撞函数,负责监测碰撞的逻辑
Enemy1.prototype.checkCollisions = function() {
    if((this.y === player.y) && (Math.abs(this.x -player.x) < 50)) {
        player.sprite = 'images/tu-1.png';
        player.y = HEIGHT * (Math.ceil(Math.random() * 4));
    }
};
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.sprite = 'images/tu-1.png';
};

Player.prototype.update = function(dt) {
    if(this.y < 0) {
        this.y = 400
    }
    else if(this.y > 400) {
        this.y = 400;
    }

    if(this.x <0) {
        this.x = 0;
    }
    else if(this.x > 405) {
        this.x = 405;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y+40);
};

Player.prototype.handleInput = function(e) {
    if(e === 'left') {
        this.x -= 100;
    }
    if(e === 'right') {
        this.x +=  100;
    }
    if(e === 'up') {
        this.y -= 80;
    }
    if(e === 'down') {
        this.y += 80;
    }
    if(e === 'space') {
        this.sprite = 'images/tu-1.png'
    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var e1 = new Enemy(),
e2 = new Enemy(),
e3 = new Enemy(),
e4 = new Enemy();
e1.x = 300;
e1.y = 80;
e2.x = 100;
e2.y = 240;
e3.x = 200;
e3.y = 160;
e4.x = 50;
e4.y = 80;
e1.speed = 80;
e2.speed = 100;
e3.speed = 120;
e4.speed = 200;
var e5 = new Enemy1();
e5.x = 0;
e5.y = 320;
e5.speed = 100;
var allEnemies = [e1, e2, e3, e4,e5];
var player = new Player();
player.x = 100;
player.y = 400;
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
