import pymysql

class Connection:
    def __init__(self):
        # (인스턴스)멤버변수등록
        self.db = pymysql.connect(host='localhost',
                                  user='root',
                                  password='fP[ssw0rd',
                                  db='posDB',
                                  charset='utf8')
        #DB의 커서 선언
        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)

    def execute(self, query, args={}):
        '''execute는 쿼리 실행까지만,값을 가져올때는 fetch를 사용'''
        return self.cursor.execute(query, args)

    def executeOne(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchone()
        return row

    def executeAll(self, query, args={}):
        '''쿼리를 실행한뒤(execute) 모든 값을 받아옴(fetchAll)'''
        self.cursor.execute(query, args)
        row = self.cursor.fetchall()
        return row

    # 정적메서드_인스턴스화 하지않고 바로 클래스명.메서드로 사용가능
    # @staticmethod
    def commit(self):
        self.db.commit()

    def rollback(self):
        self.db.rollback()

    def close(self):
        self.db.close()

    def insertLastKey(self):
        return self.db.insert_id()

