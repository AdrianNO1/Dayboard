package com.fisk.dayboardapi.models;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DashboardData {
	LocalDate date;
	List<Event> events;
	List<Email> emails;
}
