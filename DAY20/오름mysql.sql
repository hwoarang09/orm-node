USE modu_chat;

SELECT * FROM member;

#INSERT INTO member(컬럼1,컬럼2,...)VALUES(컬럼1의값의 등록값, 컬럼2의 등록값);
INSERT INTO member(email,member_password,name,profile_img_path,telephone,entry_type_code,use_state_code,birth_date,reg_date,reg_member_id)
VALUES('test1@test.co.kr','1234pass','강창훈','','010-2288-3839',1,1,'900311',now(),2);
INSERT INTO member(email,member_password,name,profile_img_path,telephone,entry_type_code,use_state_code,birth_date,reg_date,reg_member_id)
VALUES('test2@test.co.kr','1234pass2','강창훈3','','010-2288-3839',1,1,'900311',now(),2);
INSERT INTO member(email,member_password,name,profile_img_path,telephone,entry_type_code,use_state_code,birth_date,reg_date,reg_member_id)
VALUES('test3@test.co.kr','1234pass4','강창훈4','','010-2288-3839',1,1,'900311',now(),2);

SELECT * FROM member;
SELECT * FROM member WHERE email='test1@test.co.kr';
SELECT * FROM member WHERE entry_type_code=1 AND name='강창훈';
SELECT * FROM member WHERE member_id >= 3;
SELECT * FROM member WHERE name IN('강창훈', '강창훈2');
SELECT * FROM member WHERE name LIKE '%3%';

UPDATE member SET name='윤성원2', profile_img_path='http://naver.com/images/test.png' WHERE member_id=1;
SELECT * FROM member;

SELECT * FROM member ORDER BY member_id DESC;

DELETE FROM member WHERE member_id >= 5;
SELECT * FROM member;