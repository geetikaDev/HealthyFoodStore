package com.healthyfoodstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthyfoodstore.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	Optional<Category> findByCategoryName(String categoryName);
}
