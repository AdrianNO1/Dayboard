package com.fisk.dayboardapi.util;

import com.fisk.dayboardapi.models.Event;
import net.fortuna.ical4j.model.Recur;
import net.fortuna.ical4j.model.property.RRule;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;
import java.time.temporal.Temporal;

public class Utils {
	public static LocalDate getNextOccurrence(Event event, LocalDate today) {
		String date = event.getDate();
		DateTimeFormatter fmt;
		LocalDate next;
		switch(event.getDateType()) {
			case Dateyear:
				fmt = createFMT("uuuu-MM-dd");
				next = LocalDate.parse(date, fmt);
				if (next.isBefore(today)) {
					return null;
				}
				return next;
			case Date:
				fmt = createFMT("dd-MM-uuuu");
				next = LocalDate.parse(date + "-" + today.getYear(), fmt);
				if (next.isBefore(today)) {
					next = next.withYear(today.getYear()+1);
				}
				return next;
			case RRule:
				RRule<LocalDate> rrule = new RRule<>(date);
				Recur<LocalDate> recur = rrule.getRecur();
				next = recur.getNextDate(today, today);
				return next;
			default:
				return null;
		}
	}

	public static DateTimeFormatter createFMT(String pattern) {
		return DateTimeFormatter.ofPattern(pattern)
			.withResolverStyle(ResolverStyle.STRICT);
	}
}
