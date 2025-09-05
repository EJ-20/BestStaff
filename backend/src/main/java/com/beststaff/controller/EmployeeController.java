package com.beststaff.controller;

import com.beststaff.model.Employee;
import com.beststaff.repository.EmployeeRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173") // allow your Vite dev server
public class EmployeeController {

    private final EmployeeRepository repo;

    public EmployeeController(EmployeeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Employee> all() {
        return repo.findAll(); // Spring auto-serializes to JSON
    }

    // optional: create endpoint matching your UI
    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody CreateEmployeeRequest body) {
        Employee e = new Employee();
        e.setName(body.fullName());
        e.setEmail(body.email());
        e.setPoints(0);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(e));
    }

    public record CreateEmployeeRequest(String fullName, String email) {}
}
