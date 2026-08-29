package com.healthyfoodstore.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
	
	private String productName;
	private Integer qunatity;
	private BigDecimal price;
	private BigDecimal subtotal;
	
	public OrderItemResponse() {
	}

	public OrderItemResponse(String productName, Integer qunatity, BigDecimal price, BigDecimal subtotal) {
		super();
		this.productName = productName;
		this.qunatity = qunatity;
		this.price = price;
		this.subtotal = subtotal;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Integer getQunatity() {
		return qunatity;
	}

	public void setQunatity(Integer qunatity) {
		this.qunatity = qunatity;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}
	
	
	
	
}
