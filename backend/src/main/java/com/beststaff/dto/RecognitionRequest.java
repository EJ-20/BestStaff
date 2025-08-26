package com.beststaff.dto;

public record RecognitionRequest(
    Long senderId,
    Long receiverId,
    Long badgeId,
    String note,
    Integer points // optional, can be ignored if badge carries points
) {}
