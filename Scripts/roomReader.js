// This is the suite of functions that allows me to parse and render books and pages from a JSON file

//Defaults
var loadedBook = "Assets/small_example_adventure_text_array.json";
var typeSpeed = 10;

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
	div.className = 'typedRoom';
	//Formet Text
	var textString = '';
	var tempString = '';
	for (let i = 0; i < roomData.text_array.length; i+=2) {
		if (i == 0 || roomData.text_array[i - 1].includes('</br>')) {
			textString = '>> ' + roomData.text_array[i + 1];
		} else {
			textString = roomData.text_array[i + 1];
		}
		if (roomData.text_array[i] == true) {
			tempString = div.innerHTML;
			div.innerHTML = tempString + textString;
		} else {
			tempString = div.innerHTML;
			div.innerHTML = tempString + textString;	
		}
	}
	// console.log("textString: " + textString)
	
	
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
	div.className = 'consoleEntry';
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
		if (roomData.text_array[i] == true) { //if we are to type
			for (let n = 0; n < textString.length; n++) {
				//Pull whats already in the div
				tempString = div.innerHTML;
				//add the next char
				div.innerHTML = tempString + textString.charAt(n);
				//Keep the bottom of the typer in view
				div.scrollIntoView(false);
				//Sleep so we get the animation effect
				const result = await sleep();
			}
		} else { //if we are to print, mostly for html tags like span
			tempString = div.innerHTML;
			div.innerHTML = tempString + textString;
			div.scrollIntoView(false);			
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
	div.className = 'consoleEntry';
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
function sleep(ms=typeSpeed) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}

/*
Short Description:

Arguments:
	
	return = None
*/
function setSpeed(str) {
	console.log("Old: " + typeSpeed);
	typeSpeed = inputStringLower.slice(9);
	console.log(typeSpeed);
}