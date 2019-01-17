//event listener to make sure everything loads before running the script
window.addEventListener('load', function(){
	//constants (I set them the same as the canvas. No point setting them twice)
	var GAME_WIDTH = myCanvas.width;
	var GAME_HEIGHT = myCanvas.height;

	console.log(GAME_WIDTH, GAME_HEIGHT);

	//sets the default status of the game to running
	var gameLive = true;

	//current level
	var level = 1;


	//set a random y position for enemies each time the game loads
	//var randomEnemyYPosition = Math.floor(Math.random() * GAME_HEIGHT + 1);
	//console.log(randomEnemyYPosition);

	//enemies
	var enemies = [
		{
			x: 100,
			y: 0,
			speedY: 1,
			w: 40,
			h: 40
		},
		{
			x: 230,
			y: 0,
			speedY: 2,
			w: 40,
			h: 40
		},
		{
			x: 340,
			y: 0,
			speedY: 4,
			w: 40,
			h: 40
		},
		{
			x: 450,
			y: 0,
			speedY: -2,
			w: 40,
			h: 40
		}
	];

	//custom code! Set a random starting y position for each enemy
	enemies.forEach( function(element, index){
		element.y = Math.floor(Math.random() * GAME_HEIGHT + 1);
	});

	//player object
	var player = {
		x: 10,
		y: 160,
		speedX: 2,
		w: 40,
		h: 40,
		isMoving: false, //set the default status as not moving
	};

	//goal object
	var goal = {
		x: 580,
		y: 160,
		w: 35,
		h: 35
	};

	//empty sprites object
	var sprites = {};

	//make the player move
	var movePlayer = function(){
		player.isMoving = true;
	};

	//make the player stop
	var stopPlayer = function(){
		player.isMoving = false;
	};

	//grab the canvas and context
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	//event listeners to move player
	//mouse events
	//canvas.onmousedown = function(){movePlayer()};
	canvas.addEventListener("mousedown", movePlayer);
	//canvas.onmouseup = function(){stopPlayer()};
	canvas.addEventListener("mouseup", stopPlayer);
	//touch listeners
	canvas.addEventListener("touchstart", movePlayer);
	canvas.addEventListener("touchend", stopPlayer);

	//load the sprites
	var load = function() {
		//creates a new image
		sprites.player = new Image();
		//points to the source of the image
		sprites.player.src = 'images/joe.jpg';

		sprites.background = new Image();
		sprites.background.src = 'images/parallax-mountain.jpg';

		sprites.enemy = new Image();
		sprites.enemy.src = 'images/enemy.png';

		sprites.goal = new Image();
		sprites.goal.src = 'images/elk.png';
	};

	//update the logic
	var update = function() {

		//check if you've won the game
		if(checkCollision(player, goal)) {
			var soundEffect = document.getElementById("arrow");
			soundEffect.play();

			/*

			////////////////////////////
			
			CHALLENGE - MULTI-LEVEL GAME

			- When the player reaches the goal, instead of reloading the page, we will increase the "level" variable (declared on line 49).
			- Every time you reach a new level, the player needs to start in its original position.
			- Every time you reach a new level, make the enemies go faster by increasing their speed by 1.
			- Hint: when the enemies are moving upwards, their speed is negative. Be careful not to make them slower.

			////////////////////////////

			*/

			console.log('You have completed level ' + level);
			//level += 1;
			level ++;
			player.x = 10;
			console.log('Level ' + level);

			enemies.forEach(function(element){
				//element.speedY = element.speedY + element.speedY/Math.abs(element.speedY);
				element.speedY += element.speedY/Math.abs(element.speedY);
			});

			//resets the level after completing level 2
			if(level >= 3) {
				gameLive = false;
				alert('You won!')
				window.location = "";
			};
			
		}

		//update player
		if(player.isMoving) {
			//player.x = player.x + player.speedX;
			player.x += player.speedX;
		}
		
		//var i = 0;
		//var n = enemies.length;

		//update the position of all enemies
		enemies.forEach(function(element, index){
			//check for collision with player
			if(checkCollision(player, element)) {
				//if there is a collision, stop the game
				var soundEffect = document.getElementById("scream");
				soundEffect.play();
				gameLive = false;
				//give the user an alert
				alert('You got eaten!');
				//reload the page
				window.location = "";
			}

			//move enemy
			//element.y = element.y +
			element.y += element.speedY;

			//check borders and reverse the speed if at the edge
			if(element.y <= 0) {
				element.y = 0;
				//element.speedY = element.speedY * -1;
				element.speedY *= -1;
			}
			else if(element.y >= GAME_HEIGHT - 40) {
				element.y = GAME_HEIGHT - 40;
				element.speedY *= -1;
			}
		});
	};

	//show the game on the screen
	var draw = function() {
		//clear the canvas
		ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		//draw background first as images are layered in order. 0, 0 coordinates to load from top left corner and fills entire space
		//have loaded this straight into the canvas as a background image so it doesn't get called multiple times per second
		//ctx.drawImage(sprites.background, 0, 0);

		//draw the player
		//ctx.fillStyle = "#00FF00";
		//ctx.fillRect(player.x, player.y, player.w, player.h);
		//coordinates player.x and player.y updates all the time so the sprite is drawn on top of the player
		ctx.drawImage(sprites.player, player.x, player.y);
		
		//draw all enemies
		/*ctx.fillStyle = "#3333FF";
		enemies.forEach(function(element, index){
			ctx.fillRect(element.x, element.y, element.w, element.h);
		});*/
		enemies.forEach(function(element, index){
			ctx.drawImage(sprites.enemy, element.x, element.y);
		});

		//draw goal
		//ctx.fillStyle = "#FFD700";
		//ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
		ctx.drawImage(sprites.goal, goal.x, goal.y);
	};

	//gets executed multiple times per second
	var step = function() {

		update();
		draw();

		if(gameLive) {
		window.requestAnimationFrame(step);
		}
	};

	//check collision by comparing the distances between the 2 rectangles
	var checkCollision = function(rect1, rect2) {
		//if the distance between rectangle 1 and 2 is less than or equal to the max value of the 2 widths, it means they're too close
		var closeOnWidth = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
		var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);

		return closeOnWidth && closeOnHeight;
	};

	//load sprites
	load();
	//initial kick
	step();
});