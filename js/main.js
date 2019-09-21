var bgCanvas = document.getElementById("bgImg")
var slider = document.getElementById("slider")
var bar = document.getElementsByClassName( "bar" )[0]

var ctx = bgCanvas.getContext("2d")
var ctx2 = slider.getContext("2d")

var isDown = false
var downPointX = 0
var offsetLeft = 0

// 设置canvas的宽高
function setCanvasWH( canvas , w, h ){
    canvas.width = w
    canvas.height = h
}
// 获取随机数
function getRandomNum( min, max ){
    var x = Math.random() * ( max - min ) + min
    return x
}
// 获取滑动块像素绘制到前面
function drawSlider( ctx, canvas, blockData ){
    var blockW = blockData.w + blockData.r * 2
    var _y = blockData.y - blockData.r * 2
    var imageData = ctx.getImageData( blockData.x, _y, blockW, blockW + 10 )
    canvas.width = blockW
    ctx.putImageData( imageData, 0, _y )
}
// 绘制滑块
function draw(ctx, xy = { x: 254, y: 109, r: 10, w: 40 }, type) {
    let x = xy.x,
      y = xy.y,
      r = xy.r,
      w = xy.w;
    let PI = Math.PI;
    //绘制
    ctx.beginPath();
    //left
    ctx.moveTo(x, y);
    //top
    ctx.arc(x + (w + 5) / 2, y, r, -PI, 0, true);
    ctx.lineTo(x + w + 5, y);
    //right
    ctx.arc(x + w + 5, y + w / 2, r, 1.5 * PI, 0.5 * PI, false);
    ctx.lineTo(x + w + 5, y + w);
    //bottom
    ctx.arc(x + (w + 5) / 2, y + w, r, 0, PI, false);
    ctx.lineTo(x, y + w);
    ctx.arc(x, y + w / 2, r, 0.5 * PI, 1.5 * PI, true);
    ctx.lineTo(x, y);
    //修饰，没有会看不出效果
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.stroke();
    ctx[type]();
    ctx.globalCompositeOperation = "xor";
}

// 初始化图片到canvas
function initImage( imgUrl ){
    
    var w = 400, h = 300

    ctx.clearRect( 0, 0, w, h )
    ctx2.clearRect( 0, 0, w, h )

    var blockData = {
        w : 40,
        r : 10
    }                   // 切割小块的信息

    // 设置画布基本宽高
    setCanvasWH( slider, w, h )
    setCanvasWH( bgCanvas, w, h )
    // 获取随机宽高
    offsetLeft = getRandomNum( w / 2 , w - blockData.w - blockData.r * 2 )
    var offsetTop = getRandomNum( 0 , h - blockData.w - blockData.r * 2 )
    // 宽高半径和滑块宽
    var point = {
        x: offsetLeft,
        y: offsetTop,
        r: blockData.r,
        w: blockData.w
    }

    var img = document.createElement("img")
    img.onload = function(){
        draw( ctx, point, "fill" )
        draw( ctx2, point, "clip" )
        ctx.drawImage( img, 0, 0, w, h )
        ctx2.drawImage( img, 0, 0, w, h )
        drawSlider( ctx2, slider, point )
    }
    img.src = imgUrl

    bar.addEventListener("mousedown", ( e ) => {
        isDown = true
        downPointX = e.x
    } )

    document.addEventListener("mousemove", throttle( ( e ) => {
        if( isDown ){
            var left = e.x - downPointX > 0 ? e.x - downPointX : 0
            left = left > w - blockData.w - blockData.r - 5 ? w - blockData.w - blockData.r - 5 : left
            slider.style.left = left + "px"
            bar.style.left = ( left > blockData.w ? left + 15 : left ) + "px"
        }
    }) )
    document.addEventListener("mouseup", ( e ) => {
        if( isDown ){
            isDown = false
            if( Math.abs( ( e.x - downPointX ) - offsetLeft ) < 10 ){
                alert("成功--")
            } else {
                alert("失败")
            }
            slider.style.left = 0 + "px"
            bar.style.left = -1 + "px"
            initImage( "./image/2.jpg" )
        }
    })
}

function throttle( fn, interval ){
    var timer = null
    var isFirst = true
    return function(){
        if( isFirst ){
            isFirst = false
            fn.apply( null, arguments )
        }
        if( timer ){
            return 
        }
        timer = setTimeout( () => {
            clearTimeout(timer)
            timer = null
            fn.apply( null, arguments )
        }, interval || 10 )
    }
}


initImage( "./image/2.jpg" )



