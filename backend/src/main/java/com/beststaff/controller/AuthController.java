package com.beststaff.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
    String email = body.get("email");
    String password = body.get("password");
    if ("fail@demo.com".equalsIgnoreCase(email)) {
      return ResponseEntity.status(401).body(Map.of("message","Invalid credentials"));
    }
    return ResponseEntity.ok(Map.of(
        "token","mock-jwt",
        "user", Map.of("id", 99, "name", "Erfan", "department", "Computers")
    ));
  }
}
