package com.beststaff.controller;

import com.beststaff.model.Employee;
import com.beststaff.repository.EmployeeRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {
  private final EmployeeRepository repo;
  public LeaderboardController(EmployeeRepository repo) { this.repo = repo; }

  @GetMapping
  public List<Employee> top(@RequestParam(defaultValue = "10") int limit) {
    return repo.findAll(PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("points").descending()))
               .getContent();
  }
}
