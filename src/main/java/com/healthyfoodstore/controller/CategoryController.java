package com.healthyfoodstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthyfoodstore.dto.CategoryRequest;
import com.healthyfoodstore.entity.Category;
import com.healthyfoodstore.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	private final CategoryService categoryService;
	
	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}
	
	@PostMapping
	public ResponseEntity<String> addCategory(@Valid @RequestBody CategoryRequest categoryRequest){
		String message = categoryService.addCategory(categoryRequest);
		return new ResponseEntity<>(message, HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<Category>> getAllCategories(){
		return ResponseEntity.ok(categoryService.getAllCategories());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Category> getCategoryById(@PathVariable Long id){
		return ResponseEntity.ok(categoryService.getCategoryById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<String> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest categoryRequest){
		return ResponseEntity.ok(categoryService.updateCategory(id, categoryRequest));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCategory(@PathVariable Long id){
		return ResponseEntity.ok(categoryService.deleteCategory(id));
	}
}
