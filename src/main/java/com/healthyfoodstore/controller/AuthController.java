package com.healthyfoodstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthyfoodstore.dto.ForgotPasswordRequest;
import com.healthyfoodstore.dto.LoginRequest;
import com.healthyfoodstore.dto.LoginResponse;
import com.healthyfoodstore.dto.PhoneOtpRequest;
import com.healthyfoodstore.dto.PhoneVerifyOtpRequest;
import com.healthyfoodstore.dto.RegisterRequest;
import com.healthyfoodstore.dto.ResetPasswordRequest;
import com.healthyfoodstore.dto.VerifyOtpRequest;
import com.healthyfoodstore.service.UserService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private final UserService userService;
	
	public AuthController(UserService userService) {
		this.userService = userService;
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest request){
		String message = userService.registerUser(request);
		return new ResponseEntity<>(message, HttpStatus.CREATED);
	}
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request){
		LoginResponse response = userService.loginUser(request);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
		String response = userService.sendForgotPasswordOtp(request);
	    return ResponseEntity.ok(response);
	}
	
	@PostMapping("/verify-otp")
	public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {

	    String response = userService.verifyForgotPasswordOtp(request);
	    return ResponseEntity.ok(response);
	}
	
	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {

	    String response = userService.resetPassword(request);
	    return ResponseEntity.ok(response);
	}
	
	@PostMapping("/login/send-otp")
	public ResponseEntity<String> sendLoginOtp(@Valid @RequestBody PhoneOtpRequest request) {

	    String message = userService.sendLoginOtp(request);
	    return ResponseEntity.ok(message);
	}
	
	@PostMapping("/login/verify-otp")
	public ResponseEntity<LoginResponse> verifyLoginOtp(@Valid @RequestBody PhoneVerifyOtpRequest request) {

	    LoginResponse response = userService.verifyLoginOtp(request);

	    return ResponseEntity.ok(response);
	}

}
