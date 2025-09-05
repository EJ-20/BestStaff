package com.beststaff.controller;

import com.beststaff.dto.ActivityDto;
import com.beststaff.dto.ProfileDto;
import com.beststaff.model.Employee;
import com.beststaff.model.Recognition;
import com.beststaff.repository.EmployeeRepository;
import com.beststaff.repository.RecognitionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
  private final EmployeeRepository employeeRepo;
  private final RecognitionRepository recognitionRepo;

  public UserController(EmployeeRepository employeeRepo, RecognitionRepository recognitionRepo) {
    this.employeeRepo = employeeRepo;
    this.recognitionRepo = recognitionRepo;
  }

  @GetMapping("/me")
  public ResponseEntity<ProfileDto> getMe() {
    // For demo purposes, return the first employee
    // In a real app, you'd get this from the JWT token
    Employee employee = employeeRepo.findAll().stream().findFirst().orElse(null);
    if (employee == null) {
      return ResponseEntity.notFound().build();
    }
    
    return ResponseEntity.ok(new ProfileDto(
        employee.getId(),
        employee.getName(),
        employee.getDepartment(),
        employee.getPoints()
    ));
  }

  @GetMapping("/me/activity")
  public ResponseEntity<List<ActivityDto>> getMyActivity() {
    // For demo purposes, get activity for the first employee
    // In a real app, you'd get this from the JWT token
    Employee employee = employeeRepo.findAll().stream().findFirst().orElse(null);
    if (employee == null) {
      return ResponseEntity.ok(List.of());
    }

    List<Recognition> recognitions = recognitionRepo.findByReceiverId(employee.getId());
    
    List<ActivityDto> activity = recognitions.stream()
        .map(rec -> new ActivityDto(
            rec.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            "Received recognition from " + rec.getSender().getName(),
            rec.getBadge().getPointValue()
        ))
        .toList();

    return ResponseEntity.ok(activity);
  }
}
