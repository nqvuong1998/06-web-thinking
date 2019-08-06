function loadImages(input) {

    var files = input.files;
    var count = 1;

    for(let file of files){
        var reader  = new FileReader();

        reader.onload = function(e)  {
            var image = document.createElement("img");
            image.id = 'img-'+count++;

            image.src = e.target.result;
            document.getElementById('images').appendChild(image);
        }

        reader.readAsDataURL(file);
    }
 }

function removeImages() 
{  
    var images = document.getElementById('images');
    while(images.firstChild){
        images.removeChild(images.firstChild);
    }
    var btnChoose = document.getElementById('btn-choose');
    btnChoose.value = "";
}