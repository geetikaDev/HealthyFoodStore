package com.healthyfoodstore.service;

public interface EmailService {
	void sendPasswordResetOtp(
            String email,
            String otp
    );
}
