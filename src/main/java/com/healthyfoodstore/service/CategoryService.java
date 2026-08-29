package com.healthyfoodstore.service;

import java.util.List;

import com.healthyfoodstore.dto.CategoryRequest;
import com.healthyfoodstore.entity.Category;

public interface CategoryService {

	String addCategory(CategoryRequest request);
	
	List<Category> getAllCategories();
	
	Category getCategoryById(Long categoryId);
	
	String updateCategory(Long categoryId, CategoryRequest request);
	
	String deleteCategory(Long categoryId);
}
