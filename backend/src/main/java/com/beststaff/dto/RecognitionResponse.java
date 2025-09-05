package com.beststaff.dto;

import java.time.Instant;

public record RecognitionResponse(
    Long id,
    Long senderId,
    Long receiverId,
    String badgeCode,
    Integer points,
    String note,
    Instant createdAt
) {}
