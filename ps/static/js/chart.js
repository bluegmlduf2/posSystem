const modal_chart = document.querySelector("#chartBg");
const keyFrameArr=[] // CssKeyFream & 검색전적

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


function getChart(params) {
    module
        .ajax("POST", "/chart/getChart", params)
        .then((result) => {
            let resultJson = JSON.parse(result)[0]; //menu_cd,menu_kind
            let resultTotalJson = JSON.parse(result)[1][0]; //menu_cd,menu_kind

            if (nullCheck(resultJson)) {
                removeChart()//차트초기화
                removeChartTotal()//차트통계초기화
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
            
            removeChart()//차트초기화
            removeChartTotal()//차트통계초기화

            initChart(obj);//차트데이터
            initCharList(obj);//차트리스트 
            initChartTotal(resultTotalJson);//차트통계데이터
        })
        .catch((result) => {
            console.log(result);
        });
}

function initChart(percentArr) {
    //for of = 이터러블을 가진 객체에서 사용 가능 Symbol.iterator
    let cssChart = document.styleSheets[5].cssRules; //해당페이지의 5번째 스타일시트의 css룰을 다 가져옴
    let len=Object.keys(percentArr).length
    
    //자료가 없을 경우 차트를 그리지 않음
    if (0>len) {
        return
    }
    
    //1.차트컨트롤
    //CSS의 키프레임을 직접적으로 제어
    for (i of cssChart) {
        //해당하는 css키프레임타입을 가져오기
        if (i.type === 7) {
            keyFrameArr.push(i[1]) 
        }
    }

    //2.차트컨트롤
    //키프레임의 width와 span의 width를 동일한 퍼센트를 줘야한다(포인트)
    for (let i = 0; i < len; i++) {
        let percentage=percentArr[i]["percentage"]<100?percentArr[i]["percentage"]:100
        let payDate=percentArr[i]["payDate"]
        let spanEle=document.querySelectorAll("#chartTop li span")[i]
        spanEle.parentElement.style.display="inline-block"
        
        
        //1.keyFrame에 퍼센트 추가
        keyFrameArr[i].style.cssText=`width:${percentage}%;`;

        //2.cssElement에 퍼센트 추가
        spanEle.style.width = `${percentage}%`;
        spanEle.innerText = `${percentage}%`;
        
        //span에 일자추가
        spanEle.parentElement.previousElementSibling.innerText=payDate;
    }
}

function initCharList(percentArr) {
    let tbodyEle = document.querySelector("#chartMiddle tbody");
    
    for (const key in percentArr) {
        //method().call({a=1},c,d..) 
        //method().call(this,args..) ..this를 객체형태로 전달함
        if (Object.hasOwnProperty.call(percentArr, key)) {
            const value=percentArr[key]
            let trEle = document.createElement("tr");
            let tdDate=document.createElement("td");
            let tdAmt=document.createElement("td");
            let tdPer=document.createElement("td");
            tdDate.innerText = value.payDate
            tdAmt.innerText = addComma(value.amt)+" 원"
            tdPer.innerText = value.percentage+" %"
            trEle.appendChild(tdDate);
            trEle.appendChild(tdAmt);
            trEle.appendChild(document.createElement("td"));
            trEle.appendChild(tdPer);

            tbodyEle.appendChild(trEle);
        }
    }

}

function initChartTotal(totalArr) {
    document.querySelector("#totalSum").innerText=addComma(totalArr.SUM)+" 원"
    document.querySelector("#totalAvg").innerText=addComma(totalArr.AVG)+" 원"
    document.querySelector("#totalPerAvg").innerText=totalArr.PERAVG+" %"
}

function removeChartTotal() {
    document.querySelector("#chartMiddle tbody").innerHTML=""
    document.querySelector("#totalSum").innerText=0
    document.querySelector("#totalAvg").innerText=0
    document.querySelector("#totalPerAvg").innerText=0
}

function removeChart() {
    if(nullCheck(keyFrameArr)){
        return
    }

    for (let i = 0; i < 6; i++) {
        let spanEle=document.querySelectorAll("#chartTop li span")[i]
        spanEle.parentElement.style.display="none"
        
        //1.keyFrame에 퍼센트 추가
        keyFrameArr[i].style.cssText=`width:0%;`;

        //2.cssElement에 퍼센트 추가
        spanEle.style.width = "0%";
        spanEle.innerText = "0%";
        
        //span에 일자추가
        spanEle.parentElement.previousElementSibling.innerText="";
    }

    keyFrameArr.length=0// CssKeyFream & 검색전적 초기화
}

function initWeek() {
    //set week default value
    let today = new Date();
    let year = today.getFullYear();
    let week = today.getWeek().toString().lpad(2, "0");
    chartWeek.value = `${year}-W${week}`;
}


/**SUBMIT RELOAD 방지 3가지
 * 첫째, 버튼을 form 태그 밖으로 뺀다.
 * 둘째, 제출 버튼을 만들 때, type을 ‘button’으로 명시한다.
 * 셋째, 자바스크립트 submit 이벤트 실행 시, event.preventDefault() 추가한다.
 */
document.querySelector("#chartForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let amount = document.querySelector("#chartAmt").value.toString().replaceAll(",","");
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

document.querySelector("#btnReset").addEventListener("click",()=>{
    let curDate=module.getCurDateYMD().substring(0,10)
    document.querySelector("#chartWeek").value=curDate
})

//keyup을 사용해야 새롭게 입력된 value를 이용할수있다
document.querySelector("#chartAmt").addEventListener("keyup",(e)=>{
    let inputAmt=e.target.value
    if(e.keyCode >= 48 && e.keyCode <= 57){
        e.target.value=addComma(inputAmt)
    }
})