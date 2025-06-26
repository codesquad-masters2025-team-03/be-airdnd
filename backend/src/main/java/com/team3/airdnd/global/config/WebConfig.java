package com.team3.airdnd.global.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.team3.airdnd.auth.AuthInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Autowired
	private AuthInterceptor authInterceptor;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
			.allowedOrigins(
				"http://localhost:3000",    // 개발 환경 (React)
				"http://3.38.136.175"
			)
			.allowedMethods("*")
			.allowedHeaders("*")
			.allowCredentials(true);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(authInterceptor)
			.addPathPatterns("/api/**")
			.excludePathPatterns("/api/auth/**");
	}

	@Bean
	public RestTemplate restTemplate() {
		SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(3000);
		factory.setReadTimeout(5000);
		return new RestTemplate(factory);
	}
}
