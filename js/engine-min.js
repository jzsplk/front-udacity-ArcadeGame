var Engine=function(e){function n(){var e=Date.now(),a=(e-f)/1e3*d;g(a),o(),f=e,k+=a,l.requestAnimationFrame(n)}function a(){t(),f=Date.now(),n()}function g(e){s(e)}function s(e){allEnemies.forEach(function(n){n.update(e)}),player.update()}function i(e){h=w[e]}function o(){var e=h,n=6,a=5,g,s;for(g=0;g<6;g++)for(s=0;s<5;s++)b.drawImage(Resources.get(e[g]),101*s,83*g);r()}function r(){allEnemies.forEach(function(e){e.render()}),allObstacles.forEach(function(e){e.render()}),allTreasures.forEach(function(e){e.render()}),player.render(),coin.render()}function t(){k=0,m(1)}function c(){return k}function m(e){d=e}var p=e.document,l=e.window,u=p.createElement("canvas"),b=u.getContext("2d"),f,k,d=1;u.width=505,u.height=606,p.body.appendChild(u);var w=[["images/water-block.png","images/stone-block.png","images/stone-block.png","images/stone-block.png","images/stone-block.png","images/grass-block.png"],["images/grass-block.png","images/water-block.png","images/water-block.png","images/water-block.png","images/water-block.png","images/grass-block.png"],["images/stone-block.png","images/grass-block.png","images/grass-block.png","images/grass-block.png","images/grass-block.png","images/stone-block.png"]],h=w[0];return Resources.load(["images/stone-block.png","images/water-block.png","images/grass-block.png","images/enemy-bug.png","images/char-boy.png","images/Rock.png","images/Key.png","images/Selector.png","images/Heart.png","images/Gem Blue.png","images/Gem Green.png","images/Gem Orange.png","images/char-cat-girl.png","images/coin-sprite-animation.png","images/astronaut3.png","images/flying-0.png"]),Resources.onReady(a),e.ctx=b,{reset:t,getGamingTime:c,setTimeSpeed:m,changeMap:i,win:l}}(this);