/*
Short Description:
	This function exists to see if the user's input is valid and if not to alert the user, unfinished
	
Arguments:
	inputString =  Str, input to be parsed
	
	return = Boolean
*/
function readPlayerInput (inputString) {
	//Echo input
	logToPlayerConsole(inputString);
	//Simplify input
	inputStringLower = inputString.toLowerCase();
	//Test Cases, a switch case will be better eventually probably, and maybe use regular expressions instead of string.include, but thats a later problem
	if (inputStringLower.includes('goto ')) {
		//Slice of the goto of the command
		inputStringLower = String(inputStringLower).slice(5)
		console.log("Room Input: " + inputStringLower)
		//Attempt to resolve room ref
		requestRoom(inputStringLower);
	} else if (inputStringLower.includes('help')){
		//Eventually needs to display all possible commands and a short description to go with them
		logToPlayerConsole("HELP MESSAGE, type goto 1")
	} else if (inputStringLower.includes('load ')){
		//Slice of the load of the command
		inputString = String(inputString).slice(5)
		//Update user
		logToPlayerConsole("Attempting to load '" + inputString + "'");
		//change loaded book, does not check to see if book exists
		loadedBook = String(inputString);
	} else if (inputString.includes('roll ')){
		//Slice of the load of the command
		inputString = String(inputString).slice(6)
		result = Math.floor(Math.random() * inputString);
		logToPlayerConsole("Rolling a d" + inputString + ": " + result);
		
	} else {
		logToPlayerConsole("ERROR: INVALID INPUT", false);
	}
	//will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}