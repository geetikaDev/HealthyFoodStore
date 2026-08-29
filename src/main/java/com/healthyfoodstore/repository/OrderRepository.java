package com.healthyfoodstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
	
	List<Order> findByEmailOrderByOrderDateDesc(String email);
}
