-- 테이블 삭제
DROP TABLE IF EXISTS stored_file;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS chat_room;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS accommodation_amenity;
DROP TABLE IF EXISTS amenity;
DROP TABLE IF EXISTS reserved_date;
DROP TABLE IF EXISTS accommodation;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS payment_method;
DROP TABLE IF EXISTS user;

-- 유저 테이블
CREATE TABLE user
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(100) NOT NULL,
    username    VARCHAR(50)  NOT NULL,
    login_id    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    profile_url VARCHAR(255),
    created_at  DATETIME     NOT NULL
);

-- 주소 테이블
CREATE TABLE address
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    city           VARCHAR(100),
    district       VARCHAR(100),
    street_address VARCHAR(255),
    detail_address VARCHAR(255),
    location       POINT SRID 4326
);

-- 숙소 테이블
CREATE TABLE accommodation
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(500),
    price_per_night INT          NOT NULL,
    max_guests      INT,
    bed_count       INT,
    bedroom_count   INT,
    bathroom_count  INT,
    address_id      BIGINT,
    host_id         BIGINT,
    created_at      DATETIME     NOT NULL,
    FOREIGN KEY (address_id) REFERENCES address (id),
    FOREIGN KEY (host_id) REFERENCES user (id)
);

-- 어메니티 테이블
CREATE TABLE amenity
(
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- 숙소-어메니티 매핑 테이블
CREATE TABLE accommodation_amenity
(
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    accommodation_id BIGINT NOT NULL,
    amenity_id       BIGINT NOT NULL,
    FOREIGN KEY (accommodation_id) REFERENCES accommodation (id),
    FOREIGN KEY (amenity_id) REFERENCES amenity (id)
);

-- 예약 테이블 (누락된 필드 포함)
CREATE TABLE reservation
(
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_id         BIGINT NOT NULL,
    accommodation_id BIGINT NOT NULL,
    check_in         DATE   NOT NULL,
    check_out        DATE   NOT NULL,
    guest_count      INT    NOT NULL,
    status           VARCHAR(20),
    total_price      BIGINT NOT NULL,
    FOREIGN KEY (guest_id) REFERENCES user (id),
    FOREIGN KEY (accommodation_id) REFERENCES accommodation (id)
);

-- 리뷰 테이블
CREATE TABLE review
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT   NOT NULL,
    content        VARCHAR(500),
    created_at     DATETIME NOT NULL,
    rating DOUBLE NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservation (id)
);

-- 이미지 테이블
CREATE TABLE stored_file
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_url    VARCHAR(255) NOT NULL,
    file_order  INT          NOT NULL,
    target_type VARCHAR(50)  NOT NULL,
    target_id   BIGINT       NOT NULL
);

INSERT INTO user (id, email, username, login_id, password, role, phone, profile_url, created_at)
VALUES (1, 'ggim@dreamwiz.com', '안성민', 'user01', 'pw7311', 'GUEST', '063-593-8242', 'https://dummyimage.com/194x513',
        '2025-06-17 04:03:06'),
       (2, 'seojiweon@nate.com', '김시우', 'user02', 'pw1663', 'GUEST', '016-387-7840', 'https://placeimg.com/28/191/any',
        '2025-06-17 04:03:06'),
       (3, 'vryu@yu.com', '최상호', 'user03', 'pw9376', 'HOST', '041-871-1587', 'https://placekitten.com/223/617',
        '2025-06-17 04:03:06'),
       (4, 'eunji83@bagcoe.kr', '김병철', 'user04', 'pw7634', 'GUEST', '042-094-7112', 'https://www.lorempixel.com/306/79',
        '2025-06-17 04:03:06'),
       (5, 'miyeong33@live.com', '박은지', 'user05', 'pw8808', 'GUEST', '019-515-9179', 'https://dummyimage.com/686x389',
        '2025-06-17 04:03:06'),
       (6, 'sanghun35@yu.com', '김정식', 'user06', 'pw4578', 'HOST', '031-989-1013', 'https://www.lorempixel.com/245/801',
        '2025-06-17 04:03:06'),
       (7, 'gimgwangsu@hotmail.com', '박지민', 'user07', 'pw5617', 'HOST', '031-086-9141',
        'https://placekitten.com/452/147', '2025-06-17 04:03:06'),
       (8, 'ggim@dreamwiz.com', '김현준', 'user08', 'pw2553', 'GUEST', '043-457-9230', 'https://placekitten.com/324/331',
        '2025-06-17 04:03:06'),
       (9, 'coejinho@hotmail.com', '장지후', 'user09', 'pw9725', 'HOST', '064-745-6428',
        'https://www.lorempixel.com/25/937', '2025-06-17 04:03:06'),
       (10, 'jeongseongmin@dreamwiz.com', '이성호', 'user10', 'pw6081', 'HOST', '017-924-6610',
        'https://dummyimage.com/393x684', '2025-06-17 04:03:06'),
       (11, 'sunogi@gimmuncoe.org', '김영희', 'user11', 'pw2208', 'GUEST', '051-278-7890',
        'https://placekitten.com/79/1012', '2025-06-17 04:03:06'),
       (12, 'zgim@live.com', '엄재현', 'user12', 'pw8735', 'HOST', '032-206-6503', 'https://www.lorempixel.com/29/4',
        '2025-06-17 04:03:06'),
       (13, 'josiu@igu.com', '유재현', 'user13', 'pw6796', 'GUEST', '02-4714-2851', 'https://www.lorempixel.com/316/570',
        '2025-06-17 04:03:06'),
       (14, 'gimyeongho@hasim.org', '권정식', 'user14', 'pw6180', 'HOST', '017-776-5823',
        'https://www.lorempixel.com/769/596', '2025-06-17 04:03:06'),
       (15, 'yeonghwani@oi.kr', '이민재', 'user15', 'pw8815', 'GUEST', '011-456-8241',
        'https://www.lorempixel.com/979/490', '2025-06-17 04:03:06'),
       (16, 'jiminseo@naver.com', '이승현', 'user16', 'pw9541', 'GUEST', '033-877-5517',
        'https://placeimg.com/237/1019/any', '2025-06-17 04:03:06'),
       (17, 'jeongung22@songjingim.org', '권도윤', 'user17', 'pw2020', 'HOST', '02-1688-4779',
        'https://www.lorempixel.com/444/866', '2025-06-17 04:03:06'),
       (18, 'hyeonjii@hotmail.com', '이도윤', 'user18', 'pw2528', 'GUEST', '019-087-3176',
        'https://www.lorempixel.com/525/424', '2025-06-17 04:03:06'),
       (19, 'sanghyeonbag@jeonggim.kr', '김영순', 'user19', 'pw1018', 'GUEST', '018-687-5773',
        'https://placekitten.com/448/19', '2025-06-17 04:03:06'),
       (20, 'dohyeon24@hotmail.com', '최정희', 'user20', 'pw6458', 'HOST', '063-118-0132',
        'https://www.lorempixel.com/83/615', '2025-06-17 04:03:06');

INSERT INTO address (city, district, street_address, location)
VALUES ('부산광역시', '수영구', '수영로 533', ST_GeomFromText('POINT(35.157 129.113)', 4326)),
       ('전라북도', '전주시', '완산구 전라감영5길 5', ST_GeomFromText('POINT(35.821694 127.145752)', 4326)),
       ('부산광역시', '해운대구', '좌동로 175', ST_GeomFromText('POINT(35.171 129.165)', 4326)),
       ('부산광역시', '동래구', '중앙대로 1285', ST_GeomFromText('POINT(35.204 129.089)', 4326)),
       ('부산광역시', '연제구', '연산대로 50', ST_GeomFromText('POINT(35.188 129.083)', 4326)),
       ('세종특별자치시', '어진동', '세종로 123', ST_GeomFromText('POINT(36.480126 127.289583)', 4326)),
       ('부산광역시', '사상구', '감전로 77', ST_GeomFromText('POINT(35.157 128.99)', 4326)),
       ('부산광역시', '해운대구', '달맞이길 123', ST_GeomFromText('POINT(35.166 129.167)', 4326)),
       ('충청남도', '논산시', '중앙로 45', ST_GeomFromText('POINT(36.1861 127.09812)', 4326)),
       ('부산광역시', '사상구', '괘감로 150', ST_GeomFromText('POINT(35.157 128.983)', 4326)),
       ('부산광역시', '중구', '중앙대로 33', ST_GeomFromText('POINT(35.106 129.036)', 4326)),
       ('부산광역시', '영도구', '태종로 275', ST_GeomFromText('POINT(35.083 129.068)', 4326)),
       ('경상북도', '포항시', '북구 죽도시장로 88', ST_GeomFromText('POINT(36.019 129.365)', 4326)),
       ('부산광역시', '중구', '광복로 58', ST_GeomFromText('POINT(35.10094 129.03589)', 4326)),
       ('부산광역시', '금정구', '서동로 99', ST_GeomFromText('POINT(35.242 129.092)', 4326)),
       ('충청남도', '천안시', '서북구 백석로 10', ST_GeomFromText('POINT(36.815872 127.123123)', 4326)),
       ('부산광역시', '남구', '수영로 90', ST_GeomFromText('POINT(35.136 129.109)', 4326)),
       ('부산광역시', '해운대구', '해운대로 620', ST_GeomFromText('POINT(35.163 129.158)', 4326)),
       ('대구광역시', '수성구', '범어천로 80', ST_GeomFromText('POINT(35.8561 128.6235)', 4326)),
       ('부산광역시', '동구', '범일로 120', ST_GeomFromText('POINT(35.133 129.059)', 4326)),
       ('부산광역시', '북구', '구포1동 222-1', ST_GeomFromText('POINT(35.206 128.991)', 4326)),
       ('대구광역시', '중구', '동성로2가 150', ST_GeomFromText('POINT(35.870024 128.603553)', 4326)),
       ('부산광역시', '강서구', '대저1동 551', ST_GeomFromText('POINT(35.211 128.973)', 4326)),
       ('부산광역시', '남구', '대연동 120', ST_GeomFromText('POINT(35.133 129.11)', 4326)),
       ('부산광역시', '기장군', '기장해안로 321', ST_GeomFromText('POINT(35.244 129.263)', 4326)),
       ('부산광역시', '연제구', '거제천로 256', ST_GeomFromText('POINT(35.184 129.087)', 4326)),
       ('서울특별시', '도봉구', '방학로 120', ST_GeomFromText('POINT(37.668853 127.031754)', 4326)),
       ('부산광역시', '동래구', '온천천로 95', ST_GeomFromText('POINT(35.202 129.075)', 4326)),
       ('서울특별시', '마포구', '월드컵북로 396', ST_GeomFromText('POINT(37.566323 126.901527)', 4326)),
       ('충청북도', '청주시', '흥덕구 가로수로 10', ST_GeomFromText('POINT(36.642 127.478)', 4326)),
       ('경기도', '수원시', '영통구 봉영로 161', ST_GeomFromText('POINT(37.255141 127.057185)', 4326)),
       ('부산광역시', '수영구', '광안해변로 229', ST_GeomFromText('POINT(35.15313 129.11734)', 4326)),
       ('울산광역시', '남구', '삼산로 123', ST_GeomFromText('POINT(35.538377 129.311224)', 4326)),
       ('부산광역시', '사하구', '하신번영로 12', ST_GeomFromText('POINT(35.093 128.976)', 4326)),
       ('서울특별시', '은평구', '불광로 22', ST_GeomFromText('POINT(37.619 126.9273)', 4326)),
       ('전라남도', '목포시', '평화로 33', ST_GeomFromText('POINT(34.811835 126.394942)', 4326)),
       ('부산광역시', '기장군', '장안읍 좌천리 333', ST_GeomFromText('POINT(35.31 129.253)', 4326)),
       ('광주광역시', '북구', '용봉로 100', ST_GeomFromText('POINT(35.1741 126.91246)', 4326)),
       ('부산광역시', '북구', '화명로 44', ST_GeomFromText('POINT(35.213 129.01)', 4326)),
       ('서울특별시', '강남구', '테헤란로 212', ST_GeomFromText('POINT(37.497942 127.027621)', 4326));

INSERT INTO accommodation (id, name, description, price_per_night, max_guests, bed_count, bedroom_count, bathroom_count,
                           address_id, host_id, created_at)
VALUES (1, '숙소 1', 'Fugiat ab vitae temporibus.', 250000, 3, 3, 1, 1, 2, 2, '2025-06-17 04:03:06'),
       (2, '숙소 2', 'At libero vero molestiae illo odio accusantium.', 150000, 4, 3, 2, 2, 3, 3, '2025-06-17 04:03:06'),
       (3, '숙소 3', 'Ipsam quia explicabo sit perferendis deserunt.', 150000, 6, 3, 2, 1, 4, 4, '2025-06-17 04:03:06'),
       (4, '숙소 4', 'Occaecati minus illum odio illo quod ratione.', 150000, 5, 1, 2, 2, 5, 5, '2025-06-17 04:03:06'),
       (5, '숙소 5', 'Ab aliquam nulla voluptatum sit praesentium.', 120000, 2, 1, 2, 1, 6, 6, '2025-06-17 04:03:06'),
       (6, '숙소 6', 'Cumque in tempore ipsa ipsum quae.', 120000, 3, 1, 2, 2, 7, 7, '2025-06-17 04:03:06'),
       (7, '숙소 7', 'Recusandae ipsa dignissimos quae temporibus.', 80000, 1, 1, 1, 1, 8, 8, '2025-06-17 04:03:06'),
       (8, '숙소 8', 'Quia perspiciatis doloremque error.', 250000, 6, 3, 1, 1, 9, 9, '2025-06-17 04:03:06'),
       (9, '숙소 9', 'Illum amet possimus pariatur officiis molestias.', 150000, 6, 1, 1, 2, 10, 10,
        '2025-06-17 04:03:06'),
       (10, '숙소 10', 'Expedita enim ab aperiam.', 150000, 3, 1, 1, 1, 11, 11, '2025-06-17 04:03:06'),
       (11, '숙소 11', 'Non assumenda eum modi.', 150000, 2, 3, 1, 2, 12, 12, '2025-06-17 04:03:06'),
       (12, '숙소 12', 'Dolorum quas error maxime harum.', 120000, 6, 1, 1, 2, 13, 13, '2025-06-17 04:03:06'),
       (13, '숙소 13', 'Totam impedit laudantium.', 250000, 1, 2, 1, 1, 14, 14, '2025-06-17 04:03:06'),
       (14, '숙소 14', 'Nostrum repellendus nam suscipit hic vero.', 150000, 6, 2, 2, 2, 15, 15, '2025-06-17 04:03:06'),
       (15, '숙소 15', 'Autem tempore nostrum ratione quae quod.', 120000, 1, 3, 2, 1, 16, 16, '2025-06-17 04:03:06'),
       (16, '숙소 16', 'Dolorum eligendi quasi optio quia maiores.', 250000, 1, 3, 2, 1, 17, 17, '2025-06-17 04:03:06'),
       (17, '숙소 17', 'Consequatur dignissimos totam libero.', 150000, 3, 3, 2, 1, 18, 18, '2025-06-17 04:03:06'),
       (18, '숙소 18', 'Occaecati tempore autem rerum.', 120000, 1, 3, 1, 1, 19, 19, '2025-06-17 04:03:06'),
       (19, '숙소 19', 'Fugit animi alias quas vitae.', 150000, 5, 2, 1, 2, 20, 20, '2025-06-17 04:03:06'),
       (20, '숙소 20', 'Explicabo molestiae quasi.', 120000, 1, 2, 2, 2, 1, 1, '2025-06-17 04:03:06'),
       (21, '부산 숙소 1', '뷰 좋은 숙소', 100000, 2, 1, 1, 1, 21, 6, NOW()),
       (22, '부산 숙소 2', '해운대 앞 숙소', 110000, 3, 2, 1, 1, 22, 6, NOW()),
       (23, '부산 숙소 3', '감성 숙소', 120000, 4, 2, 2, 2, 23, 6, NOW()),
       (24, '부산 숙소 4', '럭셔리 숙소', 130000, 5, 3, 2, 2, 24, 6, NOW()),
       (25, '부산 숙소 5', '깔끔한 숙소', 140000, 2, 2, 1, 1, 25, 6, NOW()),
       (26, '부산 숙소 6', '가성비 숙소', 150000, 6, 3, 2, 1, 26, 6, NOW()),
       (27, '부산 숙소 7', '주방 완비 숙소', 160000, 3, 2, 2, 2, 27, 6, NOW()),
       (28, '부산 숙소 8', '신축 숙소', 170000, 4, 2, 2, 1, 28, 6, NOW()),
       (29, '부산 숙소 9', '모던 숙소', 180000, 5, 3, 2, 2, 29, 6, NOW()),
       (30, '부산 숙소 10', '지하철 근처 숙소', 190000, 2, 1, 1, 1, 30, 6, NOW()),
       (31, '히스토그램 숙소 1', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 31, 6, NOW()),
       (32, '히스토그램 숙소 2', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 32, 6, NOW()),
       (33, '히스토그램 숙소 3', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 33, 6, NOW()),
       (34, '히스토그램 숙소 4', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 34, 6, NOW()),
       (35, '히스토그램 숙소 5', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 35, 6, NOW()),
       (36, '히스토그램 숙소 6', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 36, 6, NOW()),
       (37, '히스토그램 숙소 7', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 37, 6, NOW()),
       (38, '히스토그램 숙소 8', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 38, 6, NOW()),
       (39, '히스토그램 숙소 9', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 39, 6, NOW()),
       (40, '히스토그램 숙소 10', '테스트용 숙소입니다.', 150000, 4, 2, 1, 1, 40, 6, NOW());


INSERT INTO amenity (name)
VALUES ('AIR_CONDITIONER'),
       ('TV'),
       ('HEATER'),
       ('WIFI');

INSERT INTO accommodation_amenity (accommodation_id, amenity_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (3, 1);

INSERT INTO reservation (id, guest_id, accommodation_id, check_in, check_out, guest_count, status, total_price)
VALUES (1, 3, 1, '2025-06-25', '2025-06-29', 3, 'PENDING', 400000),
       (2, 5, 17, '2025-06-19', '2025-06-22', 3, 'PENDING', 160000),
       (3, 1, 6, '2025-06-20', '2025-06-23', 1, 'PENDING', 200000),
       (4, 11, 21, '2025-06-22', '2025-06-27', 1, 'PENDING', 400000),
       (5, 12, 22, '2025-06-25', '2025-06-29', 2, 'PENDING', 200000),
       (6, 10, 23, '2025-06-24', '2025-06-29', 2, 'PENDING', 200000),
       (7, 11, 24, '2025-06-22', '2025-06-25', 1, 'PENDING', 300000),
       (8, 2, 25, '2025-06-25', '2025-06-28', 2, 'PENDING', 200000),
       (9, 12, 26, '2025-06-25', '2025-06-30', 2, 'PENDING', 300000),
       (10, 8, 27, '2025-06-19', '2025-06-23', 3, 'PENDING', 200000),
       (11, 10, 13, '2025-06-26', '2025-06-27', 3, 'CANCELLED', 300000),
       (12, 4, 18, '2025-06-24', '2025-06-25', 4, 'CANCELLED', 400000),
       (13, 4, 16, '2025-06-23', '2025-06-26', 1, 'CANCELLED', 400000),
       (14, 10, 11, '2025-06-24', '2025-06-25', 2, 'CANCELLED', 200000),
       (15, 3, 3, '2025-06-27', '2025-07-01', 1, 'CONFIRMED', 200000),
       (16, 13, 1, '2025-06-21', '2025-06-22', 1, 'CONFIRMED', 400000),
       (17, 10, 28, '2025-06-26', '2025-07-01', 4, 'CONFIRMED', 200000),
       (18, 12, 29, '2025-06-24', '2025-06-25', 3, 'CONFIRMED', 200000),
       (19, 12, 30, '2025-06-24', '2025-06-26', 1, 'CONFIRMED', 160000),
       (20, 7, 4, '2025-06-26', '2025-06-30', 4, 'CONFIRMED', 400000);

-- 리뷰 샘플
INSERT INTO review (reservation_id, content, created_at, rating)
VALUES (1, '정말 깨끗하고 호스트도 친절했어요.', '2025-06-11 10:23:00', 4.5),
       (1, '위치가 너무 좋았어요.', '2025-06-10 18:01:00', 4.5);

INSERT INTO stored_file (file_url, file_order, target_type, target_id)
VALUES ('image1.jep', 1, 'ACCOMMODATION', 6);
