package com.healthyfoodstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	
	boolean existsByCategoryName(String categoryName);
	
	Optional<Category> findByCategoryName(String categoryName);
}
