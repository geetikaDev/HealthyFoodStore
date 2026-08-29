package com.healthyfoodstore.service;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	private static final String SECRET_KEY = "VGhpc0lzQVN1cGVyU2VjcmV0S2V5Rm9ySldUMTIzNDU2Nzg5MDEyMzQ1";
	
	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public String generateToken(String email) {
		return Jwts.builder()
				.subject(email)
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
				.signWith(getSignKey(), SignatureAlgorithm.HS256)
				.compact();
	}
	
	public String extractEmail(String token) {
		Claims claims = Jwts.parser()
				.verifyWith((javax.crypto.SecretKey) getSignKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
		return claims.getSubject();
	}
	
	public boolean isTokenValid(String token, String email) {
		return email.equals(extractEmail(token));
	}
}
