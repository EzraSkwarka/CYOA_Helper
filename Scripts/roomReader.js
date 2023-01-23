// This is the suite of functions that allows me to parse and render books and pages from a JSON file

//Defaults
var loadedBookPath = "Assets/Test Adventures/small_example_adventure_text_array.json";
var typeSpeed = 10;
var consoleFontSize = '1em';
var styleTagText = "";


/*
Short Description:
	Creates a new div as a child of #gameText and returns a refrence to it, also updates the DOM which will eventually be its own function
	
Arguments:
	None
	
	return = div, a refrence
*/

function createConsoleEntry() {
	//Create new container
	var div = document.createElement("div");
	//Append to Parent
	var mainContainer = document.getElementById('gameText')
	mainContainer.appendChild(div);
	//Set Class
	div.className = 'typedRoom';
	//Update DOM
	consoleFontSize = setFont("fontsize " + consoleFontSize);
	
	return div
}

/*
Short Description:
	This function reads a whole book so it can return and render a single page, I would eventually like to have each of those be there own tasks so as not to parse the entire book each time
Arguments:
	ID_target = int, this is the page number to be rendered
	print = boolean, defaults to false, if true skips the char by char render effect and drops then whole page at once
	
	return = None
*/
function requestRoom(ID_target, print = false) {
	//Add a check here so see if a book has already been loaded
	fetch(loadedBookPath)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                appendData(data);
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });
		//called by second .then statment
        function appendData(data) {
            for (var i = 0; i < data.length; i++) {
				if(data[i].ID == ID_target) {
					renderConsoleEntry(data[i].text_array, !print);
					break;
				}
            }
        }
		
		
}


/*
Short Description:
	This function should handle all the rendering and typing to the console. Needs to be albe to type the tex or print it and it needs to be able to flag if its an echo or a response
	
Arguments:
	textArray = Array, in the same format as the rooms
	animate = Boolean, default false, if the text needs to go up char by char or entry by entry (print vs type)
	fromPlayer = Boolean, default false, should the line start with '>> ' or whats in the consoleID span from main
	
	return = None
*/
async function renderConsoleEntry(textArray, animate = false, fromPlayer = false) {
	//Create Container
	var div = createConsoleEntry();
	if (textArray == []) {
		console.log("Empty textArray given to renderConsoleEntry");
		return false;
	}
	//Render Text 
		//Grab frontString
		if (fromPlayer) {
			var frontString = String(document.getElementById("consoleID").textContent);
		} else {
			var frontString = '>> ';
		}
		//Formet Text --> need to break into own function that packages the text with tags to know if they are to be typed or rendered at once (i.e. a string of flavor text or a new line command)
		var textString = '';
		var tempString = '';
		var i = 0;
		for (let i = 0; i < textArray.length; i+=2) {
			//Apply identifier on first pass
			if (i == 0) {
				textString = frontString + textArray[i + 1];
			} else {
				textString = textArray[i + 1];
			}
			
			//Type this block or print it
			if (textArray[i] == true && animate) { //if we are to type
				var n = 0;
				var inSpan = false;
				for (n; n < textString.length; n++) {
					//Pull whats already in the div
					tempString = div.innerHTML;
					//See Issue #23, this is where that check will need to go

					//Enter a span tag
					if (textString.slice(n, n + 5) == '<span') {
						inSpan = true;
						// console.log('Found "<" tag at n: ' + n)
						//find closing '>' tag
						var x = distanceToClosingTag(textString, n);
						// console.log('Found ">" ' + x + 'chars away');
						//capture tag
						var tagText = textString.slice(n, x + 1);
						//add the tag onto tempString
						tempString += tagText;
						//update n
						n = x + 1;
						div.innerHTML = tempString + textString.charAt(n) + '</span>';
						
					}
					//if ready to leave the span tag
					else if (inSpan && textString.slice(n, n + 7) == '</span>') {
						// console.log('Closing <span>')
						tempString += '</span>';
						n += 6;
						inSpan = false;
						
					}
					//if in a span tag abut not ready to leave
					else if (inSpan) {
						//Slice off the '</span>'
						tempString = tempString.slice(0,-7)
						div.innerHTML = tempString + textString.charAt(n);
						
					}
					else {
					//add the next char
					div.innerHTML = tempString + textString.charAt(n);
					}
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
	//Keep bottom of gameText in view
	div.scrollIntoView(false);
}

function distanceToClosingTag(str, base) {
	var x = base;
	for (x; x < str.length; x++) {
		if (str.charAt(x) == '>') {
			return x;
		}
	}
	
	
}

/*
Short Description:
	Used to handle room clicks from the text log smoothly by calling the approbrate log and print functions
	
Arguments:
	roomID = Int, the room to print
	
	return = None
*/
function clickRoom(roomID) {
	renderConsoleEntry([false, 'goto ' + String(roomID)], false, true)
	requestRoom(roomID);
}

/*
Short Description:
	creates a delay so that the terminal can have a typing effect

Arguments:
	ms = Int, time in ms that this function will cause the excution string to hang, must be accompined by an await inside an async function
	
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
	Modifies the default typeSpeed used in the sleep function, my not be strictly needed
	
Arguments:
	str = String, passed from playerInput.js
	
	return = None
*/
function setSpeed(str) {
	// console.log("Old: " + typeSpeed);
	typeSpeed = inputStringLower.slice(9);
	// console.log(typeSpeed);
}