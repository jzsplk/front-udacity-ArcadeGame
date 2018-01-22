Manager = (function(global) {
    'use strict';

    /* 下面这些DOM元素用来反应游戏状态 */
    var doc = global.document,
        scoreTxt = doc.getElementById('score'),
        menuButton = doc.getElementById('btn-menu'),
        menu = doc.getElementById('menu'),
        rankingButton = doc.getElementById('btn-ranking'),
        instructionButton = doc.getElementById('btn-instruction'),
        restartButton = doc.getElementById('btn-restart'),
        leaderBoard = doc.getElementById('leader-board');
    
    //添加菜单的响应事件
    var isMenuHidden = true;
    var showMenu = function() {
        menu.style.height = '200px';
        menu.style.borderBottom = '2px solid #251';
        isMenuHidden = false;
    };
    var hideMenu = function() {
        menu.style.height = 0;
        menu.style.borderBottom = 0;
        isMenuHidden = true;
    };

    //添加菜单的点击事件
    menuButton.onclick = function(e) {
        e.stopPropagation();
        if(isMenuHidden) {
            showMenu();
        } else {
            hideMenu();
        }
    };

    /* 除菜单按钮和下面的角色按钮外，点击屏幕中的其它区域都会让菜单栏隐藏 */
    doc.onclick = function() {
        hideMenu();
    };


    /* 给游戏标题栏，以及菜单栏的按钮，按语言设定起好对应的名字 */
    var initDomText = function() {
        var rankingButtonWords = ['Ranking', '排行榜'];
        rankingButton.innerText = rankingButtonWords[1];
        var instructionButtonWords = ['Instruction', '游戏说明'];
        instructionButton.innerText = instructionButtonWords[1];
        var restartButtonWords = ['Restart', '重新开始'];
        restartButton.innerText = restartButtonWords[1];
    };

    initDomText();

    //排行榜toggle函数
    var isRankingHidden = false;
    var toogleRanking = function() {
        if(isRankingHidden) {
            leaderBoard.style.display = 'block';
            isRankingHidden = false;
        } else {
            leaderBoard.style.display = 'none';
            isRankingHidden = true;
        }
    };

    //点击排行榜按钮，弹出排行榜
    rankingButton.onclick = function(e) {
        e.stopPropagation();
        // hideMenu();
        $('.leaderboard').empty();
        Data.getTopNRanking(100);
        toogleRanking();
    };

    restartButton.onclick = function() {
        initGame();
    };

    // //初始化游戏函数
    // var initGame = function () {
    //     Data.changeName();
    //     player.score = 0;
    //     player.resetPlayer();
    //     player.hp = 100;
    //     player.keynum = 0;
    //     allEnemies=[];
    //     allObstacles = [];
    //     allTreasures = [];
    //     pavement.reset();
    //     addObstacle(0);
    //     addEnemy(Enemy, 5);
    //     addEnemy(Tiger, 1);
    //     addRandomTreasure(2);
    // };

    // initGame();
    

    // return {
    //    initGame: initGame
    // };

})(this);