
let color = {
    "red": 128,
    "green": 128,
    "blue": 128
}

function changeColor(event){
    let code = event.value;
    let id = event.id;

    let hex = fullColorToHex(color['red'], color['green'], color['blue']);
    color[id]=code;
    document.querySelector("#"+id+"-code").innerHTML=code;
    document.querySelector(".hex").innerHTML=hex;
    setColorHexCode();
    document.querySelector(".result").style.backgroundColor = hex;
}

function setColorHexCode(){
    let o = Math.round(((color['red'] * 299) +
                      (color['green'] * 587) +
                      (color['blue'] * 114)) / 1000);
    let fore = (o > 125) ? 'black' : 'white';
    document.querySelector(".hex").style.color=fore;
}

function rgbToHex(value) {
    let hex = Number(value).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function fullColorToHex(r, g, b) {
    let red = rgbToHex(r);
    let green = rgbToHex(g);
    let blue = rgbToHex(b);
    return "#" + red + green + blue;
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

function customize(){
    let width = getWidth();

    if(width<=400){
        changeWidthContent(100);
        changeMarginTopContent(20);
    }
    else if(width<=800){
        changeWidthContent(85);
        changeMarginTopContent(13);
    }
    else if(width<=1000){
        changeWidthContent(65);
        changeMarginTopContent(14);
    }
    else if(width<=1200){
        changeWidthContent(45);
        changeMarginTopContent(12);
    }
    else{
        changeWidthContent(35);
        changeMarginTopContent(8);
    }
}

window.addEventListener('load', function(event){
    customize();
});

window.addEventListener('resize', function(event){
    customize();
});

function changeWidthContent(percent){
    let style = document.querySelector(".all").style;
    style.width = percent+"%";
}

function changeMarginTopContent(percent){
    let style = document.querySelector(".all").style;
    style.marginTop = percent+"%";
}


