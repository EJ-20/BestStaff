package com.beststaff.dto;

public record CreateRecognitionRequest(
    Long receiverId,
    String badgeCode,
    Integer points,
    String note
) {}
