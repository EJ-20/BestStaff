package com.beststaff.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recognitions")
public class Recognition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // sender of recognition
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Employee sender;

    // receiver of recognition
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private Employee receiver;

    // badge associated
    @ManyToOne
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    private String note;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ---- getters & setters ----
    public Long getId() { return id; }

    public Employee getSender() { return sender; }
    public void setSender(Employee sender) { this.sender = sender; }

    public Employee getReceiver() { return receiver; }
    public void setReceiver(Employee receiver) { this.receiver = receiver; }

    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
