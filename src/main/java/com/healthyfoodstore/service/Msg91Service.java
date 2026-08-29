package com.healthyfoodstore.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class Msg91Service {

    @Value("${msg91.auth-key}")
    private String authKey;

    @Value("${msg91.template-id}")
    private String templateId;

    @Value("${msg91.otp-url}")
    private String otpUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtp(String phone, String otp) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("authkey", authKey);

        Map<String, Object> body = new HashMap<>();

        body.put("template_id", templateId);
        body.put("mobile", phone);
        body.put("otp", otp);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        otpUrl,
                        HttpMethod.POST,
                        request,
                        String.class
                );

        System.out.println(
                "MSG91 Response: " + response.getBody()
        );
    }
}