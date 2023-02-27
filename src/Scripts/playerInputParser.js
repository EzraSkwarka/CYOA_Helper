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
  while (renderingConsoleEntry) {
    //stop any ongoing prints
    setInterrupt();
    // console.log("readPlayerInput Sleeping.")
    const result = await sleep(1); //sleep so it doesn't fire to fast
  }
  //Echo input
  renderConsoleEntry([false, inputString], false, true);
  while (renderingConsoleEntry) {
    //stop any ongoing prints
    setInterrupt();
    // console.log("readPlayerInput Echo Sleeping.")
    const result = await sleep(1); //sleep so it doesn't fire to fast
  }
  //Simplify input
  inputStringLower = inputString.toLowerCase();

  //Test Cases

  if (/^goto /.test(inputString)) {
    //Slice off the goto of the command
    inputStringLower = String(inputString).slice(5);
    gotoPage(inputStringLower);
  } else if (/^turn to /.test(inputString)) {
    //Slice off the turn to of the command
    inputStringLower = String(inputString).slice(8);
    gotoPage(inputStringLower);
  } else if (/help/.test(inputString)) {
    helpCommand(inputString);
  } else if (/^open /.test(inputString)) {
    openBook(inputString);
  } else if (/^roll/.test(inputString)) {
    rollDice(inputString);
  } else if (/^setSpeed \d+$/.test(inputString)) {
    setSpeed(inputString);
  } else if (/^reload$/.test(inputString)) {
    window.location.reload();
    // } else if (/^fontsize \d{1,}(px|em)$/.test(inputStringLower)) {
    // setFont(inputStringLower);
  } else if (/^ls -book/.test(inputString)) {
    listBooks();
  } else if (/^stop$/.test(inputString)) {
    setInterrupt();
  } else if (/^cls$/.test(inputString)) {
    clearLogScreen();
  } else if (/^setFont/.test(inputString)) {
    changeDefaultFont(inputString);
  } else if (/^save/.test(inputString)) {
    saveGame();
  } else if (/^load/.test(inputString)) {
    loadGame();
  } else if (/^deletesave/.test(inputString)) {
    deleteSaves();
  }else {
    renderConsoleEntry([true, "ERROR: INVALID INPUT"], true, false);
  }
  //will need to make sure room ID 'x' exists and if not output something to the user so they know why it failed
}

