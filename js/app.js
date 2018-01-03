//这里是我们游戏中的一些常数
var WIDTH = 101,
HEIGHT = 83,
BASIC_SPEED = 100;

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

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
// 这是我们的玩家
var Player = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = 3 * WIDTH;
    this.y = 5 * HEIGHT;
    this.hp = 100;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/char-boy.png';
};

//让过河后的player复位
Player.prototype.resetPlayer = function() {
    
        var resetPlayer = setTimeout(function() {
            player.y = 5 * HEIGHT;
            player.x = 2 * WIDTH;
            player.hp = 100;
        }, 500);
        
};

//处理碰撞时间的函数,判断是否碰撞，50为实验出的经验值
function collision(item) {
    return ( (item.y === player.y) && (Math.abs(item.x - player.x) < 50) );
}

//处理player与Enemy碰撞的函数
Player.prototype.checkCollisions = function(array) {
    array.forEach(function(element) {
        if(collision(element)) {
            player.hp -= element.damage;
            console.log(player.hp);
            // player.resetPlayer();
        }
    });
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Player.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if(this.y < HEIGHT) {
        this.y = 0;
        this.resetPlayer();
    }
    else if(this.y > 5 * HEIGHT) {
        this.y = 5 * HEIGHT;
    };

    this.checkCollisions(allEnemies);

    if(this.hp < 0 ) {
        alert("game over!");
        player.resetPlayer();
    }

    $('.hp').html(player.hp);

    if(this.x < 0) {
        this.x = 0
    }
    else if(this.x > 4 * WIDTH) {
        this.x = 4 * WIDTH;
    };

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 10);
};

//player 键盘控制函数
Player.prototype.handleInput = function(e) {

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
    }
};


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];
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
