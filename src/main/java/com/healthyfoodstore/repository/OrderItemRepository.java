package com.healthyfoodstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.Order;
import com.healthyfoodstore.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	
	List<OrderItem> findByOrder(Order order);
}
