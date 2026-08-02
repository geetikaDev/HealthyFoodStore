package com.healthyfoodstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductRequest {
	
	@NotBlank(message="Product name is required.")
	private String productName;
	
	@NotBlank(message="Description is required.")
	private String description;
	
	@NotNull(message="Price is required.")
	@Min(value=1, message="Price must be greater than 0.")
	private Double price;
	
	@NotNull(message="Stock qunatity is required")
	@Min(value=0, message="Stock cannot be negative.")
	private Integer stockQuantity;
	
	@NotBlank(message="Image URL is required.")
	private String imageUrl;
	
	@NotNull(message="Category ID is required.")
	private Long categoryId;

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
	
	
	
}
