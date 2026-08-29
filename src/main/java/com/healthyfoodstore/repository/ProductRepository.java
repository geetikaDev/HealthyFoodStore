package com.healthyfoodstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	boolean existsByProductName(String productName);
	
	List<Product> findByCategoryCategoryId(Long categoryId);
	
	List<Product> findByProductNameContainingIgnoreCase(String keyword);
}
