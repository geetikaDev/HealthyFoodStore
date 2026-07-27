package com.healthyfoodstore.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.healthyfoodstore.repository.UserRepository;


@Service
public class CustomerDetailsService implements UserDetailsService {
	
	private final UserRepository userRepository;
	
	public CustomerDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		com.healthyfoodstore.entity.User user = userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		
		return User.builder()
				.username(user.getEmail())
				.password(user.getPassword())
				.roles(user.getRole().getRoleName())
				.build();
	}

}
