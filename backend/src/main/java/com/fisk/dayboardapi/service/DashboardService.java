package com.fisk.dayboardapi.service;

import com.fisk.dayboardapi.models.Event;
import com.fisk.dayboardapi.repo.EventRepository;
import com.fisk.dayboardapi.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
	private final EventRepository eventRepository;

	public List<Event> getAllEvents() {
		return eventRepository.findAll();
	}

	private boolean isEventVisible(Event event, LocalDate date) {
		LocalDate nextOccurrence = Utils.getNextOccurrence(event, date);
		if (nextOccurrence == null) {
			return false;
		}
		return date.plusDays(event.getDaysNotice()).isAfter(nextOccurrence);
	}

	public List<Event> getVisibleEvents(LocalDate date) {
		List<Event> allEvents = getAllEvents();
		return allEvents.stream().filter(event -> isEventVisible(event, date)).toList();
	}
}
