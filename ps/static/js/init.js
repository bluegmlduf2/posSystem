/**
 * INIT
 */
(function init() {
    /**메뉴중분류가져오기 */
    module
        .ajax("POST", "/order/menu")
        .then((result) => {
            document.querySelectorAll("#orderMidMidMenu>ul>li").forEach((btn) => {
                let resultJson=JSON.parse(result)
                debugger
                resultJson.map((val,idx)=>{
                    //menu_cd,menu_kind
                    btn.innerHTML=val.menu_kind
                })
            })
        })
        .catch((result) => {
            console.log(result);
        });
})();
