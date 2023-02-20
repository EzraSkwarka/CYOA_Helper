//Listener Events for page
//Tracking vars
var ctrlDepressed = false;

//Global Listener Events
onkeydown = (event) => {
  ctrlDepressed = event.ctrlKey; //fires when the ctrl key is held
  var activeElement = document.activeElement;

  //When the user starts typing, autofocus on the input box, will not trigger if the user is holding the ctrl key or if the user is in the notes box
  if (
    !ctrlDepressed &&
    activeElement != document.getElementById("notesBoxtextarea")
  ) {
    document.getElementById("inputBoxTextArea").focus();

  }

  if (ctrlDepressed && event.key == 'c' && activeElement != document.getElementById("notesBoxtextarea")) {
    setInterupt();
    renderConsoleEntry([false, "^C"])
  }


};

onkeyup = (event) => {
  ctrlDepressed = event.ctrlKey; //fires when the ctrl key is released
};

//Listener events for input box
var input = document.getElementById("inputBoxTextArea");
var inputLog = [""];
var inputLogIndex = 0;
input.addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    document.getElementById("inputTriggerButton").click();
    inputLogIndex = 0;
  } else if (event.key == "ArrowUp") {
    inputLogIndex += 1;
    inputLogIndex = Math.min(inputLog.length, inputLogIndex);
    // console.log(inputLogIndex);
    accessTerminalLog(0 - inputLogIndex);
  } else if (event.key == "ArrowDown") {
    inputLogIndex -= 1;
    inputLogIndex = Math.max(0, inputLogIndex);
    // console.log(inputLogIndex);
    accessTerminalLog(0 - inputLogIndex);
  }
});
