'''
환경설정파일
'''
import os

# 상속할 부모파일

#기본적으로 모든 클래스는 object를 상속받으므로 클래스명(object)를 사용할 필요가 없지만 파이선2에서는 클래스명(object)가 old-style 클래스를 생성하였기에 이렇게 사용함. 즉 (object)를 안적어도 된다.
class InitConf(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.urandom(16)
    JSON_AS_ASCII = False #json반환값 인코딩 ascii -> utf8 : app.config['JSON_AS_ASCII'] = False
    
class TestMode(InitConf):
    MESSAGE = '---TEST---'
    TESTNG = True

class DevMode(InitConf):
    MESSAGE = '---Development---'
    DEBUG = True
    
