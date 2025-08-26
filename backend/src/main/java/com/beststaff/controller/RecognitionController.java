package com.beststaff.controller;

import com.beststaff.dto.RecognitionRequest;
import com.beststaff.model.Badge;
import com.beststaff.model.Employee;
import com.beststaff.model.Recognition;
import com.beststaff.repository.BadgeRepository;
import com.beststaff.repository.EmployeeRepository;
import com.beststaff.repository.RecognitionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recognitions")
public class RecognitionController {

  private final RecognitionRepository recRepo;
  private final EmployeeRepository empRepo;
  private final BadgeRepository badgeRepo;

  public RecognitionController(RecognitionRepository recRepo, EmployeeRepository empRepo, BadgeRepository badgeRepo) {
    this.recRepo = recRepo; this.empRepo = empRepo; this.badgeRepo = badgeRepo;
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody RecognitionRequest req) {
    Employee sender = empRepo.findById(req.senderId()).orElseThrow();
    Employee receiver = empRepo.findById(req.receiverId()).orElseThrow();
    Badge badge = badgeRepo.findById(req.badgeId()).orElseThrow();

    if (sender.getEmployeeId().equals(receiver.getEmployeeId())) {
      return ResponseEntity.badRequest().body("Sender and receiver cannot be the same");
    }

    Recognition r = new Recognition();
    r.setSender(sender);
    r.setReceiver(receiver);
    r.setBadge(badge);
    r.setNote(req.note());
    recRepo.save(r); // DB trigger adds points to receiver

    return ResponseEntity.ok().build();
  }
}
