package com.healthyfoodstore.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.healthyfoodstore.dto.OrderItemRequest;
import com.healthyfoodstore.dto.OrderRequest;
import com.healthyfoodstore.entity.Order;
import com.healthyfoodstore.entity.OrderItem;
import com.healthyfoodstore.entity.Product;
import com.healthyfoodstore.repository.OrderItemRepository;
import com.healthyfoodstore.repository.OrderRepository;
import com.healthyfoodstore.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {
	
	private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }
    
    @Transactional
    public String placeOrder(OrderRequest request) {
    	Order order = new Order();
    	
    	order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setOrderDate(LocalDateTime.now());
        
        BigDecimal total = BigDecimal.ZERO;
        
        order = orderRepository.save(order);
        
        for(OrderItemRequest itemRequest : request.getItems()) {
        	Product product = productRepository.findById(itemRequest.getProductId())
        			.orElseThrow(() -> new RuntimeException("Product not found"));
        	
        	OrderItem orderItem = new OrderItem();
        	
        	orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            total = total.add(
            	    product.getPrice().multiply(
            	        java.math.BigDecimal.valueOf(itemRequest.getQuantity())
            	    )
            	);
            
            orderItemRepository.save(orderItem);
        }
        
        order.setTotalAmount(total);
        orderRepository.save(order);
        
        return "Order placed successfully!";
    }
}
