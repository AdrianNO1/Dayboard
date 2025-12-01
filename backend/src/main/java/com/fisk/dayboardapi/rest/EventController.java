package com.fisk.dayboardapi.rest;

import com.fisk.dayboardapi.mappers.EventMapper;
import com.fisk.dayboardapi.models.Event;
import com.fisk.dayboardapi.models.EventDto;
import com.fisk.dayboardapi.repo.EventRepository;
import com.fisk.dayboardapi.validation.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventRepository eventRepository;

	@Autowired
	private EventMapper eventMapper;

    @GetMapping
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable int id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    @PostMapping
    public Event createEvent(@RequestBody EventDto eventDto) {
		if (eventRepository.existsByEventTextAndDate(eventDto.getEventText(), eventDto.getDate())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event already exists");
		}
		ValidationService.validateEvent(eventDto);
		Event event = eventMapper.toEvent(eventDto);
        return eventRepository.save(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable int id) {
        eventRepository.deleteById(id);
    }
}
