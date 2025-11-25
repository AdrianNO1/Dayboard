package com.fisk.dayboardapi.config;

import com.fisk.dayboardapi.util.EventType;

import java.util.Map;

public class EventConfig {
	public static final int DEFAULT_NOTICE_DAYS = 30;
	public static final Map<EventType, Integer> EVENT_TYPE_DEFAULT_NOTICE_DAYS = Map.of(EventType.World, 14);
}
