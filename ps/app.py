'''
Flask를 실행할 프로그램
factory_app로부터 app의 반환값을 받아서 실행한다
'''
import os

from factory_app import create_app

app = create_app('dev')  # chose test, dev, pro

if __name__ == '__main__':
    # flask_path설정은 app.py일 경우 해주지 않아도 된다
    app.run()