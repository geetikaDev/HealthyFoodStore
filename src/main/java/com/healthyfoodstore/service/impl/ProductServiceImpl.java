package com.healthyfoodstore.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.healthyfoodstore.dto.ProductRequest;
import com.healthyfoodstore.entity.Category;
import com.healthyfoodstore.entity.Product;
import com.healthyfoodstore.exception.DuplicateResourceException;
import com.healthyfoodstore.exception.ResourceNotFoundException;
import com.healthyfoodstore.repository.CategoryRepository;
import com.healthyfoodstore.repository.ProductRepository;
import com.healthyfoodstore.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
	
	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	
	public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
		super();
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
	}

	@Override
	public String addProduct(ProductRequest request) {
		
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> 
				new ResourceNotFoundException("Category not found."));
		
		if(productRepository.existsByProductName(request.getProductName())) {
			throw new DuplicateResourceException("Product already exists.");
		}
		
		Product product = new Product();
		
		product.setProductName(request.getProductName());
		product.setDescription(request.getDescription());
	    product.setPrice(BigDecimal.valueOf(request.getPrice()));
	    product.setStock(request.getStockQuantity());
	    product.setImageUrl(request.getImageUrl());
	    product.setCategory(category);
	    
	    productRepository.save(product);
		
		return "Product added successfully";
	}

	@Override
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	@Override
	public Product getProductById(Long productId) {
		return productRepository.findById(productId)
				.orElseThrow(() -> 
				new ResourceNotFoundException("Product not found."));
	}

	@Override
	public String updateProduct(Long productId, ProductRequest request) {
		
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> 
				new ResourceNotFoundException("Product not found."));
		
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> 
				new ResourceNotFoundException("Category not found."));
		
		product.setProductName(request.getProductName());
		product.setDescription(request.getDescription());
		product.setPrice(BigDecimal.valueOf(request.getPrice()));
	    product.setStock(request.getStockQuantity());
	    product.setImageUrl(request.getImageUrl());
	    product.setCategory(category);
	    
	    productRepository.save(product);
	    
	    return "Product saved successfully";
	}

	@Override
	public String deleteProduct(Long productId) {
		
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> 
				new ResourceNotFoundException("Product not found."));
		
		productRepository.delete(product);
		
		return "Product deleted successfully";
	}

}
