package com.healthyfoodstore.service;

import com.healthyfoodstore.dto.RegisterRequest;

public interface UserService {
	String registerUser(RegisterRequest request);
}
