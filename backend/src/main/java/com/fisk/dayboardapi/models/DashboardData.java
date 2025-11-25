package com.fisk.dayboardapi.models;

import lombok.Data;

import java.util.List;

@Data
public class DashboardData {
	List<Event> events;
}
