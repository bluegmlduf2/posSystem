from flask import jsonify
from database import Connection

def getMenu(args):
    conn= Connection()
    if conn:
        try:
            sql= "select menu_cd,menu_kind from menu_tbl"
            data= conn.executeAll(sql)
            json_data=jsonify(data)
            return json_data
        except Exception as e:
            return jsonify({'message': f'{e}'}), 400

# # INSERT 함수 예제
# @test.route('/insert', methods=['GET'])
# def insert():
#     db_class= dbModule.Database()
 
#     sql     = "INSERT INTO testDB.testTable(test) \
#                 VALUES('%s')"% ('testData')
#     db_class.execute(sql)
#     db_class.commit()
 
#     return render_template('/test/test.html',
#                            result='insert is done!',
#                            resultData=None,
#                            resultUPDATE=None)
 
 
 
# # SELECT 함수 예제
# @test.route('/select', methods=['GET'])
# def select():
#     db_class= dbModule.Database()
 
#     sql     = "SELECT idx, test \
#                 FROM testDB.testTable"
#     row     = db_class.executeAll(sql)
 
#     print(row)
 
#     return render_template('/test/test.html',
#                             result=None,
#                             resultData=row[0],
#                             resultUPDATE=None)
 
 
 
# # UPDATE 함수 예제
# @test.route('/update', methods=['GET'])
# def update():
#     db_class= dbModule.Database()
 
#     sql     = "UPDATE testDB.testTable \
#                 SET test='%s' \
#                 WHERE test='testData'"% ('update_Data')
#     db_class.execute(sql)   
#     db_class.commit()
 
#     sql     = "SELECT idx, test \
#                 FROM testDB.testTable"
#     row     = db_class.executeAll(sql)
 
#     return render_template('/test/test.html',
#                             result=None,
#                             resultData=None,
#                             resultUPDATE=row[0])