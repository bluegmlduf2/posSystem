'''
Flask설정
'''
from flask import Flask, render_template, request, redirect, url_for, Blueprint
import traceback
from controller import table 

dict_confmode = {
    'test': 'setting.TestMode',
    'dev': 'setting.DevMode'
}

# Application Factories (it can have instances of the application with different settings)
def create_app(config_mode="test"):
    # Flask실행파일을 읽음
    app = Flask(__name__)
    # Flask의 환경설정 파알을 읽음
    confmode = dict_confmode[config_mode]
    app.config.from_object(confmode)#매개변수:경로와 파일의 클래스명

    # コントローラ読込
    # app.register_blueprint(post_ctr)
    # モデルインスタンス初期化
    # database.init_db(app)

    #매개변수로 bluePrint객체를 받는다. 그러나 import해서 해당 컨트롤러에 blueprint객체를 가져와서 사용
    app.register_blueprint(table.table_ab, url_prefix='/table')
    app.register_blueprint(table.table_ab, url_prefix='/table')

    return app


# @app.errorhandler(404)
# def page_not_found(error):
#     return "페이지가 없습니다. URL를 확인 하세요", 404


# # flask run & python app.py
# # if __name__ == '__main__':
# app.run(debug=True)
