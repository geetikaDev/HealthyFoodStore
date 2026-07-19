package com.healthyfoodstore.service.impl;

import org.springframework.stereotype.Service;

import com.healthyfoodstore.dto.RegisterRequest;
import com.healthyfoodstore.entity.Role;
import com.healthyfoodstore.entity.User;
import com.healthyfoodstore.exception.DuplicateResourceException;
import com.healthyfoodstore.exception.ResourceNotFoundException;
import com.healthyfoodstore.repository.RoleRepository;
import com.healthyfoodstore.repository.UserRepository;
import com.healthyfoodstore.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
    private final RoleRepository roleRepository;

	public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
		super();
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	@Override
	public String registerUser(RegisterRequest request) {
		
		//check duplicate email
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new DuplicateResourceException("Email already exists.");
		}
		
		//check duplicate phone number
		if(userRepository.existsByPhone(request.getPhone())) {
			throw new DuplicateResourceException("Phone number already exists.");
		}
		
		//get customer role
		Role customerRole = roleRepository.findByRoleName("CUSTOMER").orElseThrow(()-> new ResourceNotFoundException("Customer role not found."));
		
		//create user entity
		User user = new User();
		
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		
		user.setPassword(request.getPassword());
		
		user.setPhone(request.getPhone());
		user.setAddress(request.getAddress());
		user.setRole(customerRole);
		
		userRepository.save(user);
		
		return "User Registered Successfully";
	}

}
