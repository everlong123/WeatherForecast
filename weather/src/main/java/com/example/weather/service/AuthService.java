package com.example.weather.service;

import com.example.weather.dto.AuthRequest;
import com.example.weather.dto.AuthResponse;
import com.example.weather.dto.RegisterRequest;
import com.example.weather.entity.User;
import com.example.weather.repository.UserRepository;
import com.example.weather.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(token, "Bearer", user.getId(), user.getUsername(), 
                               user.getEmail(), user.getRole().name());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setDistrict(request.getDistrict());
        user.setWard(request.getWard());
        user.setRole(User.Role.USER);
        user.setEnabled(true);

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(token, "Bearer", user.getId(), user.getUsername(), 
                               user.getEmail(), user.getRole().name());
    }
}






















