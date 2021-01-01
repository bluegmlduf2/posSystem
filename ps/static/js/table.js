let realTimeFunc=setInterval(function(){
    let moduleObj = module();
    let daytime=moduleObj.getCurTime();
    document.querySelector("#curTime").innerHTML=daytime;
    document.querySelector("#payTabTim").innerHTML=daytime;
},1000)

/* Window.onload 는 image로드까지 기다리기 때문에 느림 
그러나 DOMContentLoaded는 image의 로드를 기다리지 않으므로 빠름 == $(document).ready()
그리고 굳이 태그의 마지막에 script를 넣어주면 필요가없다  */ 
window.addEventListener('DOMContentLoaded', function(){});