//
/*
Short Description:
	This function exists to see if the user's input is valid and if not to alert the user, this is just a disambiguation function
	
Arguments:
	inputString =  Str, input to be parsed
	
	return = Boolean
*/
async function readPlayerInput(inputString) {
  //Clearing input box handled by the call
  while (renderingConsoleEntry) { //stop any ongoing prints
    setInterrupt();
    // console.log("readPlayerInput Sleeping.")
    const result = await sleep(1); //sleep so it doesn't fire to fast
  }
  //Echo input
  renderConsoleEntry([false, inputString], false, true);
  while (renderingConsoleEntry) { //stop any ongoing prints
    setInterrupt();
    // console.log("readPlayerInput Echo Sleeping.")
    const result = await sleep(1); //sleep so it doesn't fire to fast
  }
  //Simplify input
  inputStringLower = inputString.toLowerCase();

  //Test Cases

  if (/^goto /.test(inputStringLower)) {
    //Slice off the goto of the command
    inputStringLower = String(inputStringLower).slice(5);
    gotoPage(inputStringLower);
  } else if (/^turn to /.test(inputStringLower)) {
    //Slice off the turn to of the command
    inputStringLower = String(inputStringLower).slice(8);
    gotoPage(inputStringLower);
  } else if (/help/.test(inputStringLower)) {
    helpCommand(inputString);
  } else if (/^open /.test(inputStringLower)) {
    openBook(inputString);
  } else if (/^roll/.test(inputStringLower)) {
    rollDice(inputString);
  } else if (/^setSpeed \d+$/.test(inputStringLower)) {
    setSpeed(inputStringLower);
  } else if (/^reload$/.test(inputStringLower)) {
    window.location.reload();
    // } else if (/^fontsize \d{1,}(px|em)$/.test(inputStringLower)) {
    // setFont(inputStringLower);
  } else if (/^ls -book/.test(inputStringLower)) {
    listBooks();
  } else if (/^stop$/.test(inputStringLower)) {
    setInterrupt();
  } else if (/^cls$/.test(inputStringLower)) {
    clearLogScreen();
  } else if (/^setFont/.test(inputStringLower)) {
    changeDefaultFont(inputString);
  } else {
    renderConsoleEntry([true, "ERROR: INVALID INPUT"], true, false);
  }
  //will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}

/*
Short Description:
	This function outputs the help menu, later it will check to see if a specific command is referenced for a more detailed help command
	
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
  //called by second .then statement
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
function openBook(str) {
  //Slice of the load of the command
  var bookString = String(str).slice(5);
  //Update user
  console.log("Looking for '" + bookString + "'");
  fetch(bookString, { method: "HEAD" }).then((res) => {
    if (res.ok) {
      loadedBookPath = String(bookString);
      renderConsoleEntry([false, "Load '" + bookString + "' success."]);
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
  console.log("fontsize: " + str);
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
async function gotoPage(str) {
  //Attempt to resolve room ref
  if (/ false$/.test(inputStringLower)) {
    //Slice off false
    inputStringLower = String(inputStringLower).slice(0, -6);
    // console.log("Room Input: " + inputStringLower);
    requestRoom(inputStringLower, true);
  } else {
    // console.log("Room Input: " + inputStringLower);
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
  //called by second .then statement
  function appendData(data) {
    for (var i = 0; i < data.length; i++) {
      bookList.push(data[i]);
    }
    renderConsoleEntry(bookList);
  }
}
