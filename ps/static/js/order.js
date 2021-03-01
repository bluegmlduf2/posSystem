// Get modal element
//아쉬운점..document.querySelector("#menuList tbody")같은 경우는 함수 내부에서 초기화 되는 경우가 아니면 const로 할것..
const modal_order = document.querySelector("#orderBg");
const modalBtn_order = document.querySelectorAll(".ordBtn");
const closeBtn_order = document.querySelectorAll(".ordcloseBtn");
let delChk=false;
let deletedItems=new Array();

/**********************************GLOBAL VALUES************************************************* */

// Get open modal button
modalBtn_order.forEach((btn) => {
    btn.addEventListener("click", openModal);
})

// Get close button
closeBtn_order.forEach((btn) => {
    btn.addEventListener("click", ()=>{closeModal()});//이벤트파라미터가 e가 1번파라미터로 전송되어서 이렇게 처리
});

// Listen for outside click
window.addEventListener("click", outsideClick);

/**
 * Open modal
 */
function openModal() {
    //querySelector의 결과가 없다면 null반환
    if (!document.querySelector(".seat.active")) {
        alert("좌석을 선택해주세요.");
        return;
    }

    let liTag = document.querySelector(".seat.active").children[0].children;
    let resvChk=liTag[3].innerText;
    
    //string.indexOf("serachWord") = -1 (같지않음)
    if(resvChk.indexOf("예약중")>-1){
        if (!confirm("예약 좌석에 주문하겠습니까?")) {
            return;
        }
    }
    
    document.querySelector("#orderTop1 span").innerHTML = liTag[0].innerHTML;
    modal_order.style.display = "block"; /* none -> display */

    /**기존 주문정보가 있을 시 불러옴  */
    let orderCd=liTag[0].children[0].dataset.orderCd//부모로부터 받은 주문번호    

    if(!nullCheck(orderCd)){
        module
        .ajax("POST", "/order/orderList", { orderList: {"orderCd":orderCd} })
        .then((result) => {
            let resultJson = JSON.parse(result); 
            let tbodyEle = document.querySelector("#menuList tbody");

            resultJson.forEach((e,i)=>{
                let trEle = document.createElement("tr");
                trEle.setAttribute("id", `order${i+1}`);

                //기존 주문 내역 추가
                var a1 = document.createElement("td");
                var a2 = document.createElement("td");
                var a3 = document.createElement("td");
                var a4 = document.createElement("td");
                var a5 = document.createElement("td");
        
                a1.setAttribute("data-val", e.MENU_DETAIL_CD); // a1.dataset.val=orderAddData.MENU_DETAIL_CD
                a1.setAttribute("data-time", e.ORDER_DETAIL_TIME); // a1.dataset.time=orderAddData.ORDER_DETAIL_TIME
                a1.innerText = i+1;
                a2.innerText = e.MENU_NM;
                a3.innerText = `(${e.ORDER_DETAIL_TIME.substring(11,13)}시 ${e.ORDER_DETAIL_TIME.substring(14,16)}분)`;
                a4.innerText = addComma(e.ORDER_COUNT);
                a5.innerText = addComma(e.ORDER_AMOUNT);
        
                trEle.appendChild(a1);
                trEle.appendChild(a2);
                trEle.appendChild(a3);
                trEle.appendChild(a4);
                trEle.appendChild(a5);
        
                tbodyEle.appendChild(trEle);
                
                //주문리스트 선택시 하이라이트 주기 이벤트(active)
                trEle.addEventListener("click", () => {
                    trEle.classList.toggle("active");
                });
            })

            //총합구하기
            document.querySelector("#bottomTot").textContent = addComma(getTotal());
            removeMenuListActive();
        })
        .catch((result) => {
            alert(result.message)
            console.error(result.message);
        });
    }    
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

/**
 * 총합구하기
 */
function getTotal() {
    let tot = 0;
    document.querySelectorAll("#menuList tbody tr").forEach((e, i) => {
        tot += Number(removeComma(e.childNodes[4].textContent));
    });
    return tot;
}

/**
 * 왼쪽 주문리스트 하이라이트 제거
 */
function removeMenuListActive() {
    document.querySelectorAll("#menuList tbody tr").forEach((btn, idx) => {
        btn.classList.remove("active");
    });
}
/**
 * 오른쪽 주문메뉴 하이라이트 제거
 */
function removeSmlMenuListActive() {
    document.querySelectorAll("#orderSmallMenu ul li").forEach((btn, idx) => {
        btn.classList.remove("active");
    });
}

/**
 * 행의 상태가져오기
 */
function checkStatus() {
    let updChk=false//수정된행이 있으면 true

    document.querySelectorAll("#menuList tbody tr").forEach((e, i) => {
        let status=e.children[0].getAttribute("data-status")
        if(status=='I'||status=='U'){
            updChk=true        
        }
    });
    
    return updChk;
}

/**
 * 이전에 삭제된 항목중에 아직 저장되지 않은 항목이 있을경우.
 */
function checkDeleteBefore(param) {
    let delBefChk=false//이전에 삭제된 행이 있으면 true
    let filteredArr=deletedItems.filter((e)=>{
        return e.menuDetailCd==param;
    });

    //이미 삭제한 이력이 있는 경우
    if (filteredArr.length>0) {
        delBefChk=true;
    }

    return delBefChk;
}
/**************************이벤트 핸들링**************************/

// 모든 버튼 CLICK 시 STATE변경
document.querySelectorAll(".button").forEach((btn) => {
    let classChk = module.hasClass(btn.classList, ["b_btn", "m_btn", "s_btn"]);
    if (classChk[0]) {
        //클릭시 초기화 후 체크
        btn.addEventListener("click", () => {
            document.querySelectorAll("." + classChk[1]).forEach((elem) => {
                elem.classList.remove("active");
            });
            btn.classList.toggle("active");
        });
        // 더블클릭시 체크 해제
        btn.addEventListener("dblclick", () => {
            btn.classList.toggle("active");
        });
    }
});

/**
 * 메뉴소분류가져오기
 */
document.querySelectorAll("#orderMidMidMenu>ul>li").forEach((elem) => {
    elem.addEventListener("click", (e) => {
        if (nullCheck(e.target.innerText)) {
            e.target.classList.remove("active");
            return false;
        }
        let args = elem.getAttribute("data-val");

        module
            .ajax("POST", "/order/menuDetail", { menuCd: args })
            .then((result) => {
                let resultJson = JSON.parse(result); //menu_cd,menu_kind

                document
                    .querySelectorAll("#orderSmallMenu>ul>li")
                    .forEach((btn, idx) => {
                        btn.innerHTML = "";
                        btn.removeAttribute("data-val");
                        btn.classList.remove("active");

                        if (nullCheck(resultJson[idx])) {
                            return; //continue
                        }

                        let menuNm = resultJson[idx].MENU_NM;
                        let menuPrice = resultJson[idx].MENU_PRICE;
                        btn.innerHTML = `${menuNm}<br>${addComma(menuPrice)}`;
                        btn.setAttribute(
                            "data-val",
                            JSON.stringify(resultJson[idx])
                        );
                    });
            })
            .catch((result) => {
                console.log(result);
            });
    });
});

/**
 * 메뉴소분류클릭
 */
document.querySelectorAll("#orderSmallMenu>ul>li").forEach((btn, idx) => {
    btn.addEventListener("dblclick", () => {
        btn.classList.remove("active");
    });
});

/**
 * 신규 추가 버튼 클릭
 * (중간에 완전 종료를 위해 try/catch사용)
 */
document.querySelector("#btnOrderAdd").addEventListener("click", (e) => {
    try {
        let orderAddData = null;
        let orderKeys = null;

        document.querySelectorAll("#orderSmallMenu ul li").forEach((btn, idx) => {
            var chk = module.hasClass(btn.classList, "active");

            if (chk[0]) {
                //공백체크
                if (nullCheck(btn.innerText)) {
                    btn.classList.remove("active");
                    return false;
                }
                    
                //dataset->JSONobj
                orderAddData = JSON.parse(btn.dataset.val);

                //이전에 삭제된 항목중에 아직 저장되지 않은 항목이 있을경우.
                if(checkDeleteBefore(orderAddData.MENU_DETAIL_CD)){
                    throw new Error("삭제된 항목중에 아직 저장되지 않은 항목이 존재합니다.\n먼저 저장해주세요.")
                    // throw {message:"삭제된 항목중에 아직 저장되지 않은 항목이 존재합니다.\n먼저 저장해주세요."}
                    //1. exception이 없기때문에 객체를 생성해서 넘겨줌 2.new Error()는 존재함으로 Error사용
                }
            }
        });

        if (!orderAddData) {
            alert("추가할 항목을 선택해주세요");
            return;
        }
        //NodeList를 Array로 받음 ==  [...document.querySelectorAll("#menuList tbody tr")]
        //reduce(callbackFunc((리턴된값,현재값)=>),acc의최초값[없으면배열의0번째가최초acc가됨]) ..
        orderKeys = Array.from(
            document.querySelectorAll("#menuList tbody tr")
        ).reduce((acc, cur) => {
            var orderCnt = Number(cur.getAttribute("id").substring(5)) + 1;
            return acc > orderCnt ? acc : orderCnt; //retrun 값이 다음의 acc가 됨
        }, 1);

        let tbodyEle = document.querySelector("#menuList tbody");
        let trEle = document.createElement("tr");
        trEle.setAttribute("id", `order${orderKeys}`);

        //이미 같은 메뉴를 등록한 경우
        let keyNum = [false];
        document.querySelectorAll("#menuList tbody tr td").forEach((e, i) => {
            var detailCd_bef = e.getAttribute("data-val");
            var detailCd_aft = orderAddData.MENU_DETAIL_CD;
            if (detailCd_bef == detailCd_aft) {
                //keyNum = [true, e.parentNode.getAttribute("id")];
                keyNum = [true, e.parentNode];
            }
        });

        if (keyNum[0]) {
            //동일한 주문이 이미 있을경우
            keyNum[1].children[0].dataset.status = "U"; //기존주문이있을경우 상태변경
            keyNum[1].children[0].dataset.time = module.getCurDateHyphen(); //기존주문이있을경우 시간
            keyNum[1].children[2].innerText = `(${module.getCurTime()})`;
            keyNum[1].children[3].innerText = addComma(
                Number(keyNum[1].children[3].innerText) + 1
            );
            keyNum[1].children[4].innerText = addComma(
                Number(removeComma(keyNum[1].children[4].innerText)) +
                    Number(orderAddData.MENU_PRICE)
            );
        } else {
            //신규주문
            var a1 = document.createElement("td");
            var a2 = document.createElement("td");
            var a3 = document.createElement("td");
            var a4 = document.createElement("td");
            var a5 = document.createElement("td");

            a1.setAttribute("data-status", "I"); //신규 주문이있을경우 상태변경
            a1.setAttribute("data-val", orderAddData.MENU_DETAIL_CD); // a1.dataset.val=orderAddData.MENU_DETAIL_CD
            a1.setAttribute("data-time", module.getCurDateHyphen()); // 신규 주문이있을경우 시간
            a1.innerText = orderKeys;
            a2.innerText = orderAddData.MENU_NM;
            a3.innerText = `(${module.getCurTime()})`;
            a4.innerText = addComma(1);
            a5.innerText = addComma(orderAddData.MENU_PRICE);

            trEle.appendChild(a1);
            trEle.appendChild(a2);
            trEle.appendChild(a3);
            trEle.appendChild(a4);
            trEle.appendChild(a5);

            tbodyEle.appendChild(trEle);
        }

        //주문리스트 선택시 하이라이트 주기 이벤트(active)
        trEle.addEventListener("click", () => {
            trEle.classList.toggle("active");
        });

        //총합구하기
        document.querySelector("#bottomTot").textContent = addComma(getTotal());
        removeMenuListActive();
    }catch (error) {
        alert(error.message)
        console.error(error.message)
    }
});

//주문 선택취소
document.querySelector("#btnOrderRemove").addEventListener("click", () => {
    let selectedList = [];//DeletedData
    let trEle = document.querySelectorAll("#menuList tbody tr");

    trEle.forEach((e, i) => {
        var chk = module.hasClass(e.classList, "active");
        if (chk[0]) {
            let selectedObj=new Object();
            selectedObj.orderId=e.getAttribute("id");
            selectedObj.menuDetailCd=e.children[0].dataset.val;
            selectedList.push(selectedObj);
        }
    });
    
    //0건 체크
    if (selectedList.length < 1) {
        alert("삭제할 항목을 선택해주세요.");
        return false;
    }

    if (confirm(`선택한 ${selectedList.length}건의 주문을 삭제하시겠습니까?`)) {
        selectedList.forEach((e) => {
            trEle.forEach((elem, idx) => {
                if (e.orderId == elem.getAttribute("id")) {
                    deletedItems.push(e)//deleteList에 담기 : DB로 넘길자료
                    document.querySelector("#menuList tbody").removeChild(elem);
                }
            });
        });
    }

    document.querySelector("#bottomTot").textContent = addComma(getTotal());
    removeMenuListActive();
    removeSmlMenuListActive();
    delChk=true;//행 삭제시 상태변경
});

//전체 주문 취소
document.querySelector("#btnOrderCancelAll").addEventListener("click", () => {
    if (confirm("주문목록을 전부 삭제하겠습니까?")) {
        //주문리스트의 모든 항목을 삭제리스트에 등록
        document.querySelectorAll("#menuList tbody tr").forEach((e, i) => {
            let selectedObj=new Object();
            selectedObj.orderId=e.getAttribute("id");
            selectedObj.menuDetailCd=e.children[0].dataset.val;
            deletedItems.push(selectedObj);//deleteList에 담기 : DB로 넘길자료
        });

        document.querySelector("#menuList tbody").innerHTML = "";
        document.querySelector("#bottomTot").textContent = addComma(getTotal());
        removeMenuListActive();
        removeSmlMenuListActive();
        delChk=true;//행 삭제시 상태변경
        alert("주문목록을 전부 지웠습니다.\n저장을 위해 주문버튼을 눌러주세요")
    }
});

/**
 * 주문추가삭제 플러스 마이너스 버튼 
 */
document.querySelectorAll("#btnOrderPlus,#btnOrderMinus").forEach((e, i) => {
    e.addEventListener("click", (event) => { 
        try {
            let curEleId = event.target.getAttribute("id");
            let status = curEleId == "btnOrderPlus" ? "추가" : "삭제";
            let trEle = document.querySelectorAll("#menuList tbody tr");
            let nodata=true //주문리스트에 데이터 체크
            
            //let orderList = [];
            //주문리스트 엘리먼트 가져오기
            // trEle.forEach((e, i) => {
            //     var chk = module.hasClass(e.classList, "active");
            //     if (chk[0]) {
            //         orderList.push(e.getAttribute("id"));
            //     }
            // });

            //선택된 리스트가 있는지 체크
            /** 
            if (orderList.length != 1) {
                alert(`주문리스트에서 ${status}할 \n하나의 항목을 선택해주세요.`);
                return false;
            }
            */

            let selectedMenu = null; //선택한 상품정보

            document
                .querySelectorAll("#orderSmallMenu ul li")
                .forEach((btn, idx) => {
                    var chk = module.hasClass(btn.classList, "active");
                    //액티브체크
                    if (chk[0]) {
                        //공백체크
                        if (nullCheck(btn.innerText)) {
                            btn.classList.remove("active");
                            return false;
                        }
                        //dataset->JSONobj
                        selectedMenu = JSON.parse(btn.dataset.val);
                        
                        //이전에 삭제된 항목중에 아직 저장되지 않은 항목이 있을경우.
                        if(checkDeleteBefore(selectedMenu.MENU_DETAIL_CD)){
                            throw new Error("삭제된 항목중에 아직 저장되지 않은 항목이 존재합니다.\n먼저 저장해주세요.")
                            //throw {message:"삭제된 항목중에 아직 저장되지 않은 항목이 존재합니다.\n먼저 저장해주세요."}
                            //1. exception이 없기때문에 객체를 생성해서 넘겨줌 2.new Error()는 존재함으로 Error사용
                        }
                    }
                });

            if (!selectedMenu) {
                alert(`메뉴 리스트에서 ${status}할 항목을 선택해주세요`);
                return;
            }

            trEle.forEach((elem, idx) => {
                if (elem.children[0].dataset.val == selectedMenu.MENU_DETAIL_CD) {
                    nodata=false//데이터가 존재함으로 false

                    //추가
                    if (curEleId == "btnOrderPlus") {
                        //주문리스트와 선택메뉴가 동일한 메뉴인지 체크

                        elem.children[2].innerText = `(${module.getCurTime()})`;
                        elem.children[3].innerText = addComma(
                            Number(elem.children[3].innerText) + 1
                        );
                        elem.children[4].innerText = addComma(
                            Number(removeComma(elem.children[4].innerText)) +
                                Number(selectedMenu.MENU_PRICE)
                        );

                        // elem.children[3].classList.add("blink");
                    } else if (curEleId == "btnOrderMinus") {
                        //삭제
                        let itemCnt = Number(elem.children[3].innerText);
                        if (itemCnt < 2) {
                            alert("수량이 1개뿐입니다");
                            return;
                        }

                        elem.children[2].innerText = `(${module.getCurTime()})`;
                        elem.children[3].innerText = itemCnt - 1;
                        elem.children[4].innerText = addComma(
                            Number(removeComma(elem.children[4].innerText)) -
                                Number(selectedMenu.MENU_PRICE)
                        );
                    }
                    elem.children[0].dataset.time = module.getCurDateHyphen(); //기존주문이있을경우 시간변경
                    elem.children[0].dataset.status = "U"; //기존주문이있을경우 상태변경
                    //깜빡임 효과
                    //Animation API
                    //element.animate(keyframes, options);
                    //애니메이션 2가지 패턴
                    //transform:translate(), scale(), rotate(), skew() 4종 //요소변형
                    //transition:left 1.5s //요소속성 변경
                    elem.children[3].animate(
                        [
                            { opacity: 1 },
                            { transform: "scale(2)", color: "#ff0000" },
                            { opacity: 0 },
                        ],
                        {
                            //options
                            duration: 300,
                            iterations: 3,
                        }
                    );
                } 
            });

            //일치하는데이터가 없을 경우
            if(nodata){
                alert("선택된 메뉴가 주문리스트에 없습니다 \n신규추가 해주세요.");
                return;
            }

            //총합
            document.querySelector("#bottomTot").textContent = addComma(getTotal());
        } catch (error) {
            debugger
            alert(error.message)
            console.error(error.message)
        }
    });
});

/**
 * 주문버튼
 */
document.querySelector("#btnOrder").addEventListener('click',()=>{
    let tabNum=document.querySelector('#orderTop1 span').innerText;
    let orderItems=new Array()
    let orderListTr=document.querySelectorAll("#menuList tbody tr");
    
    //추가&수정리스트 && 삭제리스트
    if(nullCheck(orderListTr)&&nullCheck(deletedItems)){
        alert('주문리스트를 추가해주세요.')
        return
    }
    orderListTr.forEach((e, i) => {
        //let today = new Date();
        //let date = `${today.getFullYear()}-${(today.getMonth()+1).toString().lpad(2,'0')}-${today.getDate().toString().lpad(2,'0')} ` ;//TODAY
        //let date = module.getCurDateHyphen();
        //let time=`${e.childNodes[2].innerText.substring(1,3)}:${e.childNodes[2].innerText.substring(5,7)}`;

        let itemInfo=new Object()
        itemInfo.orderAmount=Number(removeComma(e.childNodes[4].textContent))//금액
        itemInfo.orderCount=Number(e.childNodes[3].textContent)//수량
        itemInfo.menuDetailCd=e.childNodes[0].dataset.val//아이템번호
        itemInfo.orderDeatilTime=e.childNodes[0].dataset.time//아이템등록일자
        orderItems.push(itemInfo)
    });

    //삭제할 데이터가 있을 시
    if(deletedItems.length>0){
        deletedItems.forEach((e,i)=>{
            orderItems.push(e)
        })
    }

    module
    .ajax("POST", "/order/insertOrder", { orderList: {"tableCd":tabNum,"orderItems":orderItems} })
    .then((result) => {
        let resultJson = JSON.parse(result); //menu_cd,menu_kind
        let status=resultJson.status
        let message=resultJson.message
        
        if(status){
            alert(message)
            closeModal(true)
        }else{
            //사용자 예외
            alert(message)
        }
    })
    .catch((result) => {
        alert(result.message)
        console.error(result.message);
    });
})

