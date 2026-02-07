package com.fisk.dayboardapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins("http://localhost:1291", "http://127.0.0.1:1291")
			.allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true);
	}
}
