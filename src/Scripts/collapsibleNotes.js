//Collapsable Notes
var w, h;
var notesBoxContent = document.getElementById("notesBoxContent");

document
  .getElementById("collapsibleButton")
  .addEventListener("click", function () {
    this.classList.toggle("active");
    var content = document.getElementById("notesBoxContent");
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      // content.style.maxWidth = null;
      content.style.border = "none";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.border = "3px solid #008000";
    }
  });

function notesBoxtestareresize() {
  //Cap size based on Window
  if (notesBoxContent.style.maxHeight) {
    w = Math.floor(window.innerWidth / 2);
    h = Math.floor(window.innerHeight * 0.8);
    notesBoxContent.style.maxHeight = h + "px";
    notesBoxContent.style.maxWidth = w + "px";
  }
}

//Global listeners
addEventListener("resize", (event) => {
  notesBoxtestareresize();
}); //bounds the size of the notesTextarea on screensize change

const resizeObserver = new ResizeObserver(notesBoxtestareresize).observe(
  document.getElementById("notesBoxtextarea")
); //Bounds the resize of the drag on notesTextarea
