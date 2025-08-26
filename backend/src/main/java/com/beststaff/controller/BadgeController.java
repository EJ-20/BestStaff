package com.beststaff.controller;

import com.beststaff.model.Badge;
import com.beststaff.repository.BadgeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/badges")
public class BadgeController {
  private final BadgeRepository repo;
  public BadgeController(BadgeRepository repo) { this.repo = repo; }

  @GetMapping
  public List<Badge> all() { return repo.findAll(); }
}
