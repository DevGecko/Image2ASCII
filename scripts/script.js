document.addEventListener("DOMContentLoaded", function () {

  var asciiDisplay = document.getElementById("asciiResult");
  var loader = document.getElementsByClassName("loader")[0];
  var maxWidthInput = document.getElementById("maxWidthInput");
  var sharpness = document.getElementById("sharpness");
  const message = document.getElementById("message");
  const imageInput = document.getElementById("imageInput");
  
  function imageToAscii(img, maxWidth) {
    let scale = 1;
    if (img.width > maxWidth) {
      scale = maxWidth / img.width;
    }
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale * 1.6;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    loader.style.display = "none";
    let asciiResult = "";
    let asciiCharacters = ["@", "#", "&", "%", "?", "*", "+", ";", ":", ",", ".", " "];
    for (let y = 0; y < canvas.height; y += 6) {
      for (let x = 0; x < canvas.width; x += 3) {
        let pixelData = context.getImageData(x, y, 1, 1).data;
        let grayscale = (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
        let asciiIndex = Math.floor((grayscale / 256) * asciiCharacters.length);
        asciiResult += asciiCharacters[asciiIndex];
      }
      asciiResult += "\n";
    }
    return asciiResult;
  }

  function updateMaxWidthDisplay(value) {
    document.getElementById("maxWidthDisplay").innerText = value;
  }

  document.getElementById("imageInput").addEventListener("change", function (event) {
    loader.style.display = "block";
    let file = event.target.files[0];
    asciiDisplay.innerText = "";
    if (!file) {
      loader.style.display = "none";      
    } else {
      let img = new Image();
      let maxWidth = parseInt(maxWidthInput.value);
      updateMaxWidthDisplay(maxWidth);
      img.onload = function () {
        let asciiResult = imageToAscii(img, maxWidth);
        asciiDisplay.innerText = asciiResult;
      }
      img.src = URL.createObjectURL(file);
    }
  });

  imageInput.addEventListener("change", () => {
    if (imageInput.files && imageInput.files[0]) {
      message.style.display = "none";
    } else {
      message.style.display = "inline";
    }
  });

  maxWidthInput.addEventListener("input", function (event) {
    let maxWidth = parseInt(event.target.value);
    updateMaxWidthDisplay(maxWidth);
    let fileInput = document.getElementById("imageInput");
    if (fileInput.files.length > 0) {
      asciiDisplay.innerText = "";
      loader.style.display = "block";
      let img = new Image();
      img.onload = function () {
        let asciiResult = imageToAscii(img, maxWidth);
        asciiDisplay.innerText = asciiResult;
      }
      img.src = URL.createObjectURL(fileInput.files[0]);
    }
  });

  asciiDisplay.addEventListener("click", function () {
    const selection = window.getSelection();
    if (!selection.toString()) {
      const range = document.createRange();
      range.selectNodeContents(asciiDisplay);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  sharpness.addEventListener("change", function () {
    if (sharpness.checked) {
      asciiDisplay.style.textShadow = "0 0 10px black";
    } else {
      asciiDisplay.style.textShadow = "none";
    }
  });

});
