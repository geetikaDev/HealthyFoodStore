package com.healthyfoodstore.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;

import jakarta.annotation.PostConstruct;


@Configuration
public class RazorpayConfig {
	
	@Value("${razorpay.key.id}")
	private String keyId;
	
	@Value("${razorpay.key.secret}")
	private String keySecret;
	
	@PostConstruct
    public void checkKeys() {
        System.out.println("Razorpay Key ID: " + keyId);
        System.out.println("Razorpay Secret Loaded: " +
                (keySecret != null && !keySecret.isEmpty()));
    }
	
	@Bean
	public RazorpayClient razorpayClient() throws Exception{
		return new RazorpayClient(keyId, keySecret);
	}
}
