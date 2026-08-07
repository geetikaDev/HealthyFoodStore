package com.healthyfoodstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
	
	@NotBlank(message="First name is required")
	@Size(max=50, message="First name cannot exceed 50 characters")
	private String firstName;
	
	@NotBlank(message="Last name is required")
	@Size(max=50, message="Last name cannot exceed 50 characters")
	private String lastName;
	
	@NotBlank(message="Email is required")
	@Email(message="Invalid email format")
	private String email;
	
	@NotBlank(message="Password is required")
	@Size(message="Password must be at least 8 characters")
	private String password;
	
	@NotBlank(message="Phone number is required")
	@Pattern(
		    regexp = "^[6-9]\\d{9}$",
		    message = "Invalid Indian mobile number"
		)
	private String phone;
	
	@NotBlank(message="Address is required")
	private String address;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	
}
