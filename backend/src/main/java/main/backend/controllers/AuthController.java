package main.backend.controllers;

import main.backend.dto.response.AuthResponse;
import main.backend.dto.request.LoginRequest;
import main.backend.dto.request.RegisterRequest;
import main.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest){
        try{
            String message = authService.register(registerRequest);
            return ResponseEntity.ok(message);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        try{
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        }
        catch (Exception e){
            System.out.println("Login error: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("registerAdmin")
    public ResponseEntity<String> registerAdmin(@RequestBody RegisterRequest registerRequest){
        try{
            String message = authService.registerAdmin(registerRequest);
            return ResponseEntity.ok(message);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
