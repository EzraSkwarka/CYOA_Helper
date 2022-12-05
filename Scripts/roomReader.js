// This is the suite of functions that allows me to parse and render books and pages from a JSON file


var loadedBook = "Assets/small_example_adventure_text_array.json";

/*
Short Description:
	This function reads a whole book so it can return and render a single page, I would eventually like to have each of those be there own tasks so as not to parse the entire book each time
Arguments:
	ID_target = int, this is the page number to be rendered
	print = boolean, defaults to false, if true skips the char by char render effect and drops then whole page at once
	
	return = None
*/
function requestRoom(ID_target, print = false) {
	fetch(loadedBook)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                appendData(data);
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });
        function appendData(data) {
            var mainContainer = document.getElementById("gameText");
            for (var i = 0; i < data.length; i++) {
				if(data[i].ID == ID_target) {
					// console.log("Typing Room " + String(data[i]) + "in element " + String(mainContainer))
					if (print) {
						printRoom(data[i], mainContainer)
					} else {
						typeRoom(data[i], mainContainer)
					}
				}
            }
        }
}


/*
Short Description:
	I think this is intended to print multiple rooms at once, but Im not sure it is used anywhere or even works tbh
Arguments:
	ID_target_min: int
	ID_target_max: int
	
	return = None
*/
function requestRoomRange(ID_target_min, ID_target_max) {
	fetch("Assets/small_example_adventure.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                appendData(data);
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });
        function appendData(data) {
            var mainContainer = document.getElementById("gameText");
            for (var i = 0; i < data.length; i++) {
				if(and((data[i].ID >= ID_target_min),(data[i].ID <= ID_target_max)) ) {
					//Create new container
					var div = document.createElement("div");
					//Formet Text
					div.innerHTML = 'Name: ' + data[i].short_name;
					//Append to Parent
					mainContainer.appendChild(div);
				}
            }
        }
}


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
	inputString = inputString.toLowerCase();
	//Test Cases, a switch case will be better eventually probably, and maybe use regular expressions instead of string.include, but thats a later problem
	if (inputString.includes('goto ')) {
		//Slice of the goto of the command
		inputString = String(inputString).slice(5)
		console.log("Room Input: " + inputString)
		//Attempt to resolve room ref
		requestRoom(inputString);
	} else if (inputString.includes('help')){
		//Eventually needs to display all possible commands and a short description to go with them
		logToPlayerConsole("HELP MESSAGE, type goto 1")
	} else if (inputString.includes('load ')){
		//Slice of the load of the command
		inputString = String(inputString).slice(5)
		//Update user
		logToPlayerConsole("Attempting to load '" + inputString + "'");
		//change loaded book, does not check to see if book exists
		loadedBook = String(inputString);
	} else {
		logToPlayerConsole("ERROR: INVALID INPUT", false);
	}
	//will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}


/*
Short Description:
	This function renders a room if its name is valid in a single formated block
	
Arguments:
	roomData: an array pulled from the JSON file containing all data about a given room
	mainContianer: Element refrence, the refrence of where to render the text div, will be appended as a seperate child with no class or id
	
	return = None
*/
function printRoom(roomData, mainContainer) {
	//Create new container
	var div = document.createElement("div");
	//Append to Parent
	mainContainer.appendChild(div);
	//Formet Text
	var textString = '';
	var tempString = '';
	for (let i = 0; i < roomData.text_array.length; i+=2) {
		if (roomData.text_array[i] == true) {
			tempString = div.innerHTML;
			div.innerHTML = tempString + roomData.text_array[i + 1];
		} else {
			tempString = div.innerHTML;
			div.innerHTML = tempString + textString;	
		}
	}
	console.log("textString: " + textString)
	
	
}

/*
Short Description:
	This function renders a room if its name is valid in a formated block one char at a time at a fixed speed
	
Arguments:
	roomData: an array pulled from the JSON file containing all data about a given room
	mainContianer: Element refrence, the refrence of where to render the text div, will be appended as a seperate child with no class or id
	
	return = None
*/
async function typeRoom(roomData, mainContainer) {
	
	//Create new container
	var div = document.createElement("div");
	//Append to Parent
	mainContainer.appendChild(div);
	// console.log("Child: " + String(div))

	//Formet Text --> need to break into own function that packages the text with tags to know if they are to be typed or rendered at once (i.e. a string of flavor text or a new line command)
	var textString = '';
	var tempString = '';
	var i = 0;
	for (let i = 0; i < roomData.text_array.length; i+=2) {
		if (i == 0 || roomData.text_array[i - 1].includes('</br>')) {
			textString = '>> ' + roomData.text_array[i + 1];
		} else {
			textString = roomData.text_array[i + 1];
		}
		if (roomData.text_array[i] == true) {
			for (let n = 0; n < textString.length; n++) {
				tempString = div.innerHTML;
				div.innerHTML = tempString + textString.charAt(n);
				const result = await sleep();
			}
			//I need to find a way to type the text one char at a time, I keep runninginto async issues where if I call another function inside this for loop the loop continues excuting while that function runs
		} else {
			tempString = div.innerHTML;
			div.innerHTML = tempString + textString;	
		}
	}
}


/*
Short Description:
Logs the player's input to the console

Arguments:
	logString = String, what to insert to the console
	
	return = None
*/
function logToPlayerConsole(logString, fromPlayer = true) {
	if (fromPlayer) {
		var frontString = String(document.getElementById("inputBoxLeft").textContent);
	} else {
		var frontString = '>> ';
	}
	//Create new container
	var mainContainer = document.getElementById("gameText");
	var div = document.createElement("div");
	//Append to Parent
	mainContainer.appendChild(div);
	div.innerHTML = frontString + logString;
	
}

/*
Short Description:
	Used to handle room clicks from the text log smoothly by calling the approbrate log and print functions
	
Arguments:
	roomID = Int, the room to print
	
	return = None
*/
function clickRoom(roomID) {
	logToPlayerConsole('goto ' + String(roomID));
	requestRoom(roomID);
}

/*
Short Description:

Arguments:
	
	return = None
*/
function sleep(ms=10) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}
