Manager=function(t){"use strict";var n=t.document,e=n.getElementById("score"),o=n.getElementById("btn-menu"),i=n.getElementById("menu"),a=n.getElementById("btn-ranking"),r=n.getElementById("btn-instruction"),l=n.getElementById("btn-restart"),c=n.getElementById("leader-board"),r=n.getElementById("btn-instruction"),d=n.getElementById("instruction-board"),s=n.getElementById("btn-close-instruction"),u=n.getElementById("operation-panel"),y=n.getElementById("arrow-up"),p=n.getElementById("arrow-down"),g=n.getElementById("arrow-left"),f=n.getElementById("arrow-right"),h=n.getElementById("space"),m=!0,I=function(){i.style.height="200px",i.style.borderBottom="2px solid #251",m=!1},E=function(){i.style.height=0,i.style.borderBottom=0,m=!0};o.onclick=function(t){t.stopPropagation(),m?I():E()},n.onclick=function(){E()},function(){var t=["Ranking","排行榜"];a.innerText=t[1];var n=["Instruction","游戏说明"];r.innerText=n[1];var e=["Restart","重新开始"];l.innerText=e[1]}();var B=!1,b=function(){B?(c.style.display="block",B=!1):(c.style.display="none",B=!0)};if(a.onclick=function(t){t.stopPropagation(),$(".leaderboard").empty(),Data.getTopNRanking(100),b()},l.onclick=function(){initGame()},d.style.height=n.documentElement.clientHeight+"px",r.onclick=function(t){t.stopPropagation(),E(),d.style.display="block"},s.onclick=function(){d.style.display="none"},function(){for(var t=navigator.userAgent,n=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],e=!0,o=0;o<n.length;o++)if(t.indexOf(n[o])>0){e=!1;break}return e}())u.style.display="none";else{u.style.display="block",y.ontouchstart=function(){player.handleInput("up")},p.ontouchstart=function(){player.handleInput("down")},g.ontouchstart=function(){player.handleInput("left")},f.ontouchstart=function(){player.handleInput("right")},space.ontouchstart=function(){player.handleInput("space")},n.addEventListener("touchstart",function(t){t.touches.length>1&&t.preventDefault()});var k=0;n.addEventListener("touchend",function(t){var n=(new Date).getTime();n-k<=500&&t.preventDefault(),k=n},!1)}}(this);