function requestRoom(ID_target) {
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
				if(data[i].ID == ID_target) {
					// console.log("Typing Room " + String(data[i]) + "in element " + String(mainContainer))
					typeRoom(data[i], mainContainer)
				}
            }
        }
}

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


function readRoomInput (x) {
	console.log("Room Input: " + String(x))
	requestRoom(x);
	//will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}

function printRoom(roomData, mainContainer) {
	//Create new container
	var div = document.createElement("div");
	//Formet Text
	div.innerHTML = String((
		roomData.ID + '   ' + roomData.short_name + '<br><br>' +
		roomData.entry_text + '<br><br>' +
		roomData.exit_text + '<br><br>'
		
		
		
		));
	//Append to Parent
	mainContainer.appendChild(div);
	
}

function typeRoom(roomData, mainContainer) {
	
	//Create new container
	var div = document.createElement("div");
	mainContainer.appendChild(div);
	// console.log("Child: " + String(div))


	//Formet Text --> need to break into own function that packages the text with tags to know if they are to be typed or rendered at once (i.e. a string of flavor text or a new line command)
	var textString = String((
		roomData.ID + ' - ' + roomData.short_name + '<br><br>' +
		roomData.entry_text + '<br><br>' +
		roomData.exit_text
		));
	// console.log("textString: " + textString)
	
	//Append to Parent
	appearChars(textString, div, 20)
	
}

/** make text appear in the innerHTML of the element, one character at a time per timeBetween via: Unknown, credit needed*/
function appearChars(str, elem, timeBetween) {
    var index = -1;
    (function go() {
        if (++index < str.length) {
         	elem.innerHTML = elem.innerHTML + str.charAt(index);
            setTimeout(go, timeBetween);
        }
    })();
}