package com.fisk.dayboardapi.rest;

import com.fisk.dayboardapi.models.DashboardData;
import com.fisk.dayboardapi.repo.EventRepository;
import com.fisk.dayboardapi.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	@Autowired
	private DashboardService dashboardService;

	@GetMapping
	public DashboardData getEvents(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		DashboardData dashboardData = new DashboardData();
		dashboardData.setEvents(dashboardService.getVisibleEvents(date));
		return dashboardData;
	}
}
