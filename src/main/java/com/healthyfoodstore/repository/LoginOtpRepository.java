package com.healthyfoodstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.LoginOtp;

import jakarta.transaction.Transactional;

public interface LoginOtpRepository extends JpaRepository<LoginOtp, Long> {
	
	Optional<LoginOtp>
    findTopByPhoneOrderByIdDesc(String phone);

    @Transactional
    void deleteByPhone(String phone);
}
