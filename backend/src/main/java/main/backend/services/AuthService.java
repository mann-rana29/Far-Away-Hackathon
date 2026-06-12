package main.backend.services;

import main.backend.dto.response.AuthResponse;
import main.backend.dto.request.LoginRequest;
import main.backend.dto.request.RegisterRequest;
import main.backend.enums.Role;
import main.backend.models.User;
import main.backend.repositories.UserRepository;
import main.backend.security.CustomUserDetails;
import main.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager manager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder encoder, AuthenticationManager manager, JwtUtil jwtUtil){
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.manager = manager;
        this.userRepository = userRepository;
    }

    public String register(RegisterRequest registerRequest) throws RuntimeException{

        if(userRepository.existsByPhone(registerRequest.getPhone())){
            throw new RuntimeException("User is already registered with this phone number");
        }

        User user = User.builder().name(registerRequest.getName())
                .phone(registerRequest.getPhone())
                .password(encoder.encode(registerRequest.getPassword()))
                .role(Role.CITIZEN)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest loginRequest ){

        var authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getPhone(), loginRequest.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, userDetails.getUsername(), userDetails.getUser().getRole().name());
    }

    public String registerAdmin(RegisterRequest registerRequest){
        if(userRepository.existsByPhone(registerRequest.getPhone())){
            throw new RuntimeException("User is already registered with this phone number");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .phone(registerRequest.getPhone())
                .password(encoder.encode(registerRequest.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);

        return "Admin registered successfully";
    }

    public String registerWorker(RegisterRequest registerRequest){
        if(userRepository.existsByPhone(registerRequest.getPhone())){
            throw new RuntimeException("User is already registered with this phone number");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .phone(registerRequest.getPhone())
                .password(encoder.encode(registerRequest.getPassword()))
                .role(Role.WORKER)
                .build();

        user.setWorkerId(user.getId());
        userRepository.save(user);

        return "Worker registered successfully";
    }
}
