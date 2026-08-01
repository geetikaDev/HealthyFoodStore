package com.healthyfoodstore.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthyfoodstore.dto.CategoryRequest;
import com.healthyfoodstore.entity.Category;
import com.healthyfoodstore.exception.DuplicateResourceException;
import com.healthyfoodstore.exception.ResourceNotFoundException;
import com.healthyfoodstore.repository.CategoryRepository;
import com.healthyfoodstore.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
	
	private final CategoryRepository categoryRepository;
	
	public CategoryServiceImpl(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@Override
	public String addCategory(CategoryRequest request) {
		if(categoryRepository.existsByCategoryName(request.getCategoryName())) {
			throw new DuplicateResourceException("Category Already Exists");
		}
		
		Category category = new Category();
		
		category.setCategoryName(request.getCategoryName());
		category.setDescription(request.getDescription());
		
		categoryRepository.save(category);
		
		return "Category Added Successfully";
	}

	@Override
	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	@Override
	public Category getCategoryById(Long categoryId) {
		
		return categoryRepository.findById(categoryId)
				.orElseThrow(() ->
				new ResourceNotFoundException("Category not found."));
	}

	@Override
	public String updateCategory(Long categoryId, CategoryRequest request) {
		
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> 
				new ResourceNotFoundException("Category not found."));
		
		if(!category.getCategoryName().equalsIgnoreCase(request.getCategoryName()) && categoryRepository.existsByCategoryName(request.getCategoryName())) {
			throw new DuplicateResourceException("Category already exists.");
		}
		
		category.setCategoryName(request.getCategoryName());
		category.setDescription(request.getDescription());
		
		categoryRepository.save(category);
		
		return "Category updated successfully";
	}

	@Override
	public String deleteCategory(Long categoryId) {
		
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> 
				new ResourceNotFoundException("Category not found."));
		categoryRepository.delete(category);
		
		return "Category deleted successfully";
	}
}
