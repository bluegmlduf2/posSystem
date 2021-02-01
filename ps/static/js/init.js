/**
 * INIT
 */


//함수선언문의 hoisting 때문에 호출문이 먼저와도 실행이 된다.
setMenu(); //메뉴중분류가져오기

/**
 * 메뉴중분류가져오기
 */
function setMenu() {
    module
        .ajax("POST", "/order/menu")
        .then((result) => {
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
            console.log(result);
        });
}
