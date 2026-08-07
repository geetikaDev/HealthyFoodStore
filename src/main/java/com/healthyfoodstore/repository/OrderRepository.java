package com.healthyfoodstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {

}
