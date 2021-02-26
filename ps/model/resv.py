from common import *
from pymysql import err  # mysqlException


def insertResv(args):
    conn = Connection()
    if conn:
        try:
            tableCd = args['tableCd']
            reserTime = args['reserTime']
            reserPeople = args['reserPeople']
            reMsg = ''  # return Msg

            #예약정보입력
            sql = '''UPDATE posDB.TABLE_TBL SET 
            RESER_TIME=STR_TO_DATE('{reserTime}','%%Y-%%m-%%d %%H:%%i:%%s')
            , RESER_PEOPLE={reserPeople}
			WHERE TABLE_CD={tableCd}'''.format(
                tableCd=tableCd
                , reserTime=reserTime
                , reserPeople=reserPeople)

            data = conn.execute(sql)

            reMsg = '예약을 완료 하였습니다'
            #raise UserError('사용자에러 테스트')
        except UserError as e:
            return json.dumps({'status': False, 'message': e.msg}), 200
        except err.OperationalError as e:
            return json.dumps({'status': False, 'message': "시간 입력 범위를 초과하였습니다"}), 200
        except Exception as e:
            traceback.print_exc()
            conn.rollback()
            return json.dumps({'message': '관리자에게 문의해주세요.'}), 400
        else:
            conn.commit()
            return json.dumps({'status': True, 'message': reMsg}), 200
        finally:
            conn.close()

def cancelResv(args):
    conn = Connection()
    if conn:
        try:
            tableCd = args['tableCd']
            reMsg = ''  # return Msg

            #예약정보취소
            sql = '''UPDATE posDB.TABLE_TBL SET 
            RESER_TIME=NULL
            , RESER_PEOPLE=NULL
			WHERE TABLE_CD={tableCd}'''.format(tableCd=tableCd)

            data = conn.execute(sql)

            reMsg = '예약을 취소 하였습니다'
            #raise UserError('사용자에러 테스트')
        except UserError as e:
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
