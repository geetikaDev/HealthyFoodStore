package com.healthyfoodstore.service;

import java.util.List;

import com.healthyfoodstore.dto.ProductRequest;
import com.healthyfoodstore.entity.Product;

public interface ProductService {
	
	String addProduct(ProductRequest request);

    List<Product> getAllProducts();

    Product getProductById(Long productId);

    String updateProduct(Long productId, ProductRequest request);

    String deleteProduct(Long productId);
}
