const modal_chart = document.querySelector("#chartBg");

/**********************************GLOBAL VALUES************************************************* */

// Get open modal button
document.querySelector("#btnChart").addEventListener("click", openModal);

// Get close button
document.querySelector("#btnChartClose").addEventListener("click", () => {
    closeModal();
}); //이벤트파라미터가 e가 1번파라미터로 전송되어서 이렇게 처리

// Listen for outside click
window.addEventListener("click", outsideClick);

/**
 * Open modal
 */
function openModal() {
    modal_chart.style.display = "block"; /* none -> display */
    let chartWeek = document.querySelector("#chartWeek");
    chartWeek.value = new Date().toISOString().split("T")[0];
}

/**
 * Close modal
 */
function closeModal() {
    location.reload(); //새로고침
}

// Click outside and close (모달 밖을 클릭)
function outsideClick(e) {
    if (e.target == modal_chart) {
        closeModal();
    }
}

function initChart(percentArr) {
    //for of = 이터러블을 가진 객체에서 사용 가능 Symbol.iterator
    let cssChart = document.styleSheets[5].cssRules; //해당페이지의 5번째 스타일시트의 css룰을 다 가져옴
    let objLen=Object.keys(percentArr).length
    let cnt = 0;
    let percent = [0, 30, 40, 50, 60, 70, 100];
    
    //1.차트컨트롤
    //CSS의 키프레임을 직접적으로 제어
    for (i of cssChart) {
        //css키프레임타입&&객체의길이만큼실행
        if (i.type === 7&&cnt>=objLen) {
            let percentage=percentArr[cnt]["percentage"]<100?percentArr[cnt]["percentage"]:100
            let amt=percentArr[cnt]["amt"]
    
            //0%생략
            if ( percentage == 0) {
                cnt += 1;
                continue;
            }
debugger
            //퍼센트추가
            i[1].style.cssText = `width:${amt}%;`;
            
            //다음행
            cnt += 1;
        }
    }

    //2.차트컨트롤
    //키프레임의 width와 span의 width를 동일한 퍼센트를 줘야한다(포인트)
    document.querySelectorAll("#chartTop li span").forEach((e, i) => {
        //객체의길이만큼실행, 그이외엔 0퍼센트 처리
        if (i>=objLen) {
            e.style.width = "0%";
            e.innerText = "0%";
            return
        }

        let payDate=percentArr[i]["payDate"]
        let percentage=percentArr[i]["percentage"]<100?percentArr[i]["percentage"]:100
        e.style.width = `${percentage}%`;
        e.innerText = `${percentage}%`;
        e.parentElement.previousElementSibling.innerText=payDate;
    });
}

function initWeek() {
    //set week default value
    let today = new Date();
    let year = today.getFullYear();
    let week = today.getWeek().toString().lpad(2, "0");
    chartWeek.value = `${year}-W${week}`;
}

function getChart(params) {
    module
        .ajax("POST", "/chart/getChart", params)
        .then((result) => {
            let resultJson = JSON.parse(result); //menu_cd,menu_kind

            if (nullCheck(resultJson)) {
                return false;
            }
            //obj.assign() -> DeepCopy , 객체복사에 사용됨
            //map.( (e)=>(return{ 객체 })) -> 배열을 객체에 담아서 반환 
            //결과적으로 {{..},{..}} 이 된다
            //ARRAY to OBJ (key:value)
            const obj = Object.assign(
                {},
                resultJson.map((e) => ({
                    "payDate": e.PAY_DATE,
                    "amt": e.AMT,
                    "percentage": e.PERCENTAGE
                }))
            );
            
            initChart(obj);
        })
        .catch((result) => {
            console.log(result);
        });
}

/**SUBMIT RELOAD 방지 3가지
 * 첫째, 버튼을 form 태그 밖으로 뺀다.
 * 둘째, 제출 버튼을 만들 때, type을 ‘button’으로 명시한다.
 * 셋째, 자바스크립트 submit 이벤트 실행 시, event.preventDefault() 추가한다.
 */
document.querySelector("#chartForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let amount = document.querySelector("#chartAmt").value;
    let date = document.querySelector("#chartWeek").value;
    let isOk = true;

    if (nullCheck(amount)) {
        alert("금액을 입력해주세요");
        isOk = false;
    }

    if (nullCheck(date)) {
        alert("일자를 선택해주세요");
        isOk = false;
    }

    //AJAX
    if (isOk) {
        getChart({ amount: amount, date: date });
    }
});
