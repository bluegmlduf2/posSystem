const modal_chart = document.querySelector("#chartBg");

/**********************************GLOBAL VALUES************************************************* */

// Get open modal button
document.querySelector("#btnChart").addEventListener("click",openModal);

// Get close button
// document.querySelector("#btnChartClose").addEventListener("click", ()=>{closeModal()});//이벤트파라미터가 e가 1번파라미터로 전송되어서 이렇게 처리

// Listen for outside click
window.addEventListener("click", outsideClick);

/**
 * Open modal
 */
function openModal() {    
    modal_chart.style.display = "block"; /* none -> display */
    initChart();
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
/**
 * Close modal
 * @param {*} afterOrder 주문 완료 후 닫기 플래그
 */
function closeModal(afterOrder=false) {
    let updChk=checkStatus()//수정된행이 있으면 true

    //주문완료후
    if(!afterOrder){
        //주문리스트에행이존재하는경우 & 주문완료후닫을때 & 수정 & 삭제
        if (document.querySelector("#menuList tbody").hasChildNodes()&&updChk||delChk) {
            if (!confirm("주문중인 정보가 있습니다.\n취소하고 닫겠습니까?")) {
                return false;
            }
        }    
    }

    location.reload()//새로고침

    /**location.reload()를 사용하므로써 이 아래의 소스코드는 필요없음. */

    document.querySelectorAll("#orderMidMidMenu>ul>li").forEach((btn, idx) => {
        btn.classList.remove("active");
    });

    document.querySelectorAll("#orderSmallMenu>ul>li").forEach((btn, idx) => {
        btn.innerHTML = "";
        btn.removeAttribute("data-val");
        btn.classList.remove("active");
    });

    document.querySelector("#menuList tbody").innerHTML = "";
    modal_order.style.display = "none"; /* display -> none */

    //총합
    document.querySelector("#bottomTot").textContent = 0;
}

// Click outside and close (모달 밖을 클릭)
function outsideClick(e) {
    if (e.target == modal_order) {
        closeModal();
    }
}
