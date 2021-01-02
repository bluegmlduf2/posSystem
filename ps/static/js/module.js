var module = function () {
    /* * 
     * -------------------------------- 
     * 모듈 패턴을 구현한 클로저 코드 
     * (자동호출 구조가 아니므로 인스턴스화 가능) 
     * -------------------------------- 
     * */
    
    //시간함수
    function getCurTime(){ 
        let today=new Date();
        let hour=today.getHours()
        let min=today.getMinutes()
        
        return `${hour}시 ${min}분 `;
    }

    //시간+날짜함수
    function getCurDate(){
        let today=new Date();
        let days=new Array("일","월","화","수","목","금","토");
        
        let year=today.getFullYear()
        let month=today.getMonth()+1
        let date=today.getDate()
        let day=days[today.getDay()]
        let hour=today.getHours()
        let min=today.getMinutes()
        
        return `${year}년 ${month}월 ${date}일 ${day}요일 \n ${hour}시 ${min}분 `;
    }

    // 공개될 멤버 (특권 메소드) 정의 
    return {
        getCurTime:function(){ return getCurTime();},
        getCurDate:function(){ return getCurDate();}
    }
};


/**
 * 좌측문자열채우기
 * @params
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
String.prototype.lpad = function(padLen, padStr) {
    var str = this;
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};
