/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadFolder(folder, picAmount) {  
    var i = 1;
    var imageName = "";
    
    while(i<picAmount) {
        imageName = "pic_0" + i + ".jpg";
        loadImage(folder + imageName);
        i++;
    }
}

function loadImage(filePath) {
    // create image
    var img = new Image();

    // add src attribute                                   
    img.src =  filePath;

    // when image is loaded, add it to 'a' element and then to div by id "g_div"
    img.addEventListener("load", function () {
        // Creating 'a' -element
        var a = document.createElement('a');
        
        // Adding img (this) to 'a' element
        a.appendChild(this);
        
        // Setting up 'a' element
        a.href = filePath;
        a.target = "_self";
        
        // Inserting 'a' -element to div
        document.getElementById("g_div").appendChild(a);
    });
}





