// 시간 1초마다 갱신
setInterval(function () {
    let daytime = module.getCurDate();
    document.querySelector("#curTime").innerHTML =
        daytime.substring(0, 17) +
        "</br><h3>" +
        daytime.substring(17) +
        "</h3>";
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

// 예약하기버튼
document.querySelector("#btnResv").addEventListener("click", () => {
    let tabDiv = document.querySelector(".seat.active .tabNum");
    let tabDiv_span = tabDiv.querySelector("span");
    const tabNum = tabDiv.textContent;

    if (!document.querySelector(".seat.active")) {
        alert("좌석을 선택해주세요.");
        return;
    }

    if (!nullCheck(tabDiv_span.dataset.orderCd)) {
        alert("주문하지 않은 좌석을 선택해주세요.");
        return;
    }
    const year=new Date().getFullYear()
    const resvDay = prompt("예약일자를 입력해주세요 \n(ex:0101)");
    const resvTime = prompt("예약시간을 입력해주세요 \n(ex:2359)");
    const resvPeople = prompt("예약 인원을 입력해주세요 \n(3자리까지)");

    /** var a=/정규식객체/  */
    /** /정규형시작,종료/ ^문자열시작,종료$ \d숫자 {1,3}1~3글자사이  */
    /** RegExp.test() //true ,false  */
    const regexr_time = /^\d{4}$/; //8자리 숫자입력
    const regexr_people = /^\d{1,3}$/; // 1~3자리 숫자로 입력

    //시간입력
    if (!regexr_time.test(resvDay)||!regexr_time.test(resvTime)) {
        alert("예약일자,예약시간을 확인해주세요.");
        return;
    }

    //인원수입력
    if (!regexr_people.test(resvPeople)) {
        alert("예약인원을 확인해주세요.");
        return;
    }
    let reserTime=`${year}-${resvDay.substring(0,2)}-${resvDay.substring(2,4)}`
    reserTime+=` ${resvTime.substring(0,2)}:${resvTime.substring(2,4)}:00`
    
    module
        .ajax("POST", "/resv/insertResv", {
            tableCd: tabNum,
            reserTime: reserTime,
            reserPeople: resvPeople
        })
        .then((result) => {
            let resultJson = JSON.parse(result);
            let status = resultJson.status;
            let message = resultJson.message;

            if (status) {
                alert(message);
                // closeModal(true);
            } else {
                //사용자 예외
                alert(message);
            }
        })
        .catch((result) => {
            debugger
            alert(result.message);
            console.error(result.message);
        });
});

// 예약취소버튼
document.querySelector("#btnCancleResv").addEventListener("click", () => {});

/* Window.onload 는 image로드까지 기다리기 때문에 느림 
그러나 DOMContentLoaded는 DOM객체를 생성후 이벤트를 발생한다. 
그러므로 image의 로드를 기다리지 않으므로 빠름 == $(document).ready()
그러면 굳이 태그의 마지막에 script를 넣어주면 필요가없다  */
window.addEventListener("DOMContentLoaded", function () {});
