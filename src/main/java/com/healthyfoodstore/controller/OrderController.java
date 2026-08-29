package com.healthyfoodstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthyfoodstore.dto.OrderRequest;
import com.healthyfoodstore.dto.OrderResponse;
import com.healthyfoodstore.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;


    public OrderController(OrderService orderService) {

        this.orderService = orderService;

    }


    @PostMapping
    public ResponseEntity<String> placeOrder(
            @RequestBody OrderRequest request) {

        String message =
                orderService.placeOrder(request);

        return new ResponseEntity<>(
                message,
                HttpStatus.CREATED
        );

    }


    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestParam String email) {

        List<OrderResponse> orders =
                orderService.getOrdersByEmail(email);

        return ResponseEntity.ok(orders);

    }

}