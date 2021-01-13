// 시간 1초마다 갱신
setInterval(function () {
    let moduleObj = module();
    let daytime = moduleObj.getCurDate();
    document.querySelector("#curTime").innerHTML = daytime;
    document.querySelector("#payTabTim").innerHTML = daytime;
}, 1000);

// CLICK 시 STATE변경
document.querySelectorAll(".seat").forEach((btn) => {
    //클릭시 초기화 후 체크
    btn.addEventListener("click", () => {
        document.querySelectorAll(".seat").forEach((seatCls) => {
            seatCls.classList.remove("active");
        });
        btn.classList.toggle("active");
    });
    // 더블클릭시 체크 해제
    btn.addEventListener("dblclick", () => {
        btn.classList.toggle("active");
    });
});

/* Window.onload 는 image로드까지 기다리기 때문에 느림 
그러나 DOMContentLoaded는 DOM객체를 생성후 이벤트를 발생한다. 
그러므로 image의 로드를 기다리지 않으므로 빠름 == $(document).ready()
그러면 굳이 태그의 마지막에 script를 넣어주면 필요가없다  */
window.addEventListener("DOMContentLoaded", function () {});
