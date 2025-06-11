package com.team3.airdnd.auth.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest
public class UserRepositoryTest {
  @Container
  static MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0.42")
      .withDatabaseName("testdb")
      .withUsername("testuser")
      .withPassword("testpass");

  @DynamicPropertySource
  static void setDatasourceProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
    registry.add("spring.datasource.username", mysqlContainer::getUsername);
    registry.add("spring.datasource.password", mysqlContainer::getPassword);
    registry.add("spring.datasource.driver-class-name", mysqlContainer::getDriverClassName);
  }

  @Autowired
  private UserRepository userRepository;

  @Test
  void 회원가입_테스트() {
    User user = User.builder()
        .loginId("123")
        .password("123")
        .email("test@example.com")
        .username("bazzi")
        .phone("01012341234")
        .role(User.Role.GUEST)
        .build();

    userRepository.save(user);

    User saved = userRepository.findByLoginId("123").orElseThrow();
    assertThat(saved.getUsername()).isEqualTo("bazzi");
  }

}
