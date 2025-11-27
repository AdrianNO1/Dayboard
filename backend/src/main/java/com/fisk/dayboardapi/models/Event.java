package com.fisk.dayboardapi.models;

import com.fisk.dayboardapi.config.EventConfig;
import com.fisk.dayboardapi.util.DateType;
import com.fisk.dayboardapi.util.EventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.Objects;

@EntityListeners(AuditingEntityListener.class)
@Builder
@Data
@Entity
@Table(name = "events")
@NoArgsConstructor
@AllArgsConstructor
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

	@Column(nullable = false, updatable = false)
	@CreatedDate
	private Instant createdAt;

	@LastModifiedDate
	@Column(nullable = false)
	private Instant updatedAt;

	@Column
	private Integer daysNotice;

	public int getDaysNotice() {
		if (daysNotice == null) {
			Integer eventTypeNoticeDays = EventConfig.EVENT_TYPE_DEFAULT_NOTICE_DAYS.get(eventType);
			return Objects.requireNonNullElse(eventTypeNoticeDays, EventConfig.DEFAULT_NOTICE_DAYS);
		}
		return daysNotice;
	}
}
