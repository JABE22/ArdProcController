/* 
 Created on : 28.4.2018, 12:57:09
 Author     : Jarno Matarmaa  ( Tampere University )
 Project    : Arduino Uno controller website 2018-2019
 */

/*eslint-env browser*/
/* exported hideStreamLoading, 
 showArduinoLoading, 
 showFrame, 
 updateContent, 
 modal 
 */

/* Button styles for status checking, not used
var button = document.querySelector('.button');

button.onclick = function () {
 var red = Math.floor(Math.random() * 256);
 var blue = Math.floor(Math.random() * 256);
 var green = Math.floor(Math.random() * 256);

 this.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
};
*/

// Math.floor(Math.random() * 256) [0-255]
// rgb(255,255,255)

function showStreamLoading() {
    'use strict';
    document.getElementById("stream_loading").style.display = "block";
}

function hideStreamLoading() {
    'use strict';
    document.getElementById("stream_loading").style.display = "none";
}

function hideArduinoLoading() {
    'use strict';
    document.getElementById("arduino_loading").style.display = "none";
}

function showArduinoLoading(timeout) {
    'use strict';
    document.getElementById("arduino_loading").style.display = "block";

    if (timeout !== null) {
        setTimeout(hideArduinoLoading, timeout);
    }
}

function replaceButtonText(buttonId, text) {
    'use strict';
    if (document.getElementById) {
        var button = document.getElementById(buttonId);
        if (button) {
            if (button.childNodes[0]) {
                button.childNodes[0].nodeValue = text;
            } else if (button.value) {
                button.value = text;
            } else { //if (button.innerHTML) 
                button.innerHTML = text;
            }
        }
    }
}

function showFrame() {
    'use strict';
    var frame = document.getElementById("fb_frame");

    if (frame.style.display === "none") {
        frame.style.display = "block";
        replaceButtonText("fb", "Piilota");
    } else {
        frame.style.display = "none";
        replaceButtonText("fb", "Näytä");
    }
}



function updateContent(id, url) {
    'use strict';
    document.getElementById(id).src = url;
    showStreamLoading();
}

function modal() {
    'use strict';
    /* 
     1. Get the modal
     2. Get the image and insert it inside the modal - use its "alt" text as a caption
     3. Get the <span> element that closes the modal 
     */
    var modali = document.getElementById('myModal'),
            img = document.getElementById('myImg'),
            modalImg = document.getElementById("img01"),
            captionText = document.getElementById("caption"),
            span = document.getElementsByClassName("close")[0];

    img.onclick = function () {
        modali.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    };
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modali.style.display = "none";
    };
}

function saveImage(imgId) {
    var image = document.getElementById(imgId);
    if (image !== null) {

    } else {
        console.log("Image not found with id " + imgId);
    }
}

function autoResize(id) {
    var newheight;
    var newwidth;

    if (document.getElementById) {
        newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
        newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
    }

    document.getElementById(id).height = (newheight) + "px";
    document.getElementById(id).width = (newwidth) + "px";
}

