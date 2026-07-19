package com.healthyfoodstore.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="products")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="product_id")
	private Long productId;
	
	@Column(name="product_name", nullable=false, unique=true, length=100)
	private String productName;
	
	@Column(name="description", nullable=false, length=100)
	private String description;
	
	@Column(name="price", nullable=false, precision=10, scale=2)
	private BigDecimal price;
	
	@Column(name="stock", nullable=false)
	private Integer stock;
	
	@Column(name="image_url")
	private String imageUrl;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="category_id", nullable=false)
	private Category category;
}
