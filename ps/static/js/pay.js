// Get modal element
const modal_pay = document.querySelector("#payBg");
const modalBtn_pay = document.querySelectorAll(".payBtn");
const closeBtn_pay = document.querySelectorAll(".paycloseBtn");

/**********************************GLOBAL VALUES************************************************* */

modalBtn_pay.forEach((btn) => {
    btn.addEventListener("click", openModal);
});

// Get close button
closeBtn_pay.forEach((btn) => {
    btn.addEventListener("click", closeModal);
});

// Listen for outside click
window.addEventListener("click", outsideClick);

/**
 * Open modal
 */
function openModal() {
    if (!document.querySelector(".seat.active")) {
        alert("좌석을 선택해주세요.");
        return;
    }

    let liTag = document.querySelector(".seat.active").children[0].children;

    document.querySelector("#payTabNum").innerHTML = liTag[0].innerHTML;
    modal_pay.style.display = "block"; /* none -> display */
    
    /**기존 주문정보가 있을 시 불러옴  */
    let orderCd=liTag[0].children[0].dataset.orderCd//부모로부터 받은 주문번호    

    if(!nullCheck(orderCd)){
        module
        .ajax("POST", "/order/orderList", { orderList: {"orderCd":orderCd} })
        .then((result) => {
            let resultJson = JSON.parse(result); 
            let tbodyEle = document.querySelector("#payList tbody");

            resultJson.forEach((e,i)=>{
                let trEle = document.createElement("tr");
                trEle.setAttribute("id", `pay${i+1}`);

                //기존 주문 내역 추가
                var a1 = document.createElement("td");
                var a2 = document.createElement("td");
                var a3 = document.createElement("td");
                var a4 = document.createElement("td");
                
                a1.setAttribute("data-val", e.MENU_DETAIL_CD); // a1.dataset.val=orderAddData.MENU_DETAIL_CD
                a1.setAttribute("data-time", e.ORDER_DETAIL_TIME); // a1.dataset.time=orderAddData.ORDER_DETAIL_TIME
                a1.innerText = e.MENU_NM;
                a2.innerText = `( ${e.ORDER_DETAIL_TIME.substring(11,13)}시 ${e.ORDER_DETAIL_TIME.substring(14,16)}분 )`;
                a3.innerText = addComma(e.ORDER_COUNT);
                a4.innerText = addComma(e.ORDER_AMOUNT);
                if(i%2==0)trEle.classList.add("alt")//짝수에 색넣기 (0부터 시작)
                
                trEle.appendChild(a1);
                trEle.appendChild(a2);
                trEle.appendChild(a3);
                trEle.appendChild(a4);
                
                tbodyEle.appendChild(trEle);
            })
            //총합구하기
            document.querySelector("#payTot").textContent = addComma(getPayTotal());
        })
        .catch((result) => {
            debugger
            alert(result.message)
            console.error(result.message);
        });
    }    
}

/**
 * Close modal
 */
function closeModal() {
    modal_pay.style.display = "none";
    location.reload()//새로고침
}

// Click outside and close
function outsideClick(e) {
    //e.target & modal_pay => payBg(background)
    if (e.target == modal_pay) {
        modal_pay.style.display = "none";
    }
}

/**
 * 총합구하기
 */
function getPayTotal() {
    let tot = 0;
    document.querySelectorAll("#payList tbody tr").forEach((e, i) => {
        tot += Number(removeComma(e.childNodes[3].textContent));
    });
    return tot;
}

/**************************이벤트 핸들링**************************/
//결제버튼
document.querySelectorAll("#payCard,#payMoney").forEach((elem) => {
    elem.addEventListener("click",(e)=>{
        let tabNum=document.querySelector("#payTabNum").innerText;
        let orderCd=document.querySelector("#payTabNum span").dataset.orderCd;
        let btnId=e.target.getAttribute("id");
        let status=btnId=="payCard"?["카드",0]:["현금",1];
        let amount=document.querySelector("#payTot").innerText;
        let msg=`${tabNum}번 테이블의 금액 ${amount}원을 ${status[0]}결제 하시겠습니까?`
        
        if(confirm(msg)){
            module
            .ajax("POST", "/pay/insertPay", {"tableCd":tabNum,"orderCd":orderCd,"payType":status[1]})
            .then((result) => {
                let resultJson = JSON.parse(result);
                let status=resultJson.status
                let message=resultJson.message

                if(status){
                    alert(message)
                    closeModal(true)
                }else{
                    //사용자 예외
                    alert(message)
                }
            }).catch((result) => {
                alert(result.message)
                console.error(result.message);
            });
        }
    })
});
// document.querySelector("#payCard").addEventListener('click',()=>{})