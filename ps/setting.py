'''
환경설정파일
'''
import os

# 상속할 부모파일


class InitConf(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.urandom(16)
    
class TestMode(InitConf):
    TESTNG = True

class DevMode(InitConf):
    DEBUG = True