package com.beststaff.controller;

import com.beststaff.dto.RedeemResponse;
import com.beststaff.dto.RewardDto;
import com.beststaff.model.Employee;
import com.beststaff.model.Reward;
import com.beststaff.repository.EmployeeRepository;
import com.beststaff.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

  private final RewardRepository rewards;
  private final EmployeeRepository employees;

  // TODO replace with authenticated user later
  private Long currentUserId() { return 1L; }

  @GetMapping
  public List<RewardDto> list() {
    return rewards.findAll().stream()
        .map(r -> new RewardDto(r.getId(), r.getName(), r.getCost(), r.getDescription()))
        .toList();
  }

  @PostMapping("/{id}/redeem")
  @Transactional
  public RedeemResponse redeem(@PathVariable Long id) {
    Reward reward = rewards.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reward not found"));

    Employee user = employees.findById(currentUserId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    if (user.getPoints() < reward.getCost()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient points");
    }

    user.setPoints(user.getPoints() - reward.getCost());
    employees.save(user); // persist new balance

    // (Optional) persist a Redemption entity for history later

    return new RedeemResponse(reward.getId(), user.getId(), user.getPoints());
  }
}
