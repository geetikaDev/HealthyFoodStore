package com.healthyfoodstore.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthyfoodstore.dto.OrderItemRequest;
import com.healthyfoodstore.dto.OrderItemResponse;
import com.healthyfoodstore.dto.OrderRequest;
import com.healthyfoodstore.dto.OrderResponse;
import com.healthyfoodstore.entity.Order;
import com.healthyfoodstore.entity.OrderItem;
import com.healthyfoodstore.entity.Product;
import com.healthyfoodstore.repository.OrderItemRepository;
import com.healthyfoodstore.repository.OrderRepository;
import com.healthyfoodstore.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final ProductRepository productRepository;


    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;

        this.orderItemRepository = orderItemRepository;

        this.productRepository = productRepository;

    }


    // =====================================================
    // PLACE ORDER
    // =====================================================

    @Transactional
    public String placeOrder(OrderRequest request) {

        Order order = new Order();

        order.setCustomerName(
                request.getCustomerName()
        );

        order.setEmail(
                request.getEmail()
        );

        order.setPhone(
                request.getPhone()
        );

        order.setAddress(
                request.getAddress()
        );

        order.setTotalAmount(
                request.getTotalAmount()
        );

        order.setOrderDate(
                LocalDateTime.now()
        );


        // Save order first
        Order savedOrder =
                orderRepository.save(order);


        // =================================================
        // SAVE ORDER ITEMS
        // =================================================

        if (request.getItems() != null) {

            for (OrderItemRequest itemRequest
                    : request.getItems()) {


                Product product =
                        productRepository
                                .findById(
                                        itemRequest.getProductId()
                                )
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "Product not found: "
                                                + itemRequest.getProductId()
                                        )
                                );


                OrderItem orderItem =
                        new OrderItem();


                orderItem.setOrder(savedOrder);

                orderItem.setProduct(product);

                orderItem.setQuantity(
                        itemRequest.getQuantity()
                );


                // Save the price at the time of purchase
                orderItem.setPrice(
                        product.getPrice()
                );


                orderItemRepository.save(
                        orderItem
                );

            }

        }


        return "Order saved successfully";

    }


    // =====================================================
    // GET MY ORDERS
    // =====================================================

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByEmail(
            String email) {


        List<Order> orders =
                orderRepository
                        .findByEmailOrderByOrderDateDesc(
                                email
                        );


        List<OrderResponse> response =
                new ArrayList<>();


        for (Order order : orders) {

            OrderResponse orderResponse =
                    new OrderResponse();


            orderResponse.setOrderId(
                    order.getOrderId()
            );

            orderResponse.setCustomerName(
                    order.getCustomerName()
            );

            orderResponse.setEmail(
                    order.getEmail()
            );

            orderResponse.setPhone(
                    order.getPhone()
            );

            orderResponse.setAddress(
                    order.getAddress()
            );

            orderResponse.setTotalAmount(
                    order.getTotalAmount()
            );

            orderResponse.setOrderDate(
                    order.getOrderDate()
            );


            // =============================================
            // GET ITEMS
            // =============================================

            List<OrderItem> orderItems =
                    orderItemRepository
                            .findByOrder(order);


            List<OrderItemResponse> itemResponses =
                    new ArrayList<>();


            for (OrderItem orderItem
                    : orderItems) {


                Product product =
                        orderItem.getProduct();


                BigDecimal price =
                        orderItem.getPrice();


                BigDecimal subtotal =
                        price.multiply(
                                BigDecimal.valueOf(
                                        orderItem.getQuantity()
                                )
                        );


                OrderItemResponse itemResponse =
                        new OrderItemResponse();


                itemResponse.setProductName(
                        product.getProductName()
                );

                itemResponse.setQunatity(
                        orderItem.getQuantity()
                );

                itemResponse.setPrice(
                        price
                );

                itemResponse.setSubtotal(
                        subtotal
                );


                itemResponses.add(
                        itemResponse
                );

            }


            orderResponse.setItems(
                    itemResponses
            );


            response.add(
                    orderResponse
            );

        }


        return response;

    }

}