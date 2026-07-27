package com.healthyfoodstore.service;

import com.healthyfoodstore.dto.LoginRequest;
import com.healthyfoodstore.dto.LoginResponse;
import com.healthyfoodstore.dto.RegisterRequest;

public interface UserService {
	String registerUser(RegisterRequest request);
	
	LoginResponse loginUser(LoginRequest request);
}
