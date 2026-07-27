package com.healthyfoodstore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@GetMapping("/api/home")
	public String home() {
		return "Welcome to Healthy Food Store";
	}
}
