package com.fisk.dayboardapi.repo;

import com.fisk.dayboardapi.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Integer> {
	boolean existsByEventTextAndDate(String eventText, String date);
}
