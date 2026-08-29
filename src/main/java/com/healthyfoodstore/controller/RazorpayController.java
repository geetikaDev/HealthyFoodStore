package com.healthyfoodstore.controller;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@RestController
@RequestMapping("/api")
public class RazorpayController {

    private final RazorpayClient razorpayClient;
    
    @Value("${razorpay.key.secret}")
    private String keySecret;

    public RazorpayController(RazorpayClient razorpayClient) {
        this.razorpayClient = razorpayClient;
    }

    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Double> data) throws Exception {

        JSONObject orderRequest = new JSONObject();
        
        double amountInRupees = data.get("amount");
        long amountInPaise = Math.round(amountInRupees * 100);

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "SWAAD_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequest);

        return order.toString();
    }
    
    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> paymentData){
    	try {
    		String paymentId = paymentData.get("razorpay_payment_id");
    		String orderId = paymentData.get("razorpay_order_id");
    		String signature = paymentData.get("razorpay_signature");
    		System.out.println("Payment ID: " + paymentId);
    		System.out.println("Order ID: " + orderId);
    		System.out.println("Signature: " + signature);
    		
    		if(paymentId == null || orderId == null || signature == null) {
    			return ResponseEntity.badRequest().body("Missing payment verification details");
    		}
    		
    		JSONObject options = new JSONObject();
    		
    		options.put("razorpay_order_id", orderId);
    		options.put("razorpay_payment_id", paymentId);
    		options.put("razorpay_signature", signature);
    		
    		boolean verified = Utils.verifyPaymentSignature(options, keySecret);
    		
    		if(verified) {
    			return ResponseEntity.ok("Payment verified successfully");
    		}
    		return ResponseEntity.badRequest().body("Payment verification failed");
    	} catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.internalServerError().body("Payment verification error");
    	}
    }
}