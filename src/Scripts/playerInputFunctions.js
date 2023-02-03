//

/*
Short Description:
	This function outputs the help menu, later it will check to see if a specfic command is reffrenced for a more detailed help command
	
Arguments:
	str =  Str, command to follow up on
	
	return = Boolean
*/
function helpCommand(str) {
  //this will be the default help command, but I'll change it based on the book metadata
  var helpArray = [];
  fetch("Assets/helpCommands.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      appendData(data);
    })
    .catch(function (err) {
      console.log("error: " + err);
    });
  //called by second .then statment
  function appendData(data) {
    for (var i = 0; i < data.length; i++) {
      helpArray.push(data[i]);
    }
    renderConsoleEntry(helpArray);
  }
}

/*
Short Description:
	This function outputs the help menu, later it will check to see if a specific command is referenced for a more detailed help command
	
Arguments:
	str =  Str, command to follow up on
	
	return = None
*/
function loadBook(str) {
  //Slice of the load of the command
  var bookString = String(str).slice(5);
  //Update user
  console.log("Looking for '" + bookString + "'");
  fetch(bookString, { method: "HEAD" }).then((res) => {
    if (res.ok) {
      loadedBookPath = String(bookString);
      onBookLoad(bookString);
    } else {
      renderConsoleEntry([
        false,
        "Load '" + bookString + "' failed; File not found.",
      ]);
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
  str = str.toLowerCase().replaceAll(" ", "");
  if (/^roll\d*[d](\d*|\d*[+-]\d*)$/i.test(str)) {
    //Good input
    //Parse input
    //Slice roll and space
    str = str.slice(4);
    //Find amount
    var amount = str.slice(0, str.indexOf("d"));
    console.log("Amount: " + amount);
    //Clean str
    str = str.slice(str.indexOf("d") + 1);
    console.log("STR: " + str);
    //Find modifier
    var findMod = 0;
    if (str.includes("+")) {
      findMod = str.slice(str.indexOf("+") + 1);
      //Clean str
      str = str.slice(0, str.indexOf("+"));
      console.log("STR: " + str);
    }
    if (str.includes("-")) {
      findMod = str.slice(str.indexOf("-"));
      //Clean str
      str = str.slice(0, str.indexOf("-"));
      console.log("STR: " + str);
    }
    //find number of sides
    var numSides = str;
    //Preform roll
    var rollArray = [];
    var total = 0 + parseInt(findMod);
    for (let i = 0; i < amount; i++) {
      var randomNumber = Math.floor(Math.random() * numSides) + 1;
      rollArray.push(randomNumber);
      total += randomNumber;
    }
    //report
    renderConsoleEntry([true, strCopy + ": " + rollArray + " => " + total]);
    //check output
    //renderConsoleEntry([true, "You asked me to roll a die with " + numSides + " sides. I will roll it " + amount + " time(s). Then I will add " + findMod + " to it."]);
  } else {
    //bad Input
    renderConsoleEntry([
      true,
      "It seems you tried to roll some dice but I didn't quite understand you. Remember, to roll dice it needs tyo be in the [n]d[x]+/-[m] form. (including the spaces)",
    ]);
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
  // console.log("fontsize: " + str);
  var rooms = document.querySelectorAll(".consoleEntry");
  rooms.forEach((room) => {
    room.style.fontSize = str;
  });
  consoleFontSize = str;
  return str;
}

/*
Short Description:
	This function renders a room based of user input
	
Arguments:
	str =  Str, the users input string
	
	return = None
*/
async function gotoRoom(str) {
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
  bookList = [];
  fetch("Assets/bookList.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      appendData(data);
    })
    .catch(function (err) {
      console.log("error: " + err);
    });
  //called by second .then statment
  function appendData(data) {
    for (var i = 0; i < data.length; i++) {
      bookList.push(data[i]);
    }
    renderConsoleEntry(bookList);
  }
}

/*
Short Description:
	This function responds to a listener to the input box so the user can press the up arrow key to load their previous command(s)
	
Arguments:
	inputLogIndex; int, the target entry to load
	
	return = None
*/
function accessTerminalLog(inputLogIndex) {
  //inputBox
  document.getElementById("roomNumber").value = inputLog.at(inputLogIndex);
}

/*
Short Description:
	Clears all previous entrees by deleting the 'typedroom' children of 'gameText' 
	
Arguments:
	None
	
	return = None
*/
function clearLogScreen() {
  console.log("Clear screen request received");
  var target = document.getElementById("gameText");
  while(target.lastChild) {
    target.removeChild(target.lastChild);
  }
  return;
}
