package main.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    private SecretKey SECRET_KEY;

    @PostConstruct
    public void init(){
        this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractPhone(String token){
        return extractAllClaims(token).getSubject();
    }

    private boolean isTokenExpired(String token){
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(UserDetails userDetails){
        Map<String , Object> claims = new HashMap<>();
        return createToken(claims,userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token , UserDetails userDetails){
        final String phone = extractPhone(token);

        return (phone.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
}
