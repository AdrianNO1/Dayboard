package com.fisk.dayboardapi.models;

import com.fisk.dayboardapi.util.DateType;
import com.fisk.dayboardapi.util.EventType;
import lombok.Data;

@Data
public class EventDto {
	private EventType eventType;
	private DateType dateType;
	private String eventText;
	private String date;
	private Integer daysNotice;
}
