document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){


// Canvas div myCanvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/* Create the canvas [code for self-created canvas... remove myCanvas if you want to use ------------]

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
*/

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "http://i.imgur.com/CAz8JoL.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "http://i.imgur.com/cdCfnKS.png";

//Adding sounds
var music = new Audio("audio/music.ogg");
music.volume = 0.2;
music.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
var nasty = new Audio("audio/nasty.wav");
var lose = new Audio("audio/lose.wav");
lose.addEventListener('ended', function() {
        if (musicOn) {
        music.play();
        }
    }, false);

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
  speed: 100
};
var monstersKilled = 0;


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	started = true;
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = -100;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (!(hero.y < 10)) {
      		hero.y -= hero.speed * modifier;
      		}
	}
	if (40 in keysDown) { // Player holding down
		if (!(hero.y > canvas.height-70)) {
      		hero.y += hero.speed * modifier;
      		}
	}
	if (37 in keysDown) { // Player holding left
		if (!(hero.x < 10)) {
		hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if (!(hero.x > canvas.width-40)) {
			hero.x += hero.speed * modifier;
		}
	}
	if (77 in keysDown) { // Player holding M
		//toggleMusic();
	}
		if (started) {monster.y += monster.speed * modifier;};

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		//nasty.currentTime = 0;
		//nasty.play();
		++monstersKilled;
    //monster.speed = monster.speed+5;
		reset();
	}

    // Have the zombies won?
  if (monster.y >= canvas.height-32) {
  	music.pause();
  	lose.play();
  	keysDown = [];
  	clearInterval(gameInterval);
  	started = false;
  	alert("Oh no! The bees have stung you!\nYou caught " + monstersKilled + " bees.\nPress OK to continue..");
  	reset();
  	hero.x = canvas.width / 2;
	hero.y = canvas.height - 100;
	monstersKilled = 0;
	monster.speed = 100;
	//started = true;
	gameInterval = setInterval(main, 1);
  }
};

// Draw everything
var render = function () {

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	if (started) {
	//ctx.fillStyle = "rgb(51, 120, 71)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Bees caught " + monstersKilled, 32, 32);
	} else {
	ctx.fillStyle = "rgb(50, 70, 50)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Press any key to start", 32, 32);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Lets play this game!
reset();
var then = Date.now();
//setInterval(main, 1); // Execute as fast as possible


/*  add to top when debugged
 * 
   function oneTimeTasks() {
	gameInterval = setInterval(main, 1);
	started = false;
	musicOn = true;
	music.play();
}

function toggleMusic() {
	if (musicOn) {
	musicOn = false;
	music.pause();
	document.getElementById('toggle-btn').value = "MUSIC OFF";
	} else {
	musicOn = true;
	music.play();
	document.getElementById('toggle-btn').value = "MUSIC ON";
	}
} */
