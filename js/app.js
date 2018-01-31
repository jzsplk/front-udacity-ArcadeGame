//这里是我们游戏中的一些常数
var WIDTH = 101,
HEIGHT = 83,
BASIC_SPEED = 100,
HighScore = 0;


//记录超过玩家的比例
var percent = 0;

//游戏等级，用于控制游戏的分数，难度
var stage = 1;

//为了控制函数触发在update中只触发一次的Flag
var ScoreFlag = true;
var endFlag = true;
var backgroundFlag = true;
var HpFlag = true;

//记录地图上哪些节点被占用，避免在重复位置生成宝物
var pavement = (function() {
    var matrix = [];

    //清空占用节点
    matrix.reset = function() {
        for(var i = 0; i < 4; i++) {
            matrix[i] = [];
            for(var j = 0; j < 5; j++) {
                matrix[i][j] = false;
            }
        }
    };
    //获取被占用的位置数量
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


// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = 3 * WIDTH;
    this.y = 2 * HEIGHT;
    this.speed = BASIC_SPEED;
    this.damage = 4;
    this.level = 1;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.initProperty = function() {
    this.x = -(Math.ceil(Math.random() * 3) * WIDTH);
    this.y = (Math.ceil(Math.random() * 4)) * HEIGHT;
    this.speed = BASIC_SPEED + (50 * Math.ceil(Math.random() * 3)) + 4 * stage;
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

//用于生成Enemy的函数
function addEnemy(name, num) {
    for(var i = 0; i < num; i++) {
        var enemy = new name();
        enemy.initProperty();
        allEnemies.push(enemy);
    }
}

//Cat是动态的Enemy
var Cat = function() {
    // Cat的默认属性，sprite,width,height,ticksPerFrame
    this.height = 73;
    this.width = 1000;
    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.numberOfFrames = 8;
    this.frameIndex = 0;
    this.speed = BASIC_SPEED;
    // cat的图片是一个sprite sheet，用于生成动作
    this.sprite = 'images/flying-0.png';
};

//定义Cat速度跟位置的函数
Cat.prototype.initProperty = function() {
    this.x = -(Math.ceil(Math.random() * 3) * WIDTH);
    this.y = (Math.ceil(Math.random() * 4)) * HEIGHT;
    this.speed = BASIC_SPEED + (10 * Math.ceil(Math.random() * 2));
};

//控制Cat移动的函数
Cat.prototype.move = function(dt) {
    this.x += dt * this.speed; 
};

// 此为游戏必须的函数，用来更新敌人的位置
// tickCount为控制动画的参数
Cat.prototype.update = function(dt) {
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
Cat.prototype.render = function() {

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

//被猫带往下一个场景
var runWithCat = function () {
    allEnemies=[];
    allObstacles = [];
    allTreasures = [];
    pavement.reset();
    addObstacle(1);
    addEnemy(Enemy, 5);
    addEnemy(Cat, 1);
    addRandomTreasure(2);
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
    // console.log(pavement);
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
    //设置各类宝物的权重，根据权重生成宝物
    var HeartWeight = 10,
    KeyWeight = 10,
    BlueGemWeight = 10,
    GreenGemWeight = 10,
    OrangeGemWeight = 10,
    CoinWeight = 10;

    var TotalWeight = HeartWeight + KeyWeight + BlueGemWeight + GreenGemWeight + OrangeGemWeight + CoinWeight;
    //根据各宝物的权重生成宝物
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

//蓝宝石被捡到时触发的函数
    //启动倒计时，不断减少dt
var timerId;

var BlueGemAction = function() {
    leftTime = 5000;
    startTimer();
}

    //倒计时的剩余时间
var leftTime = 0;

    //用于蓝宝石效果的倒计时函数
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

//判断碰到各类宝物后应执行下一步动作的函数
var hitTreasureAction = function(obj) {
    if(obj instanceof Key) {
        player.keynum += 1;
        player.score += 1;
    }
    else if(obj instanceof Heart) {
        if(player.hp < 70) {
            player.hp += 30;
        } else {
            player.hp = 100;
            player.score += 3;
        }
    }
    else if(obj instanceof BlueGem) {
        BlueGemAction();;
    }
    else if(obj instanceof GreenGem) {
        player.jump_distance = 2;
        player.score += 1;
    }
    else if(obj instanceof Coin) {
        player.score += 3 * stage;
    }
    else if(obj instanceof OrangeGem) {
        allEnemies.forEach(function(enemy) {
            enemy.x = - 3 * WIDTH;
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
    //玩家的血量
    this.hp = 100;
    //分数
    this.score = 1;
    //记录钥匙的数量
    this.keynum = 0;
    //保存目前游戏的结果，用于计算排名
    this.result;
    //玩家跳跃的距离
    this.jump_distance = 1;
    // player的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/char-boy.png';
};

//让过河后的player复位
Player.prototype.resetPlayer = function() {
    
            player.y = 5 * HEIGHT;
            player.x = 2 * WIDTH;
            player.jump_distance = 1;
            //复原积分和血量的Flag
            ScoreFlag = true;
            HpFlag = true;
            
        
};

//处理与Enemy或Obstable碰撞的函数,判断是否碰撞，50，80为实验出的经验值
function collision(item) {
    if( (item instanceof Enemy) && ( (item.y === player.y) && (Math.abs(item.x - player.x) < 50) )) {
        return true;
    }
    else if ( (item instanceof Obstacle) && ( (item.y === player.y) && (item.x === player.x) ) ) {
        return true;
    }
    else if ((item instanceof Cat) &&  ( (item.y === player.y) && (Math.abs(item.x - player.x) < 80) ) ) {
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
        if(collision(element) && element instanceof Cat) {
            //如果玩家跟Cat碰撞，玩家“骑到”Cat身上，不掉血
            player.x = element.x;
            //如果玩家骑Cat到屏幕的最右侧，更改游戏背景，重置新场景中的障碍跟宝物
            if((player.x > 4 * WIDTH) & backgroundFlag) {
                //随机换一个游戏背景
                var randomIndex = Math.floor(Math.random() * 3);
                Engine.changeMap(randomIndex);
                //更新新场景中的宝物，障碍
                runWithCat();
                //console.log('到底了');
                backgroundFlag = false;
            }
        }
        else if(collision(element) && element instanceof Enemy) {
            //先暂停游戏画面，让玩家看清发生了什么
            Manager.pauseGame();
            //通过HpFlag控制扣血只发生一次
            if(HpFlag) {
                //甲虫速度越快，造成伤害越高
                player.hp -= (10 + Math.floor(Math.sqrt(element.speed)));
            }
            
            HpFlag = false;

            if(player.hp > 0) {
                //如果玩家没有死亡，玩家回到初始位置并继续游戏
                var collisionTimeout = setTimeout(function() {
                    player.resetPlayer();
                    Manager.continueGame();
                },300); 
            }
        }
    }); 
};

// //处理player与Obstacle碰撞的函数，但是不起作用，清探究原因
// Player.prototype.checkCollisionsWithObstacle = function(array) {
//     array.forEach(function(element) {
//         collision(element);       
//     }); 
// };

// 获取玩家名次的函数
var getPlayerRanking = function(score, results) {
    if (!(results instanceof Array) || score === 1) {
        return '没有';
    }

    

    for(var i = 0; i < results.length; i++) {
        if(results[i].value <= score) {
            //得到玩家超过排行榜其他玩家的比例
            percent = Math.floor(((results.length - (i + 1)) / results.length) * 10000) / 100;
            console.log('results is '+ results);
            console.log('percent is '+ percent);
            //返回玩家的排名
            return i + 1;
        }
    }

    return '反向第一';
};


Player.prototype.update = function(dt) {
    
    // 当player到达河对岸的逻辑，此处用ScoreFlag来控制其只触发一次
    if(this.y < HEIGHT) {
        //玩家不能到屏幕以外
        this.y = 0;
        if(ScoreFlag === true) {
            this.score += stage;
            //以50%概率生成障碍
            var randomProblity = Math.random();
            if(randomProblity < 0.5) {
                addObstacle(1);
            }
          
            ScoreFlag = false;
            backgroundFlag = true;
        }
        //为了玩家看清过河
        var resetPlayerTimeout = setTimeout(function() {
            player.resetPlayer();
        }, 500);
    }
    //玩家不能到屏幕以外
    else if(this.y > 5 * HEIGHT) {
        this.y = 5 * HEIGHT;
    };

    //监控player与Enemy的碰撞
    this.checkCollisionsWithEnemy(allEnemies);
    
    //当player血量低于0，做如下行动
    if(this.hp <= 0 ) {
        //用endFlag控制函数只执行一次
        if(endFlag) {
            endFlag = false;
            //先用save函数获取名次，存储用户数据
            Data.saveUserScore(Data.userName, player.score);
            //保存玩家得到的名次
            player.rank = getPlayerRanking(player.score, player.result);
            //结束游戏
            var rankTimeout = setTimeout(function() {
                endGame();
            },500);
            // console.log('end toggled');
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

    //更新本地记录最高分数
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

//控制stage的游戏循环
var gameStageId;

var startStage = function() {
    var lastStage = stage;
    clearInterval(gameStageId);

    gameStageId = setInterval(function() {
        var timeStage = Engine.getGamingTime() / 5.0,
        scoreStage = Math.sqrt(player.score);
        stage = Math.floor(Math.min(timeStage, scoreStage));

        if(stage !== lastStage) {
            allEnemies.forEach(function(enemy) {
                enemy.level += 1;
                console.log('stage is ' + stage);
            });
            addRandomTreasure(1);
        }
        lastStage = stage;
    }, 1000);

};

//用来获取并改变用户名的函数
var changeName = function() {
    Data.userName = Data.win.prompt('请输入您的尊号', Data.userName) || '没有名字的人';
};

//初始化游戏
var initGame = function () {
    Data.getRankingResults();
    changeName();
    player.score = 1;
    player.resetPlayer();
    player.hp = 100;
    player.keynum = 0;
    allEnemies=[];
    allObstacles = [];
    allTreasures = [];
    pavement.reset();
    addObstacle(1);
    addEnemy(Enemy, 5);
    addEnemy(Cat, 1);
    addRandomTreasure(2);
    stage = 1;
    startStage();
    Manager.continueGame();
};

initGame(); 

//结束游戏函数end Game function
var endGame = function() {
    //弹出游戏接触的界面
    swal({
            position: 'left',
            type: 'success',
            title: 'Game OVer！！',
            text: '得到 ' + player.score + ' 分,' + '排名' + player.rank + '名， ' + '超过了全球' + percent + '%的玩家，Winner Winner Chicken Dinner!',
            confirmButtonColor: '#9bcb3c',
            confirmButtonText: '继续游戏？',
    }).then(function(isConfirm) {
        if(isConfirm) {
            initGame();
            endFlag = true;
        }
    });

}


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
