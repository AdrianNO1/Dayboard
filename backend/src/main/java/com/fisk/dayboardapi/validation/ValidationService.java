package com.fisk.dayboardapi.validation;

import com.fisk.dayboardapi.models.Event;
import com.fisk.dayboardapi.util.DateType;
import net.fortuna.ical4j.model.property.RRule;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;

public class ValidationService {
	public static void validateEvent(Event event) {
		DateType dateType = event.getDateType();
		String date = event.getDate();
		switch (dateType) {
			case Dateyear:
				if (!isValidIsoDate(date)) {
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date is not valid ISO");
				}
				break;
			case Date:
				if (!isValidDayMonth(date)) {
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date is not valid day month date");
				}
				break;
			case RRule:
				if (!isValidRRule(date)) {
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date is not valid RRule");
				}
				break;
		}
	}

	public static boolean isValidIsoDate(String s) {
		DateTimeFormatter fmt = DateTimeFormatter.ofPattern("uuuu-MM-dd")
			.withResolverStyle(ResolverStyle.STRICT);
		try {
			LocalDate.parse(s, fmt);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public static boolean isValidDayMonth(String s) {
		DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-uuuu")
			.withResolverStyle(ResolverStyle.STRICT);
		try {
			LocalDate.parse(s + "-2000", fmt);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public static boolean isValidRRule(String rule) {
		try {
			new RRule<>(rule);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
