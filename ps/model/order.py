from common import *


def getMenu(args):
    conn = Connection()
    if conn:
        try:
            sql = "select menu_cd,menu_kind from menu_tbl"
            data = conn.executeAll(sql)
            json_data = json.dumps((data))
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400


def getMenuDetail(args):
    conn = Connection()
    if conn:
        try:
            sql = '''SELECT MENU_DETAIL_CD, MENU_CD, MENU_NM, MENU_PRICE, MENU_COST
            FROM MENU_DETAIL_TBL WHERE MENU_CD = {menuCd}'''.format(menuCd=args['menuCd'])
            data = conn.executeAll(sql)
            json_data = json.dumps(data)
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400


def getOrderList(args):
    conn = Connection()
    if conn:
        try:
            orderCd = args['orderList']['orderCd']

            sql = '''SELECT 
                OT.ORDER_CD 
                ,ODT.MENU_DETAIL_CD 
                ,MDT.MENU_NM 
                ,DATE_FORMAT(ODT.ORDER_DETAIL_TIME, '%%Y-%%m-%%d %%H:%%i:%%s') AS ORDER_DETAIL_TIME 
                ,ODT.ORDER_COUNT 
                ,ODT.ORDER_AMOUNT
                ,DATE_FORMAT(ODT.ORDER_DETAIL_TIME, '%%Y-%%m-%%d %%H:%%i:%%s') AS UPDATED_TIME
                FROM 
                posDB.ORDER_TBL AS OT
                LEFT JOIN posDB.ORDER_DETAIL_TBL AS ODT
                ON OT.ORDER_CD =ODT.ORDER_CD 
                JOIN posDB.MENU_DETAIL_TBL AS MDT
                ON ODT.MENU_DETAIL_CD = MDT.MENU_DETAIL_CD
                WHERE OT.ORDER_CD ={orderCd}
                ORDER BY UPDATED_TIME DESC
                '''.format(orderCd=orderCd)

            data = conn.executeAll(sql)
            json_data = json.dumps((data))
            return json_data
        except Exception as e:
            return json.dumps({'message': f'{e}'}), 400


def insertOrder(args):
    conn = Connection()
    if conn:
        try:
            tableCd = args['orderList']['tableCd']
            orderItems = args['orderList']['orderItems']
            reMsg = ''

            sql = '''SELECT ORDER_CD
            FROM posDB.TABLE_TBL
            WHERE TABLE_CD={tableCd}'''.format(tableCd=tableCd)
            data = conn.executeOne(sql)

            orderCd = data['ORDER_CD']  # 기존등록존재여부

            if orderCd is None:
                #주문등록
                sql = '''INSERT INTO posDB.ORDER_TBL
                (TABLE_CD)
                VALUES({tableCd})'''.format(tableCd=tableCd)
                data = conn.execute(sql)
                orderCd_new = conn.insertLastKey()

                #테이블사용등록
                sql = '''UPDATE posDB.TABLE_TBL SET ORDER_CD={orderCd} , RESER_TIME=NULL
                WHERE TABLE_CD={tableCd}'''.format(orderCd=orderCd_new, tableCd=tableCd)
                data = conn.execute(sql)

                #주문상세등록
                for e in orderItems:
                    #신규주문시 삭제내역이 있으면 등록하지않음
                    if "orderId" not in e:
                        sql = '''INSERT INTO posDB.ORDER_DETAIL_TBL
                        (ORDER_CD, ORDER_AMOUNT, ORDER_COUNT, MENU_DETAIL_CD, ORDER_DETAIL_TIME)
                        VALUES({orderCd}, {orderAmount}, {orderCount}, {menuDetailCd},STR_TO_DATE('{orderDeatilTime}', '%%Y-%%m-%%d %%H:%%i:%%s'))'''.format(
                            orderCd=orderCd_new, orderAmount=e["orderAmount"], orderCount=e["orderCount"], menuDetailCd=e["menuDetailCd"], orderDeatilTime=e["orderDeatilTime"])
                        data = conn.execute(sql)

                    reMsg = '신규 주문을 완료하였습니다'
            else:
                for e in orderItems:
                    #삭제정보체크
                    if "orderId" not in e:
                        #기존주문정보가져오기
                        sql = '''SELECT ORDER_AMOUNT, ORDER_COUNT, ORDER_DETAIL_CD
                        FROM posDB.ORDER_DETAIL_TBL
                        WHERE ORDER_CD={orderCd} AND MENU_DETAIL_CD={menuDetailCd}'''.format(
                            orderCd=orderCd, menuDetailCd=e["menuDetailCd"])
                        data = conn.executeOne(sql)

                        #기존주문정보가 존재하지 않으면 신규주문등록
                        if data is None:
                            #주문상세등록
                            sql = '''INSERT INTO posDB.ORDER_DETAIL_TBL
                            (ORDER_CD, ORDER_AMOUNT, ORDER_COUNT, MENU_DETAIL_CD, ORDER_DETAIL_TIME)
                            VALUES({orderCd}, {orderAmount}, {orderCount}, {menuDetailCd},STR_TO_DATE('{orderDeatilTime}', '%%Y-%%m-%%d %%H:%%i:%%s'))'''.format(
                                orderCd=orderCd, orderAmount=e["orderAmount"], orderCount=e[
                                    "orderCount"], menuDetailCd=e["menuDetailCd"], orderDeatilTime=e["orderDeatilTime"]
                            )
                            data = conn.execute(sql)
                        else:
                            #주문상세수정
                            sql = '''UPDATE posDB.ORDER_DETAIL_TBL
                            SET ORDER_AMOUNT={orderAmount}, ORDER_COUNT={orderCount},ORDER_DETAIL_TIME=STR_TO_DATE('{orderDeatilTime}', '%%Y-%%m-%%d %%H:%%i:%%s')
                            WHERE ORDER_CD={orderCd} AND MENU_DETAIL_CD={menuDetailCd}
                            '''.format(
                                orderCd=orderCd, orderAmount=e["orderAmount"], orderCount=e[
                                    "orderCount"], menuDetailCd=e["menuDetailCd"], orderDeatilTime=e["orderDeatilTime"]
                            )
                            data = conn.execute(sql)
                    else:
                        #주문삭제
                        sql = '''DELETE FROM posDB.ORDER_DETAIL_TBL AS ODT 
                        WHERE ODT.ORDER_CD ={orderCd} AND ODT.MENU_DETAIL_CD ={menuDetailCd}
                        '''.format(
                            orderCd=orderCd, menuDetailCd=e["menuDetailCd"]
                        )
                        data = conn.execute(sql)
                reMsg = '기존 주문을 수정하였습니다'
        except UserError as e:
            #raise UserError('사용자에러 테스트')
            return json.dumps({'status': False, 'message': e.msg}), 200
        except Exception as e:
            traceback.print_exc()
            conn.rollback()
            return json.dumps({'message': '관리자에게 문의해주세요.'}), 400
        else:
            conn.commit()
            return json.dumps({'status': True, 'message': reMsg}), 200
        finally:
            conn.close()

def cancelOrder(args):
    conn = Connection()
    if conn:
        try:
            tableCd = args['tableCd']
            reMsg = ''

            #주문취소
            sql = '''UPDATE posDB.TABLE_TBL
            SET ORDER_CD=NULL, RESER_TIME=NULL, RESER_PEOPLE=NULL
            WHERE TABLE_CD={tableCd}'''.format(tableCd=tableCd)
            data = conn.execute(sql)

            reMsg = '기존 주문을 취소하였습니다'
        except UserError as e:
            #raise UserError('사용자에러 테스트')
            return json.dumps({'status': False, 'message': e.msg}), 200
        except Exception as e:
            traceback.print_exc()
            conn.rollback()
            return json.dumps({'message': '관리자에게 문의해주세요.'}), 400
        else:
            conn.commit()
            return json.dumps({'status': True, 'message': reMsg}), 200
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
