// This is the suite of functions that allows me to parse and render books and pages from a JSON file

//Defaults
var loadedBookPath =
  "Assets/Test Adventures/small_example_adventure_text_array.json";
var typeSpeed = 2;
var consoleFontSize = "1em";
var styleTagText = "";
var interruptRender = false;
var loadedBookStyle = "";
var renderingConsoleEntry = false;
var waitForInterrupt = false;

/*
Short Description:
	Creates a new div as a child of #gameText and returns a reference to it, also updates the DOM which will eventually be its own function
	
Arguments:
	None
	
	return = div, a reference
*/
function createConsoleEntry() {
  //Create new container
  var div = document.createElement("div");
  //Append to Parent
  var mainContainer = document.getElementById("gameText");
  mainContainer.appendChild(div);
  //Set Class
  div.className = "typedRoom";

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
        if (data[i].hasOwnProperty('tag')) {
          document.getElementById('consoleIDTag').textContent = data[i].tag;
        } else {
          document.getElementById('consoleIDTag').textContent = "home";
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
  var roomFoundBool = false;
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
            "<br>",
          ].concat(data[i].text_array);
        } else {
          roomPackage = data[i].text_array;
        }
        renderConsoleEntry(roomPackage, !print);
        roomFoundBool = true;
        break;
      }
    }
    roomFound(roomFoundBool);
  }
  function roomFound(test) {
    //checks to see if it exists, if it doesn't it will print the error
    if (!test) {
      renderConsoleEntry(
        [true, "err: no matching page for ", true, ID_target, true, " found"],
        true
      );
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
  while (waitForInterrupt) {
    const result = await sleep(1);
    console.log("Renderer sleeping.");
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
    if (interruptRender) {
      interruptRender = false;
      renderingConsoleEntry = false;
      waitForInterrupt = false;
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
      var didNothing = true;
      var inATag = false;

      var tagDict = {
        // "<img ": false,
        "<span": false,
        "<a": false,
        "<div": false,
        // "<div>": false,
        "<td": false,
        // "<td>": false,
        "<tr": false,
        // "<tr>": false,
        "<tbody": false,
        // "<tbody>": false,
        "<thead": false,
        // "<thead>": false,
        "<table": false,
        // "<table>": false,
        
      };
      for (n; n < textString.length; ) {
        //Early exit check
        if (interruptRender) {
          interruptRender = false;
          renderingConsoleEntry = false;
          waitForInterrupt = false;
          return false;
        }
        //Pull whats already in the div
        tempString = div.innerHTML;
        didNothing = true;
        //This is gonna need a fundamental rework as it can't handle nested anythings and by the nature of if/else imposes hierarchy
        //Each if section should just build the tempString and have a final statement append tempString to div.innerHTML

        //The exception for `<tag` code should be abstracted into something more modular. I think I can build a dictionary and specify the target strings to look for (i.e. `<span ` or `<a `) and use the dictionary to track the in`tag` boolean so that I can expand this to cover any arbitrary tag. Furthermore, if I have a good record of which tags are active, I can close them safely at the end without relying on an abuse of case and making the DOM autoclose them.

        //First check if you need to cut any tags off to get to where you are going to add new content
        for (tag in tagDict) {
          if (tagDict[tag]) {
            tempString = tempString.slice(0, 0 - (2 + tag.length)); //Slice off the '</tag>' from the end of the string
          }
        }

        //Then check if you need to open any new tags
        for (tag in tagDict) {
          if (textString.slice(n, n + tag.length) == tag) {
            // console.log("Opened a `" + tag + "`");
            tagDict[tag] = true; //Flag the tag as found in tagDict
            tempString += textString.slice(
              n,
              distanceToClosingTag(textString, n) + 1
            ); //add the tag text onto tempString found by using the distance to the closing `>`
            n = distanceToClosingTag(textString, n) + 1; //update n based on distance to closing >
            didNothing = false; //Mark that we did something so we don't print a new character or increment n
          } //if in tag and...
          else if (
            tagDict[tag] &&
            textString.slice(n, n + tag.length + 2) == "</" + tag.slice(1) + ">" //turn the leading '<' into a '</' and make sure the closing '>' is present, add 2 total characters, hence `tag.length + 2` above
          ) {
            n += tag.length + 2; //update n by length of '</tag>'
            tagDict[tag] = false; //clear tag flag in tagDict
            didNothing = false; //Mark that we did something so we don't print a new character or increment n
          }
        }

        //Exception for <br>
        if (textString.slice(n, n + 4) == "<br>") {
          tempString += "<br>";
          n += 4;
          didNothing = false;
        }

        if (textString.slice(n, n + 5) == "<img ") {
          var x = distanceToClosingTag(textString, n) + 1
          tempString += textString.slice(n, n + x);
          n += x;
          didNothing = false;
        }

        //Nothing special was done, add the next character and increase n
        if (didNothing) {
          tempString += textString.charAt(n);
          n++;
        }

        //add the closing tags or we end up in a heap of trouble
        for (tag in tagDict) {
          if (tagDict[tag]) {
            tempString += "</" + tag.slice(1) + ">";
          }
        }

        //Update div.innerHTML
        div.innerHTML = tempString;

        //Keep the bottom of the typed element in view
        div.scrollIntoView(false);
        //Sleep so we get the animation effect
        const result = await sleep();
      }
    } else {
      //if we are to print instead of type
      //Early Exit Check
      if (interruptRender) {
        interruptRender = false;
        renderingConsoleEntry = false;
        waitForInterrupt = false;
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
  while (x < str.length) {
    x++;
    if (str.charAt(x) == ">") {
      return x;
    }
  }
}

/*
Short Description:
	Used to handle room clicks from the text log smoothly by calling the appropriate log and print functions
	
Arguments:
	roomID = Int, the room to print
	
	return = None
*/
function clickPage(roomID) {
  renderConsoleEntry([false, "goto " + String(roomID)], false, true);
  requestRoom(roomID, ctrlDepressed);
}

/*
Short Description:
	creates a delay so that the terminal can have a typing effect

Arguments:
	ms = Int, time in ms that this function will cause the execution string to hang, must be accompanied by an await inside an async function
	
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
	loads the book specific css code and applies is
	
Arguments:
	cssText; the string to parse
	
	return = None
*/
function setBookStyle(cssText) {
  //Delete old book Style
  if (document.getElementById("bookStyle")) {
    document.getElementById("bookStyle").remove();
  }
  var style = document.createElement("style");
  style.setAttribute('type', 'text/css');
  style.setAttribute('id', 'bookStyle');
  style.innerHTML = cssText;
  document.getElementsByTagName("head")[0].appendChild(style);
}
