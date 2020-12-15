from flask import Flask,render_template,request,redirect,url_for
import json
import traceback

app=Flask(__name__)

@app.route('/daum') 
def daumMethod(): 
    return redirect("https://www.daum.net/") 

@app.route('/') 
def main(): 
    return redirect(url_for('daumMethod')) #url_for('함수명'),url_for('static')

#flask run & python app.py
# if __name__ == '__main__': 
#     app.run(debug=true)
