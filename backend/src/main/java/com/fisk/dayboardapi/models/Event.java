package com.fisk.dayboardapi.models;

import com.fisk.dayboardapi.util.DateType;
import com.fisk.dayboardapi.util.EventType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DateType dateType;

    @Column(nullable = false)
    private String eventText;

    @Column(nullable = false)
    private String date;
}
