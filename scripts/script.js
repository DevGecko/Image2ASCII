document.addEventListener("DOMContentLoaded", function () {

  var asciiDisplay = document.getElementById("asciiResult");
  var downloadIMG = document.getElementById("downloadIMG");
  var loader = document.querySelectorAll(".loader span");
  var overlay = document.getElementsByClassName("overlay")[0];
  let lastspan = loader.length - 1;
  var maxWidthInput = document.getElementById("maxWidthInput");
  var sharpness = document.getElementById("sharpness");
  var blurText = document.getElementById("blur");
  const message = document.getElementById("message");
  const about = document.getElementById("about");
  const imageInput = document.getElementById("imageInput")
  let downloadCheck = false;

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
    downloadIMG.style.display = "block";
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
    overlay.style.display = "none";
    return asciiResult;
  }

  function updateMaxWidthDisplay(value) {
    document.getElementById("maxWidthDisplay").innerText = value;
  }

  imageInput.addEventListener("change", function (event) {
    overlay.style.display = "flex";
    loader.forEach(span => {
      span.style.animationName = "loading";        
});
    downloadIMG.style.display = "none";
    let file = event.target.files[0];
    asciiDisplay.innerText = "";
    if (!file) {
      overlay.style.display = "none";
      loader.forEach(span => {
      span.style.animationName = "none";
});      
      message.style.display = "inline";
    } else {
      message.style.display = "none";
      about.style.display = "none";
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
  
  maxWidthInput.addEventListener("input", function (event) {
    let maxWidth = parseInt(event.target.value);
    updateMaxWidthDisplay(maxWidth);
    let fileInput = imageInput;
    if (fileInput.files.length > 0) {
      asciiDisplay.innerText = "";
      overlay.style.display = "flex";
      loader.forEach(span => {
        span.style.animationName = "loading";
});
      downloadIMG.style.display = "none";
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
  blurText.addEventListener("change", function () {
    if (blurText.checked) {
      asciiDisplay.style.filter = "blur(5px)"
    } else {
      asciiDisplay.style.filter = "blur(0px)"
    }
  });

downloadIMG.addEventListener("click", function () {
  var warning = confirm("It will take a lot of resources and time if the size is too large!");
  if (warning) { downloadCheck = true } else { downloadCheck = false}
  if (downloadCheck) {
    downloadCheck = false;
    overlay.style.display = "flex";
    loader.forEach(span => {
    span.style.animationName = "loading";
});
    var nameImage = imageInput.files[0].name;
    html2canvas(document.getElementById("asciiResult")).then(canvas => {
      var imgData = canvas.toDataURL("image/jpeg");
      var a = document.createElement('a');
      a.href = imgData;
      a.download = "Image2ASCII-" + nameImage;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      overlay.style.display = "none";
      loader.forEach(span => {   
      span.style.animationName = "none";
});
    });
    setTimeout(function() {
      downloadCheck = true;
    }, 500);
  }
});

});
