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

import com.healthyfoodstore.dto.ProductRequest;
import com.healthyfoodstore.entity.Product;
import com.healthyfoodstore.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {
	
	private final ProductService productService;
	
	public ProductController(ProductService productService) {
		this.productService = productService;
	}
	
	@PostMapping
	public ResponseEntity<String> addProduct(@Valid @RequestBody ProductRequest request){
		String message = productService.addProduct(request);
		return new ResponseEntity<>(message, HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<Product>> getAllProducts(){
		return ResponseEntity.ok(productService.getAllProducts());
	}
	
	@GetMapping("/{productId}")
	public ResponseEntity<Product> getProductById(@PathVariable Long productId){
		return ResponseEntity.ok(productService.getProductById(productId));
	}
	
	@PutMapping("/{productId}")
    public ResponseEntity<String> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request) {

        String message = productService.updateProduct(productId, request);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {

        String message = productService.deleteProduct(productId);
        return ResponseEntity.ok(message);
    }
}
