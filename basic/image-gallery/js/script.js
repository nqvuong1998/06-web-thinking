function loadImages(input) {
    var files = input.files;

    for(let file of files){
        var reader  = new FileReader();

        reader.onload = function(e)  {
            var image = document.createElement('img');
            image.src = e.target.result;
            document.getElementById('photos').appendChild(image);
        }
        reader.readAsDataURL(file);
    }
 }

function removeImages() {  
    let photos = document.getElementById('photos');
    photos.innerHTML="";
    let btnFile = document.getElementById('file');
    btnFile.value = "";
}

function getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
}

window.addEventListener('resize', function(event){
    let width = getWidth();

    if(width<=400){
        changeColumnCount(1);
    }
    else if(width<=800){
        changeColumnCount(2);
    }
    else if(width<=1000){
        changeColumnCount(3);
    }
    else if(width<=1200){
        changeColumnCount(4);
    }
    else{
        changeColumnCount(5);
    }
    
});

function changeColumnCount(size){
    let style = document.getElementById('photos').style;
    style.webkitColumnCount = size;
    style.columnCount = size;
}

