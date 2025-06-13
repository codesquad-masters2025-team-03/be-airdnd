-- 테이블 삭제
DROP TABLE IF EXISTS stored_file;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS accommodation_amenity;
DROP TABLE IF EXISTS amenity;
DROP TABLE IF EXISTS accommodation;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS user;

-- 유저 테이블
CREATE TABLE user (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      email VARCHAR(100) NOT NULL,
                      username VARCHAR(50) NOT NULL,
                      login_id VARCHAR(50) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL,
                      role VARCHAR(20) NOT NULL,
                      phone VARCHAR(20) NOT NULL,
                      profile_url VARCHAR(255),
                      created_at DATETIME NOT NULL
);

-- 주소 테이블
CREATE TABLE address (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         city VARCHAR(100),
                         district VARCHAR(100),
                         street_address VARCHAR(255),
                         latitude DOUBLE NOT NULL,
                         longitude DOUBLE NOT NULL
);

-- 숙소 테이블
CREATE TABLE accommodation (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               name VARCHAR(255) NOT NULL,
                               description VARCHAR(500),
                               price_per_night INT NOT NULL,
                               max_guests INT,
                               bed_count INT,
                               address_id BIGINT,
                               host_id BIGINT,
                               created_at DATETIME NOT NULL,
                               FOREIGN KEY (address_id) REFERENCES address(id),
                               FOREIGN KEY (host_id) REFERENCES user(id)
);

-- 어메니티 테이블
CREATE TABLE amenity (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(100)
);

-- 숙소-어메니티 매핑 테이블
CREATE TABLE accommodation_amenity (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       accommodation_id BIGINT NOT NULL,
                                       amenity_id BIGINT NOT NULL,
                                       FOREIGN KEY (accommodation_id) REFERENCES accommodation(id),
                                       FOREIGN KEY (amenity_id) REFERENCES amenity(id)
);

-- 예약 테이블
CREATE TABLE reservation (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             guest_id BIGINT NOT NULL,
                             accommodation_id BIGINT NOT NULL,
                             FOREIGN KEY (guest_id) REFERENCES user(id),
                             FOREIGN KEY (accommodation_id) REFERENCES accommodation(id)
);

-- 리뷰 테이블
CREATE TABLE review (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        reservation_id BIGINT NOT NULL,
                        content VARCHAR(500),
                        created_at DATETIME NOT NULL,
                        rating DOUBLE NOT NULL,
                        FOREIGN KEY (reservation_id) REFERENCES reservation(id)
);

-- 이미지 테이블
CREATE TABLE stored_file (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             file_url VARCHAR(255) NOT NULL,
                             file_type VARCHAR(50) NOT NULL,
                             file_order BIGINT NOT NULL,
                             target_type VARCHAR(50) NOT NULL,
                             target_id BIGINT NOT NULL
);

-- 유저 샘플
INSERT INTO user (email, username, login_id, password, role, phone, profile_url, created_at)
VALUES ('host@example.com', '호스트', 'host01', 'pw1234', 'HOST', '010-0000-0000', 'https://cdn.../host.jpg', NOW()),
       ('guest@example.com', '게스트', 'guest01', 'pw5678', 'GUEST', '010-1111-2222', 'https://cdn.../guest.jpg', NOW());

-- 주소 샘플
INSERT INTO address (city, district, street_address, latitude, longitude)
VALUES ('제주도', '제주시 애월읍', '하귀1리 123-4', 33.450701, 126.570667);

-- 숙소 샘플
INSERT INTO accommodation (name, description, price_per_night, max_guests, bed_count, address_id, host_id, created_at)
VALUES ('제주 오션뷰 하우스', '탁 트인 바다 전망이 매력적인 숙소입니다.', 200000, 4, 2, 1, 1, NOW());

-- 리뷰 없는 숙소
INSERT INTO accommodation (name, description, price_per_night, max_guests, bed_count, address_id, host_id, created_at)
VALUES ('리뷰 없는 숙소', '리뷰가 없는 숙소입니다.', 100000, 2, 1, 1, 1, NOW());

-- 어메니티 샘플
INSERT INTO amenity (name) VALUES ('헤어드라이기'), ('세탁기'), ('와이파이');

-- 숙소-어메니티 매핑
INSERT INTO accommodation_amenity (accommodation_id, amenity_id)
VALUES (1, 1), (1, 2), (1, 3);

-- 예약 샘플
INSERT INTO reservation (guest_id, accommodation_id) VALUES (2, 1);

-- 리뷰 샘플
INSERT INTO review (reservation_id, content, created_at, rating)
VALUES (1, '정말 깨끗하고 호스트도 친절했어요.', '2025-06-11 10:23:00', 4.5),
       (1, '위치가 너무 좋았어요.', '2025-06-10 18:01:00', 4.5);

-- 이미지 샘플
INSERT INTO stored_file (file_url, file_type, file_order, target_type, target_id)
VALUES ('https://cdn.../accom1.jpg', 'image/jpeg', 1, 'ACCOMMODATION', 1),
       ('https://cdn.../accom2.jpg', 'image/jpeg', 2, 'ACCOMMODATION', 1);