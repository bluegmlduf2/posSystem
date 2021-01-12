from flask import Flask,render_template,request,redirect,url_for
import json
import traceback

app=Flask(__name__)

# @app.route('/') 
# def main(): 
#     return redirect(url_for('daumMethod')) #url_for('함수명'),url_for('static')
@app.route('/table')
def index():
    '''테이블페이지'''
    try:
        return render_template('table.html')
    except Exception: 
        #sys.exc_info()
        print(traceback.print_exc())
        #return render_template('error_404.html')
        #return redirect("https://www.daum.net/") 

    finally:
        print('프로그램 종료(Exits application)')

@app.errorhandler(404)
def page_not_found(error): 
    return "페이지가 없습니다. URL를 확인 하세요", 404

#flask run & python app.py
# if __name__ == '__main__': 
app.run(debug=True)
