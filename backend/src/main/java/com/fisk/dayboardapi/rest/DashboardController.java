package com.fisk.dayboardapi.rest;

import com.fisk.dayboardapi.models.DashboardData;
import com.fisk.dayboardapi.models.Email;
import com.fisk.dayboardapi.models.Event;
import com.fisk.dayboardapi.service.DashboardService;
import com.fisk.dayboardapi.service.EmailService;
import com.fisk.dayboardapi.util.EventType;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	@Autowired
	private DashboardService dashboardService;

	@Autowired
	private EmailService emailService;

	@GetMapping
	public DashboardData getEvents(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, @RequestParam boolean fetchEmails) {
		DashboardData dashboardData = new DashboardData();
		dashboardData.setDate(date);
		dashboardData.setEmails(new ArrayList<>());

		List<Event> events = dashboardService.getVisibleEvents(date);
		dashboardData.setEvents(events);

		if (fetchEmails && date.equals(LocalDate.now())) {
			try {
				Message[] unreadEmails = emailService.getRecentUnreadEmails();
				List<Email> emails = Arrays.stream(unreadEmails).map(EmailService::messageToEmail).toList();
				dashboardData.getEmails().addAll(emails);
			} catch (MessagingException e) {
				Email errorEmail =  new Email();
				errorEmail.setEventText("MessagingException on get");
				dashboardData.getEmails().add(errorEmail);
			}
		}


		return dashboardData;
	}
}
