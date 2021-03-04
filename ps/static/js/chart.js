const modal_chart = document.querySelector("#chartBg");

/**********************************GLOBAL VALUES************************************************* */

// Get open modal button
document.querySelector("#btnChart").addEventListener("click",openModal);

// Get close button
document.querySelector("#btnChartClose").addEventListener("click", ()=>{closeModal()});//이벤트파라미터가 e가 1번파라미터로 전송되어서 이렇게 처리

// Listen for outside click
window.addEventListener("click", outsideClick);

/**
 * Open modal
 */
function openModal() {    
    modal_chart.style.display = "block"; /* none -> display */
    let chartWeek=document.querySelector("#chartWeek");
    chartWeek.value= (new Date()).toISOString().split('T')[0];

    initChart();
}

/**
 * Close modal
 */
function closeModal() {
    location.reload()//새로고침
}

// Click outside and close (모달 밖을 클릭)
function outsideClick(e) {
    if (e.target == modal_chart) {
        closeModal();
    }
}

function initChart() {
    //for of = 이터러블을 가진 객체에서 사용 가능 Symbol.iterator
    let cssChart=document.styleSheets[5].cssRules//해당페이지의 5번째 스타일시트의 css룰을 다 가져옴
    let cnt=0;
    let percent=[0,30,40,50,60,70,100]
    
    //1.차트컨트롤
    //CSS의 키프레임을 직접적으로 제어
    for (i of cssChart){
        if (i.type === 7){
            if(percent[cnt]==0){
                cnt+=1
                continue
            }
            i[1].style.cssText=`width:${percent[cnt]}%;`;
            cnt+=1
        } 
    }

    //2.차트컨트롤
    //키프레임의 width와 span의 width를 동일한 퍼센트를 줘야한다(포인트)
    document.querySelectorAll("#chartTop li span").forEach((e,i)=>{
        e.style.width=`${percent[i]}%`;
        e.innerText=`${percent[i]}%`;
    })
}

function initWeek() {
    //set week default value
    let today = new Date();
    let year = today.getFullYear();
    let week = today.getWeek().toString().lpad(2,"0");
    chartWeek.value=`${year}-W${week}`
}