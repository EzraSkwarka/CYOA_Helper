//
/*
Short Description:
	This function exists to see if the user's input is valid and if not to alert the user, this is just a disambuigation function
	
Arguments:
	inputString =  Str, input to be parsed
	
	return = Boolean
*/
function readPlayerInput (inputString) {
	//Clear input box
	var inputBox = document.getElementById("roomNumber");
	inputBox.value = '';
	//Echo input
	renderConsoleEntry([false, inputString], false, true);
	//Simplify input
	inputStringLower = inputString.toLowerCase();
	
	//Test Cases
	
	if (/^goto /.test(inputStringLower)) {
		gotoRoom(inputString);
	} else if (/help/.test(inputStringLower)) {
		helpCommand(inputString);
	} else if (/^load /.test(inputStringLower)) {
		loadBook(inputString);
	} else if (/^roll/.test(inputStringLower)) {
		rollDice(inputString);
	} else if (/^setspeed \d+$/.test(inputStringLower)) {
		setSpeed(inputStringLower);	
	} else if (/^reload$/.test(inputStringLower)) {
		window.location.reload();
	// } else if (/^fontsize \d{1,}(px|em)$/.test(inputStringLower)) {
		// setFont(inputStringLower);
	} else if (/^ls -book/.test(inputStringLower)) {
		listBooks();
	} else {
		renderConsoleEntry([true, "ERROR: INVALID INPUT"], true, false);
	}
	//will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}

/*
Short Description:
	This function outputs the help menu, later it will check to see if a specfic command is reffrenced for a more detailed help command
	
Arguments:
	str =  Str, command to follow up on
	
	return = Boolean
*/
function helpCommand(str) {
	//this will be the default help command, but I'll change it based on the book metadata
	var helpArray = [
		true, "Current commands:",
		false, "</br>",
		true, "&nbsp help &nbsp displays a list of commands",
		false, "</br>",
		true, "&nbsp ls -book &nbsp displays a list of books",
		false, "</br>",
		true, "&nbsp goto [x] &nbsp turns to page x",
		false, "</br>",
		true, "&nbsp load [path] &nbsp loads a specfic book at [path] into memory",
		false, "</br>",
		true, "&nbsp roll [n]d[x] &nbsp rolls n amount of x sided dice",
		false, "</br>",
		true, "&nbsp setspeed [x] &nbsp sets the time in ms between each char type",
		false, "</br>",
		true, "&nbsp reload &nbsp refreshes the page",
		false, "</br>",
		// true, "&nbsp fontSize [x] &nbsp sets the deafult font size in px"
	
	];
	renderConsoleEntry(helpArray);
}

/*
Short Description:
	This function outputs the help menu, later it will check to see if a specfic command is reffrenced for a more detailed help command
	
Arguments:
	str =  Str, command to follow up on
	
	return = None
*/
function loadBook(str) {
	//Slice of the load of the command
	var bookString = String(str).slice(5);
	//Update user
	console.log("Looking for '" + bookString + "'");
	fetch(bookString,
			  { method: "HEAD" }
		).then((res) => {
		  if (res.ok) {
			loadedBookPath = String(bookString);
			renderConsoleEntry([false, "Load '" + bookString + "' success."]);
		  } else {
			renderConsoleEntry([false, "Load '" + bookString + "' failed; File not found."]);
		  }
		});
}

/*
Short Description:
	This function rolls dice based on the users input
	
Arguments:
	str =  Str, the users input string
	
	return = None
*/
function rollDice(str) {
	var strCopy = str;
	//Clean input, i.e. make it lower case
	str = str.toLowerCase().replaceAll(' ', '');
	if (/^roll\d*[d](\d*|\d*[+-]\d*)$/i.test(str)) { //Good input
		//Parse input
		//Slice roll and space
		str = str.slice(4);
		//Find amount
		var amount = str.slice(0, str.indexOf('d'));
		console.log('Amount: ' + amount);
			//Clean str
			str = str.slice(str.indexOf('d') + 1);
			console.log('STR: ' + str);
		//Find modifier
		var findMod = 0;
		if (str.includes('+')) {
			findMod = str.slice(str.indexOf('+') + 1);
			//Clean str
			str = str.slice(0, str.indexOf('+'));
			console.log('STR: ' + str);
		};
		if (str.includes('-')) {
			findMod = str.slice(str.indexOf('-'));
			//Clean str
			str = str.slice(0, str.indexOf('-'));
			console.log('STR: ' + str);
		};
		//find number of sides
		var numSides = str;
	//Preform roll
	var rollArray = []
	var total = 0 + parseInt(findMod);
	for (let i = 0; i < amount; i++) {
		var randomNumber = Math.floor(Math.random() * numSides) + 1;
		rollArray.push(randomNumber);
		total += randomNumber;
	}
	//report
	renderConsoleEntry([true, strCopy + ': ' + rollArray + ' => ' + total])
	//check output
		//renderConsoleEntry([true, "You asked me to roll a die with " + numSides + " sides. I will roll it " + amount + " time(s). Then I will add " + findMod + " to it."]);
	} else { //bad Input
		renderConsoleEntry([true, "It seems you tried to roll some dice but I didn't quite understand you. Remember, to roll dice it needs tyo be in the [n]d[x]+/-[m] form. (including the spaces)"]);
	}
	
	
	
}

/*
Short Description:
	This function rolls dice based on the users input
	
Arguments:
	str =  Str, the users input string
	
	return = None
*/
function setFont(str) {
	str = String(str).slice(9);
	console.log("fontsize: " + str);
	var rooms = document.querySelectorAll('.consoleEntry');
	rooms.forEach(room => {
		room.style.fontSize = str;
	});
	consoleFontSize = str;
	return str
}

/*
Short Description:
	This function renders a room based of user input
	
Arguments:
	str =  Str, the users input string
	
	return = None
*/
async function gotoRoom(str) {
	//Slice of the goto of the command
	inputStringLower = String(inputStringLower).slice(5);

	//Attempt to resolve room ref
	if (/ false$/.test(inputStringLower)) {
		//Slice off false
		inputStringLower = String(inputStringLower).slice(0, -6);
		console.log("Room Input: " + inputStringLower);
		requestRoom(inputStringLower, true);
	} else {
		console.log("Room Input: " + inputStringLower);
		requestRoom(inputStringLower);
	}
}

/*
Short Description:
	This function outputs a list of all current books to the console, built manually
	
Arguments:
	None
	
	return = None
*/
function listBooks() {
	bookList = [
		true, "Currently known books:",
		false, "</br>",
		true, "Assets/Test Adventures/small_example_adventure.json",
		false, "</br>",
		true, "Assets/Test Adventures/small_example_adventure_text_array.json",
		false, "</br>",
		true, "Assets/Test Adventures/small_example_adventure_text_array_two.json",
		false, "</br>",
		true, "Assets/Fighting Fantasy Books/FF02_Citadel_of_Chaos.json"
		];
	renderConsoleEntry(bookList);
}