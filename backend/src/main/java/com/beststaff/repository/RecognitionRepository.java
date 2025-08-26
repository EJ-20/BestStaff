package com.beststaff.repository;

import com.beststaff.model.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {
}
