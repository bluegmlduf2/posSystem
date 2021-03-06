/**
 * INIT
 */


//함수선언문의 hoisting 때문에 호출문이 먼저와도 실행이 된다.
preventDrag();//드래그방지
setMenu(); //메뉴중분류가져오기
setTable(); //테이블초기화

/**
 * 드래그방지
 */
function preventDrag() {
    document.oncontextmenu = new Function("return false");//우클릭 관련
    document.onselectstart = new Function("return false"); //마우스 드래그 선택 관련
    document.ondragstart = new Function("return false");//마우스 드래그 관련
    //<body oncontextmenu="return false" ondragstart="return false" onselectstart="return false"> 
    //<div onclick="즉시실행" onclick="test()">
}

/**
 * 메뉴중분류가져오기
 */
function setMenu() {
    module
        .ajax("POST", "/order/menu")
        .then((result) => {
            //module.ajax() 내부에서 resolve가 실행된 경우 실행됨
            let resultJson = JSON.parse(result); //menu_cd,menu_kind

            document
                .querySelectorAll("#orderMidMidMenu>ul>li")
                .forEach((btn, idx) => {
                    if (nullCheck(resultJson[idx])) {
                        return; //continue
                    }
                    let menuKind = resultJson[idx].menu_kind;
                    btn.innerHTML = menuKind;
                    btn.setAttribute("data-val", resultJson[idx].menu_cd);
                });
        })
        .catch((result) => {
            //module.ajax() 내부에서 reject가 실행된 경우 실행됨
            console.log(result);
        });
}

/**
 * 테아블최초정보가져오기
 */
function setTable() {
    module
        .ajax("POST", "/table/info")
        .then((result) => {
            
            //module.ajax() 내부에서 resolve가 실행된 경우 실행됨
            let resultJson = JSON.parse(result); //menu_cd,menu_kind
            let dataMain=resultJson[0];
            let dataResv=resultJson[1];

            document
                .querySelectorAll("#table .seat")
                .forEach((tableEle, idx) => {

                    let tabNum=Number(tableEle.querySelector('.tabNum').innerText)
                    //필터함수로 배열 검색가능
                    let filterArr = dataMain.filter((e)=>{
                        return e.TABLE_CD==tabNum;
                    });

                    //필터함수로 배열 검색가능
                    let filterResvArr = dataResv.filter((e)=>{
                        return e.TABLE_CD==tabNum;
                    });

                    //일반주문추가
                    if (!nullCheck(filterArr)) {
                        tableEle.querySelector('.tabNum span').dataset.orderCd=filterArr[0].ORDER_CD //주문번호
                        tableEle.querySelector('.tabPeople span').innerText=`${filterArr[0].RESER_PEOPLE} 명` //주문인원
                        tableEle.querySelector('.tabTime span').innerText=`${filterArr[0].ORDER_TIME}` //주문시간
                        tableEle.querySelector('.tabTot span').innerText=Object.addComma(filterArr[0].AMT)+'원'//금액                            
                    }

                    //예약추가
                    if (!nullCheck(filterResvArr)) {
                        tableEle.querySelector('.tabPeople span').innerText=`${filterResvArr[0].RESER_PEOPLE} 명` //주문인원
                        tableEle.querySelector('.tabTime span').innerText=`${filterResvArr[0].RESER_TIME}` //주문시간           
                        tableEle.querySelector('.tabTot b').innerText="예약중";
                        tableEle.querySelector('.tabTot').style.left="7.5%";
                        tableEle.querySelector('.tabTot').style.bottom="-15%";
                        tableEle.querySelector('.tabTot').style.color="red";
                    }

                    // tableEle.style.borderWidth = "thick";
                });
        })
        .catch((result) => {
            //module.ajax() 내부에서 reject가 실행된 경우 실행됨
            console.log(result);
        });
}