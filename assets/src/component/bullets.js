const canvas = document.querySelector('.app-bullets');
const ctx = canvas.getContext("2d");

canvas.setAttribute('width',canvas.clientWidth);
canvas.setAttribute('height',canvas.clientHeight);

const randomColor = function(){
    var r = Math.floor(Math.random()*255);
    var g = Math.floor(Math.random()*255);
    var b = Math.floor(Math.random()*255);
    return "rgba("+r+","+g+","+b+",.2)";
};

const draw = function() {
    const pi     =  Math.PI*2;
    const width  = canvas.clientWidth;
    const height = canvas.clientHeight;
    const size   = (height/10);
    ctx.clearRect(0,0,width,height);
    (function(index){
        if( index >= 2400) return;
        var callback = arguments.callee;
        var radius  = Math.floor(Math.random() * size );
        var radius2 = radius * 2;
        var padding = Math.min(height / 5 , Math.floor(Math.random() * ( height / 4 )  ) );
        var x = Math.floor(Math.random() * width );
        var y = Math.floor(Math.random() * height );
        //x = Math.min( Math.max(padding + radius2 , x ) , width - padding - radius2);
        //y = Math.min( Math.max(padding + radius2, y ) , height - padding - radius2);
        ctx.beginPath();
        ctx.arc(x,y,radius,pi,0,false);
        ctx.fillStyle = randomColor();
        ctx.fill();
        ctx.closePath();
        requestAnimationFrame(function(){
            callback(++index);
        });
    })(0);
}
