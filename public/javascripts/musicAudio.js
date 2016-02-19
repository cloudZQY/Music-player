/**
 * Created by Administrator on 2016/1/30.
 */





/*���ֹ���*/
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var canvas_box = document.getElementsByClassName("canvas_box")[0];
var canvasElem = document.getElementById("canvas");
var canvas = canvasElem.getContext("2d");
canvasElem.width = canvas_box.offsetWidth;
canvasElem.height = canvas_box.offsetHeight;
var w = parseFloat(canvasElem.width);
var h = parseFloat(canvasElem.height);

/*��Ӧʽ��С*/
window.onresize = function(){
    canvasElem.width = canvas_box.offsetWidth;
    canvasElem.height = canvas_box.offsetHeight;
    w = parseFloat(canvasElem.width);
    h = parseFloat(canvasElem.height);

};



window.onload = function() {
    var audio = document.getElementById('audio');

    /*ʵ��ѡ�蹦��*/
    var lis = document.querySelectorAll("#list li");
    for (var i = 0 ; i< lis.length ; i++){
        lis[i].onclick = function(){
            for (var j = 0; j <lis.length; j++){
                lis[j].className = "";
            }
            this.className = "selected";
            audio.src="media/"+this.title;
            audio.play();
            renderFrame();
        }
    }

    /*����audio*/
    var ac = new AudioContext();
    var analyser = ac.createAnalyser();
    var audioSrc = ac.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ac.destination);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    /*���������ɫ*/
    var grad = canvas.createRadialGradient(0.4 * w,0.5 * h,0,0.4 * w,0.5 * h,600)
    var t = setInterval(getColor,200)
    var r1=random(0,255),
        g1=random(0,255),
        b1=random(0,255),
        r2=random(0,255),
        g2=random(0,255),
        b2=random(0,255),
        ran = 3;
         getColor();
    function getColor(){
        grad.addColorStop(0,'rgba('+(r1+=random(0,ran))%255+','+(g1+=random(0,ran))%255+','+(b1+=random(0,ran))%255+',1)')
        grad.addColorStop(1,'rgba('+(r2+=random(0,ran))%255+','+(g2+=random(0,ran))%255+','+(b2+=random(0,ran))%255+',1)')
    }

    /*���Ŷ���*/
    function renderFrame() {
        /*�������Ƶ������*/
        var arr = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(arr);
        anime1(grad,canvas,arr);
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();


};


function anime1(grad,canvas,arr) {
    var origin = { //ԭ��
        x: 0.4 * w,
        y: 0.5 * h,
        r: 0.005 * h
    };
    var coords = []; //��Ȧ���꼯

    for (var i = 0; i <arr.length/2; i++) {
        var angle = Math.PI * 2 /(arr.length/2) * i ;
        var obj = {
            x: origin.x + Math.cos(angle) *(origin.r+origin.r*Math.sqrt(arr[i]*40)),
            y: origin.y - Math.sin(angle) *(origin.r+origin.r*Math.sqrt(arr[i]*40))
        };
        coords.push(obj);
    }
    canvas.clearRect(0,0,w,h);
    canvas.beginPath();
    canvas.moveTo(coords[0].x, coords[0].y);
    for (var i = 1; i < coords.length; i++) {
        canvas.lineTo(coords[i].x, coords[i].y);
    }
    canvas.closePath();
    canvas.strokeStyle = "red";
    canvas.lineWidth = 1;
    canvas.stroke();


    canvas.fillStyle = grad;
    canvas.fill();



}





function random(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}