package com.beststaff.repository;

import com.beststaff.model.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {
    List<Recognition> findByReceiverId(Long receiverId);
}
