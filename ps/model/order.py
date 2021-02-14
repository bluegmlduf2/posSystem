from flask import jsonify
from database import Connection


def getMenu(args):
    conn = Connection()
    if conn:
        try:
            sql = "select menu_cd,menu_kind from menu_tbl"
            data = conn.executeAll(sql)
            json_data = jsonify(data)
            return json_data
        except Exception as e:
            return jsonify({'message': f'{e}'}), 400


def getMenuDetail(args):
    conn = Connection()
    if conn:
        try:
            sql = '''SELECT MENU_DETAIL_CD, MENU_CD, MENU_NM, MENU_PRICE, MENU_COST
            FROM MENU_DETAIL_TBL WHERE MENU_CD = {menuCd}'''.format(menuCd=args['menuCd'])
            data = conn.executeAll(sql)
            json_data = jsonify(data)
            return json_data
        except Exception as e:
            return jsonify({'message': f'{e}'}), 400


def insertOrder(args):
    conn = Connection()
    if conn:
        try:
            tableCd = args['orderList']['tableCd']
            orderItems = args['orderList']['orderItems']

            #주문등록
            sql = '''INSERT INTO posDB.ORDER_TBL
            (TABLE_CD)
            VALUES({tableCd})'''.format(tableCd=tableCd)

            data = conn.execute(sql)
            orderCd = conn.insertLastKey()

            #테이블사용등록
            sql = '''UPDATE posDB.TABLE_TBL SET ORDER_CD={orderCd}
            WHERE TABLE_CD={tableCd}'''.format(orderCd=orderCd, tableCd=tableCd)

            data = conn.execute(sql)

            #주문상세등록
            for e in orderItems:
                sql = '''INSERT INTO posDB.ORDER_DETAIL_TBL
                (ORDER_CD, ORDER_AMOUNT, ORDER_COUNT, MENU_DETAIL_CD)
                VALUES({orderCd}, {orderAmount}, {orderCount}, {menuDetailCd})'''.format(orderCd=orderCd,orderAmount=e["orderAmount"],orderCount=e["orderCount"],menuDetailCd=e["menuDetailCd"])

                data = conn.execute(sql)

            # sql='''
            # SELECT TABLE_CD, ORDER_CD, RESER_TIME, RESER_PEOPLE
            # FROM posDB.TABLE_TBL
            # WHERE TABLE_CD ={tableCd}
            # '''.format(tableCd=args['orderList']['tableCd'])
            # data = conn.executeAll(sql)
            # if data[0]['ORDER_CD'] is None:
            #     raise Exception('선택한 테이블이 이미 사용중입니다.')

            conn.commit()
            return jsonify({'message': 'success'}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'message': f'{e}'}), 400
        finally:
            conn.close()

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
