var count = 1;

function loadImages(input) {
    console.log(getWidth())
    var files = input.files;

    for(let file of files){
        var reader  = new FileReader();

        reader.onload = function(e)  {
            var image = document.createElement('img');
            image.id = 'img-'+count++;

            image.src = e.target.result;
            document.getElementById('photos').appendChild(image);
        }

        reader.readAsDataURL(file);
    }
 }

function removeImages() {  
    var images = document.getElementById('photos');
    while(images.firstChild){
        images.removeChild(images.firstChild);
    }
    var btnChoose = document.getElementById('btn-choose');
    btnChoose.value = "";
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
    var width = getWidth();

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
    var style = document.getElementById('photos').style;
    style.webkitColumnCount = size;
    style.columnCount = size;
}