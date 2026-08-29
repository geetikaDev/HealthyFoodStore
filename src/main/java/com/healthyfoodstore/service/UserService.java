package com.healthyfoodstore.service;

import com.healthyfoodstore.dto.ForgotPasswordRequest;
import com.healthyfoodstore.dto.LoginRequest;
import com.healthyfoodstore.dto.LoginResponse;
import com.healthyfoodstore.dto.PhoneOtpRequest;
import com.healthyfoodstore.dto.PhoneVerifyOtpRequest;
import com.healthyfoodstore.dto.RegisterRequest;
import com.healthyfoodstore.dto.ResetPasswordRequest;
import com.healthyfoodstore.dto.VerifyOtpRequest;

public interface UserService {
	String registerUser(RegisterRequest request);
	
	LoginResponse loginUser(LoginRequest request);
	
	String sendForgotPasswordOtp(ForgotPasswordRequest request);

    String verifyForgotPasswordOtp(VerifyOtpRequest request);

    String resetPassword(ResetPasswordRequest request);
    
    String sendLoginOtp(PhoneOtpRequest request);
    LoginResponse verifyLoginOtp(
            PhoneVerifyOtpRequest request
    );

}
