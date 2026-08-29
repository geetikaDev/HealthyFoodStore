package com.healthyfoodstore.service.impl;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthyfoodstore.dto.ForgotPasswordRequest;
import com.healthyfoodstore.dto.LoginRequest;
import com.healthyfoodstore.dto.LoginResponse;
import com.healthyfoodstore.dto.PhoneOtpRequest;
import com.healthyfoodstore.dto.PhoneVerifyOtpRequest;
import com.healthyfoodstore.dto.RegisterRequest;
import com.healthyfoodstore.dto.ResetPasswordRequest;
import com.healthyfoodstore.dto.VerifyOtpRequest;
import com.healthyfoodstore.entity.LoginOtp;
import com.healthyfoodstore.entity.PasswordResetOtp;
import com.healthyfoodstore.entity.Role;
import com.healthyfoodstore.entity.User;
import com.healthyfoodstore.exception.DuplicateResourceException;
import com.healthyfoodstore.exception.ResourceNotFoundException;
import com.healthyfoodstore.repository.LoginOtpRepository;
import com.healthyfoodstore.repository.PasswordResetOtpRepository;
import com.healthyfoodstore.repository.RoleRepository;
import com.healthyfoodstore.repository.UserRepository;
import com.healthyfoodstore.service.EmailService;
import com.healthyfoodstore.service.JwtService;
import com.healthyfoodstore.service.Msg91Service;
import com.healthyfoodstore.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final EmailService emailService;
    private final LoginOtpRepository loginOtpRepository;
    private final Msg91Service msg91Service;

	public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService, PasswordResetOtpRepository passwordResetOtpRepository, EmailService emailService, LoginOtpRepository loginOtpRepository, Msg91Service msg91Service) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.passwordResetOtpRepository = passwordResetOtpRepository;
		this.emailService = emailService;
		this.loginOtpRepository = loginOtpRepository;
		this.msg91Service = msg91Service;
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
		
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		
		user.setPhone(request.getPhone());
		user.setAddress(request.getAddress());
		user.setRole(customerRole);
		
		userRepository.save(user);
		
		return "User Registered Successfully";
	}

	@Override
	public LoginResponse loginUser(LoginRequest request) {
		
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid email or password."));
		
		if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new ResourceNotFoundException("Invalid email or password.");
		}
		
		String token = jwtService.generateToken(user.getEmail());
		
		LoginResponse response = new LoginResponse();
		
		response.setToken(token);
		response.setMessage("Login Successful");
		response.setUserId(user.getUserId());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setEmail(user.getEmail());
		
		return response;
	}

	@Override
	@Transactional
	public String sendForgotPasswordOtp(ForgotPasswordRequest request) {
		User user = userRepository
	            .findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "No account found with this email."
	                    ));

	    String otp = String.format(
	            "%06d",
	            new Random().nextInt(1000000)
	    );

	    passwordResetOtpRepository
	            .deleteByEmail(user.getEmail());

	    PasswordResetOtp passwordResetOtp =
	            new PasswordResetOtp();

	    passwordResetOtp.setEmail(
	            user.getEmail()
	    );

	    passwordResetOtp.setOtp(otp);

	    passwordResetOtp.setExpiryTime(
	            LocalDateTime.now().plusMinutes(5)
	    );

	    passwordResetOtp.setVerified(false);

	    passwordResetOtpRepository.save(
	            passwordResetOtp
	    );


	    // Send OTP to user's email
	    emailService.sendPasswordResetOtp(
	            user.getEmail(),
	            otp
	    );


	    return "OTP sent successfully.";
	}

	@Override
	public String verifyForgotPasswordOtp(VerifyOtpRequest request) {
		PasswordResetOtp resetOtp =
	            passwordResetOtpRepository
	                    .findTopByEmailOrderByIdDesc(request.getEmail())
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "OTP not found."
	                            ));

	    if (resetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {

	        throw new IllegalArgumentException(
	                "OTP has expired."
	        );
	    }

	    if (!resetOtp.getOtp().equals(request.getOtp())) {

	        throw new IllegalArgumentException(
	                "Invalid OTP."
	        );
	    }

	    resetOtp.setVerified(true);

	    passwordResetOtpRepository.save(resetOtp);

	    return "OTP verified successfully.";
	}

	@Override
	@Transactional
	public String resetPassword(ResetPasswordRequest request) {
		if (!request.getNewPassword()
	            .equals(request.getConfirmPassword())) {

	        throw new IllegalArgumentException(
	                "Passwords do not match."
	        );
	    }

	    User user = userRepository
	            .findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User not found."
	                    ));

	    PasswordResetOtp resetOtp =
	            passwordResetOtpRepository
	                    .findTopByEmailOrderByIdDesc(request.getEmail())
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "OTP verification required."
	                            ));

	    if (!resetOtp.isVerified()) {

	        throw new IllegalArgumentException(
	                "Please verify OTP first."
	        );
	    }

	    if (resetOtp.getExpiryTime()
	            .isBefore(LocalDateTime.now())) {

	        throw new IllegalArgumentException(
	                "OTP verification has expired."
	        );
	    }

	    user.setPassword(
	            passwordEncoder.encode(
	                    request.getNewPassword()
	            )
	    );

	    userRepository.save(user);

	    passwordResetOtpRepository.deleteByEmail(
	            request.getEmail()
	    );

	    return "Password reset successfully.";
	}

	@Override
	@Transactional
	public String sendLoginOtp(PhoneOtpRequest request) {
		userRepository
        .findByPhone(request.getPhone())
        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "No account found with this phone number."
                ));

		return "Phone number verified for OTP login.";
	}

	@Override
	@Transactional
	public LoginResponse verifyLoginOtp(PhoneVerifyOtpRequest request) {
		User user = userRepository
	            .findByPhone(request.getPhone())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User not found."
	                    ));

	    String token =
	            jwtService.generateToken(
	                    user.getEmail()
	            );

	    LoginResponse response =
	            new LoginResponse();

	    response.setToken(token);

	    response.setMessage(
	            "Login Successful"
	    );

	    response.setUserId(
	            user.getUserId()
	    );

	    response.setFirstName(
	            user.getFirstName()
	    );

	    response.setLastName(
	            user.getLastName()
	    );

	    response.setEmail(
	            user.getEmail()
	    );

	    return response;
	}

}
