'''
환경설정파일
'''
import os

# 상속할 부모파일


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
    
