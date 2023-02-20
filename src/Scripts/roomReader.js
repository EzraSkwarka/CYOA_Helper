// This is the suite of functions that allows me to parse and render books and pages from a JSON file

//Defaults
var loadedBookPath =
  "Assets/Test Adventures/small_example_adventure_text_array.json";
var typeSpeed = 2;
var consoleFontSize = "1em";
var styleTagText = "";
var interuptRender = false;
var loadedBookStyle = "";
var renderingConsoleEntry = false;

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
  var mainContainer = document.getElementById("gameText");
  mainContainer.appendChild(div);
  //Set Class
  div.className = "typedRoom";
  //Update DOM
  consoleFontSize = setFont("fontsize " + consoleFontSize);

  return div;
}

/*
Short Description:
	Setup commands on new book load
	
Arguments:
	None
	
	return = None
*/
function onBookLoad(bookString) {
  //Update player that book load worked
  renderConsoleEntry([false, "Open '" + bookString + "' success."]);
  //load book specific style
  var cssString = "";
  fetch(loadedBookPath)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      roomCheck(data);
    });
  function roomCheck(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].ID == "Meta") {
        if (data[i].hasOwnProperty("css")) {
          // console.log(data[i].css);
          cssString = data[i].css.toString();
        }
      }
    }
    if (cssString == "") {
      console.log("err: No CSS Metadata found for currently loaded book.");
      loadedBookStyle = "";
    } else {
      setBookStyle(cssString);
    }
    //If book has an 'on-load' room, print it, if on-load not found fails silently
    requestRoom("on-load", false, false);
  }
}

/*
Short Description:
	This function reads a whole book so it can return and render a single page, I would eventually like to have each of those be there own tasks so as not to parse the entire book each time
Arguments:
	ID_target = int, this is the page number to be rendered
	print = boolean, defaults to false, if true skips the char by char render effect and drops then whole page at once
	
	return = None
*/
function requestRoom(ID_target, print = false, print_subheading = true) {
  //Add a check here so see if a book has already been loaded
  fetch(loadedBookPath)
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
      if (data[i].ID == ID_target) {
        if (print_subheading) {
          roomPackage = [
            true,
            "<span class='subsectionHeader'>" +
              data[i].ID +
              " " +
              data[i].short_name +
              "</span>",
            false,
            "</br>",
          ].concat(data[i].text_array);
        } else {
          roomPackage = data[i].text_array;
        }
        // console.log(roomPackage);
        renderConsoleEntry(roomPackage, !print);

        break;
      }
    }
  }
}

/*
Short Description:
	This function should handle all the rendering and typing to the console. Needs to be able to type the text or print it and it needs to be able to flag if its an echo or a response
	
Arguments:
	textArray = Array, in the same format as the rooms
	animate = Boolean, default false, if the text needs to go up char by char or entry by entry (print vs type)
	fromPlayer = Boolean, default false, should the line start with '>> ' or whats in the consoleID span from main
	
	return = None
*/
async function renderConsoleEntry(
  textArray,
  animate = false,
  fromPlayer = false
) {
  if (renderingConsoleEntry == true) {
    console.log("err: Already running renderConsoleEntry");
    return;
  }
  renderingConsoleEntry = true;
  //Create Container
  var div = createConsoleEntry();
  if (textArray == []) {
    console.log("err: Empty textArray given to renderConsoleEntry");
    renderingConsoleEntry = false;
    return false;
  }
  //Render Text
  //Grab frontString
  if (fromPlayer) {
    var frontString = String(document.getElementById("consoleID").textContent);
  } else {
    var frontString = ">> ";
  }
  //Format Text --> need to break into own function that packages the text with tags to know if they are to be typed or rendered at once (i.e. a string of flavor text or a new line command)
  var textString = "";
  var tempString = "";
  var i = 0;
  for (let i = 0; i < textArray.length; i += 2) {
    //Early exit check
    if (interuptRender) {
      interuptRender = false;
      renderingConsoleEntry = false;
      return false;
    }
    //Apply identifier on first pass
    if (i == 0) {
      textString = frontString + textArray[i + 1];
    } else {
      textString = textArray[i + 1];
    }

    //Type this block or print it
    if (textArray[i] == true && animate) {
      //if we are to type
      var n = 0;
      var inSpan = false;
      var inATag = false;
      for (n; n < textString.length; ) {
        //Early exit check
        if (interuptRender) {
          interuptRender = false;
          renderingConsoleEntry = false;
          return false;
        }
        //Pull whats already in the div
        tempString = div.innerHTML;
        //This is gonna need a fundamental rework as it can't handle nested anythings and by the nature of if/else imposes hierarchy
        //Each if section should just build the tempString and have a final statement append tempString to div.innerHTML

        //The exception for `<tag` code should be abstractable into something more modular. I think I can build a dictionary and specify the target strings to look for (i.e. `<span ` or `<a `) and use the dictionary to track the in`tag` boolean so that I can expand this to cover any arbitrary tag. Furthermore, if I have a good record of which tags are active, I can close them safely at the end without relying on an abuse of case and making the DOM autoclose them.

        //Exception for span tag
        if (textString.slice(n, n + 5) == "<span") {
          inSpan = true;
          var x = distanceToClosingTag(textString, n); //find closing '>' tag
          var tagText = textString.slice(n, x + 1); //capture tag text
          tempString += tagText; //add the tag onto tempString
          n = x + 1; //update n based on distance to closing >
        } //if in span tag and...
        else if (inSpan) {
          //ready to leave the a tag
          if (textString.slice(n, n + 7) == "</span>") {
            n += 7; //update n by length of '</a>'
            inSpan = false; //clear inSpan flag
          } //not ready to leave
          else {
            tempString = tempString.slice(0, -7); //Slice off the '</span>' from the end of the string
          }
        }

        //Exception for <a> tag
        if (textString.slice(n, n + 3) == "<a ") {
          inATag = true;
          var x = distanceToClosingTag(textString, n); //find closing '>' tag
          tempString += textString.slice(n, x + 1); //add the tag onto tempString
          n = x + 1; //update n based on distance to closing >
        }
        //if in a tag and...
        else if (inATag) {
          //ready to leave the a tag
          if (textString.slice(n, n + 4) == "</a>") {
            n += 4; //update n by length of '</a>'
            inATag = false; //clear inATag flag
          } //not ready to leave
          else {
            tempString = tempString.slice(0, -4); //Slice off the '</a>' from the end of the string
          }
        }

        //Exception for Non-Breaking Spaces no longer needed

        //Exception for </br>
        if (textString.slice(n, n + 5) == "</br>") {
          tempString += "</br>";
          n += 5;
        }

        //Nothing Special is happening
        //add the next char
        tempString += textString.charAt(n);
        n++;

        //Update div.innerHTML
        div.innerHTML = tempString;

        //Keep the bottom of the typer in view
        div.scrollIntoView(false);
        //Sleep so we get the animation effect
        const result = await sleep();
      }
    } else {
      //if we are to print instead of type
      //Early Exit Check
      if (interuptRender) {
        interuptRender = false;
        renderingConsoleEntry = false;
        return false;
      }
      tempString = div.innerHTML;
      div.innerHTML = tempString + textString;
      div.scrollIntoView(false);
    }
  }
  //Keep bottom of gameText in view
  div.scrollIntoView(false);
  renderingConsoleEntry = false;
  return false;
}

function distanceToClosingTag(str, base) {
  var x = base;
  for (x; x < str.length; x++) {
    if (str.charAt(x) == ">") {
      return x;
    }
  }
}

/*
Short Description:
	Called from playerInput.js to stop a room render
	
Arguments:
	None
	
	return = None
*/
function setInterupt() {
  console.log("Calling for early exit.");
  interuptRender = true;

  return true;
}

/*
Short Description:
	Used to handle room clicks from the text log smoothly by calling the approbrate log and print functions
	
Arguments:
	roomID = Int, the room to print
	
	return = None
*/
function clickRoom(roomID) {
  renderConsoleEntry([false, "goto " + String(roomID)], false, true);
  requestRoom(roomID, ctrlDepressed);
}

/*
Short Description:
	creates a delay so that the terminal can have a typing effect

Arguments:
	ms = Int, time in ms that this function will cause the excution string to hang, must be accompined by an await inside an async function
	
	return = None
*/
function sleep(ms = typeSpeed) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
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

/*
Short Description:
	loads the book specific css code and applies is
	
Arguments:
	cssText; the string to parse
	
	return = None
*/
function setBookStyle(cssText) {
  if (loadedBookStyle != "") {
    document.getElementsByTagName("head")[0].removeChild(loadedBookStyle);
    loadedBookStyle = "";
  } //does not work, but is the idea of what I'm going for
  var style = document.createElement("style");
  style.type = "text/css";
  style.id = "bookStyle";
  style.innerHTML = cssText;
  loadedBookStyle = style;
  document.getElementsByTagName("head")[0].appendChild(style);
}
