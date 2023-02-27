/*
Short Description:
	This function renders a room based of user input
	
Arguments:
	str =  Str, the users input string
	
	return = None
*/
async function gotoPage(str) {
  //Attempt to resolve room ref
  if (/ -false$/.test(str)) {
    //Slice off false
    str = String(str).slice(0, -6);
    // console.log("Room Input: " + inputStringLower);
    requestRoom(str, true);
  } else {
    // console.log("Room Input: " + inputStringLower);
    requestRoom(str);
  }
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
    renderConsoleEntry(helpArray, true);
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
    renderConsoleEntry(bookList, true);
  }
}

/*
Short Description:
	Called from playerInput.js to stop a room render
	
Arguments:
	None
	
	return = None
*/
function setInterrupt() {
  console.log("Calling for early exit.");
  interruptRender = true;
  if (renderingConsoleEntry) {
    waitForInterrupt = true;
  }
  return true;
}


/*
Short Description:
	Clears all previous entrees by deleting the 'typedRoom' children of 'gameText' 
	
Arguments:
	None
	
	return = None
*/
function clearLogScreen() {
  console.log("Clear screen request received");
  var target = document.getElementById("gameText");
  while (target.lastChild) {
    target.removeChild(target.lastChild);
  }
  return;
}

/*
Short Description:
	Clears all previous entrees by deleting the 'typedRoom' children of 'gameText' 
	
Arguments:
	None
	
	return = None
*/
function changeDefaultFont(choice) {
  //Text array for know fonts and error explanation. Not spinning this one off as changing it also means the font setter below also changed
  var knownFontTextArray = [
    true,
    "The font you requested was: ",
    true,
    choice.slice(8),
    true,
    ". Remember, font choices are case sensitive. ibmbios =/= IBMBios. The fonts currently supported are:",
    false,
    "<br>",
    true,
    "IBMBios; OpenDyslexic",
  ];

  //Font setting logic
  var targetArray = [
    document.getElementById("main"),
    document.getElementById("notesBox"),
    document.getElementById("inputBoxTextArea"),
  ];
  var fontString = "";
  if (/ IBMBios/.test(choice)) {
    fontString = "IBMBios, monospace";
  } else if (/OpenDyslexic$/.test(choice)) {
    fontString = "OpenDyslexic, monospace";
  }
  if (fontString != "") {
    for (i in targetArray) {
      targetArray[i].style.fontFamily = fontString;
    }
  } else {
    //Font not supported or mistyped
    renderConsoleEntry(knownFontTextArray, true, false);
  }
  return;
}

/*
Short Description:
	This function save the current gameState to localStorage as a JS object
	
Arguments:
	None
	
	return = None
*/
async function saveGame() {
  console.log("Save Game");
  //  Grab the HTMLElement objects and bundle them into a data pack
  var data = {
    gameText: document.getElementById("gameText").innerHTML,
    notesBoxTextArea: document.getElementById("notesBoxTextArea").value,
  };

  //Store the JSON object in localStorage
  localStorage.setItem("saveState", JSON.stringify(data));
}

/*
Short Description:
	This function loads the current gameState from localStorage as a JS object then sets the relevant vars and HTML segments

Arguments:
	None
	
	return = None
*/
async function loadGame() {
  //Check is there is a current saveState in localStorage
  if (localStorage.getItem("saveState")) {
    //Load the saveState as a JSON object
    var saveGame = JSON.parse(localStorage.getItem("saveState"));
    //Update HTML
    document.getElementById("gameText").innerHTML = saveGame["gameText"];
    document.getElementById("notesBoxTextArea").textContent =
      saveGame["notesBoxTextArea"];

    //Set any vars

    //Update console
    renderConsoleEntry([true, "load"], false, true);
    renderConsoleEntry([true, "Load game successful"], true);
  } else {
    //Send error message
    renderConsoleEntry([true, "err: No Save Game Found"], true);
  }
}

/*
Short Description:
	Clears any currently saved saveGames from Local Storage 
	
Arguments:
	None
	
	return = None

*/
function deleteSaves() {
  //TODO: Add an are you sure prompt

  //
  if (localStorage.getItem("saveState")) {
    renderConsoleEntry([true, "Deleting Save Game..."], true);
    localStorage.removeItem("saveState");
    renderConsoleEntry([true, "Done"], true);
  } else {
    renderConsoleEntry([true, "err: No Save Game Found"], true);
  }
}

