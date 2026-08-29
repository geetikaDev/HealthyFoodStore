package com.healthyfoodstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {
	
	@NotBlank(message="Category name is required")
	@Size(max=100, message="Category name cannot exceed 100 characters")
	private String categoryName;
	
	@Size(max=255, message="Description cannot exceed 255 characters")
	private String description;

	public CategoryRequest() {
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
	
}
