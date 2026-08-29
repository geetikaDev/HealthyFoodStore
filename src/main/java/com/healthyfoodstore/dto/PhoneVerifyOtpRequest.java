package com.healthyfoodstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class PhoneVerifyOtpRequest {
	
	@NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid Indian mobile number"
    )
    private String phone;

    @NotBlank(message = "OTP is required")
    @Pattern(
        regexp = "^\\d{6}$",
        message = "OTP must be 6 digits"
    )
    private String otp;

    public PhoneVerifyOtpRequest() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
