package com.healthyfoodstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
