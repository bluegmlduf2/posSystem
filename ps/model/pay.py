from common import *

def insertPay(args):
    conn = Connection()
    if conn:
        try:
            pass
            tableCd = args['tableCd']
            orderCd = args['orderCd']
            payType = args['payType']
            reMsg = ''  # return Msg

            #테이블정보 초기화
            sql = '''UPDATE posDB.TABLE_TBL
            SET ORDER_CD=NULL, RESER_TIME=NULL, RESER_PEOPLE=NULL
            WHERE TABLE_CD={tableCd}'''.format(tableCd=tableCd)
            data = conn.execute(sql)

            #결제테이블 데이터 입력
            sql = '''INSERT INTO posDB.PAY_TBL
            (PAY_TYPE, PAY_STATUS, ORDER_CD)
            VALUES({payType}, 1, {orderCd})'''.format(
                payType=payType, orderCd=orderCd)
            data = conn.execute(sql)
            payCd_new = conn.insertLastKey()#payCd

            #주문테이블에 결제정보 입력
            sql = '''UPDATE posDB.ORDER_TBL
            SET PAY_CD={payCd}
            WHERE ORDER_CD={orderCd}'''.format(
                payCd=payCd_new, orderCd=orderCd)
            data = conn.execute(sql)

            reMsg = '결제를 완료 하였습니다'
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
