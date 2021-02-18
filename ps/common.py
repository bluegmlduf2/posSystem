import time
import traceback
import simplejson as json # dumps(객체) ->json문자열 , loads(json문자열) ->객체
from database import Connection

def decorate(func):
    print ("##### 메소드 시작 => ("+func.__name__+")#####")
    start = time.time()
    end = time.time()
    print ("##### 메소드 종료 #####")
    print ("소요시간: %5f" % (end-start))

#유저에러_Exception상속
class UserError(Exception):
    def __init__(self, msg):
        self.msg = msg
    
    #객체가 print함수에 호출될때 표시되는 함수
    def __str__(self):
        return self.msg
