package com.healthyfoodstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.healthyfoodstore.service.CustomerDetailsService;

@Configuration
public class ApplicationConfig {
	
	private final CustomerDetailsService customerDetailsService;
	
	public ApplicationConfig(CustomerDetailsService customerDetailsService) {
		this.customerDetailsService = customerDetailsService;
	}
	
	@Bean
	public UserDetailsService userDetailsService() {
		return customerDetailsService;
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(customerDetailsService);
		provider.setPasswordEncoder(passwordEncoder());
		
		return provider;
	}
}
