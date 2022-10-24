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
	requestRoom(x);
	//will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}

function printRoom(roomData, mainContainer) {
	//Create new container
	var div = document.createElement("div");
	//Formet Text
	div.innerHTML = (
		roomData.ID + '   ' + roomData.short_name + '<br><br>' +
		roomData.entry_text + '<br><br>' +
		roomData.exit_text + '<br><br>'
		
		
		
		);
	//Append to Parent
	mainContainer.appendChild(div);
	
}

function typeRoom(roomData, mainContainer) {

	var customNodeCreator = function(character) {
		return document.createTextNode(character);
	}
	var div = document.createElement("div");
	mainContainer.appendChild(div);

	var typewriter = new Typewriter(div, {
	loop: false,
	delay: 25,
	onCreateTextNode: customNodeCreator,
	});

	var textString = String((
		roomData.ID + ' - ' + roomData.short_name + '<br><br>' +
		roomData.entry_text + '<br><br>' +
		roomData.exit_text
		));
	typewriter
	.typeString(textString)
	.typeString('test')
	.pauseFor(300)
	.start();
}