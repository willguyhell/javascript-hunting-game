//selects the music audio file from index.html
var gameMusic = document.getElementById("music");
//selects the paragraph above the buttons
var buttonInfo = document.getElementById("buttonInfo");

//a function to play the audio file
function startPlayback() {
	return gameMusic.play();
}

//a function to stop the audio file (pauses it and resets the time to zero)
function stopPlayback() {
	gameMusic.currentTime = 0.0;
	return gameMusic.pause();
}

//Attempts to play the audio file automatically
startPlayback().then(function() {
	console.log('The play() Promise fulfilled! Rock on!');
	//catches any errors
}).catch(function(error) {
	console.log('The play() Promise rejected!');
	console.log('Use the Play button instead.');
	console.log(error);

	//displays a notification about the error
	buttonInfo.innerHTML = "Your browser doesn't allow music to play automatically"

	//shows a play and stop button defined in index.html
	var playButton = document.querySelector('#play');
	var stopButton = document.querySelector('#stop');
	playButton.hidden = false;
	//clicking the play button starts the startPlayback function
	playButton.addEventListener('click', startPlayback);
	stopButton.hidden = false;
	stopButton.addEventListener('click', stopPlayback);
});