package com.fisk.dayboardapi.service;

import jakarta.mail.*;
import jakarta.mail.search.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;

@Slf4j
@Service
public class EmailService {
	private Store store;
	public boolean errorOccurred = false;

	public EmailService(@Value("${GMAIL_USER}") String GMAIL_USER, @Value("${GMAIL_PASS}") String GMAIL_PASS) {
		Properties props = System.getProperties();
		props.setProperty("mail.store.protocol", "imaps");

		Session session = Session.getDefaultInstance(props, null);
		if (GMAIL_PASS == null || GMAIL_USER == null) {
			errorOccurred = true;
			log.error("Missing environment variable GMAIL_PASS or GMAIL_USER");
			return;
		}
		try {
			store = session.getStore("imaps");
			store.connect("imap.googlemail.com", GMAIL_USER, GMAIL_PASS);
		} catch (MessagingException e) {
			log.error("Error connecting to the imap server", e);
			errorOccurred = true;
		}
	}

	public Message[] getRecentUnreadEmails(boolean closeInbox) throws MessagingException {
		Folder inbox = store.getFolder("inbox");
		inbox.open(Folder.READ_ONLY);

		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_MONTH, -2);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);

		Date twoDaysAgo = cal.getTime();

		SearchTerm newerThan = new ReceivedDateTerm(ComparisonTerm.GE, twoDaysAgo);

		Flags seen = new Flags(Flags.Flag.SEEN);
		SearchTerm unseen = new FlagTerm(seen, false);

		SearchTerm filter = new AndTerm(newerThan, unseen);

		Message[] messages = inbox.search(filter);
//		for (Message message : messages) {
//			log.info("Subject: " + message.getSubject());
//			log.info("From: " + Arrays.toString(message.getFrom()));
//			log.info("Text: " + message.getContent());
//		}
		if (closeInbox) {
			inbox.close();
		}
		return messages;
	}

	public Message[] getRecentUnreadEmails() throws MessagingException {
		return getRecentUnreadEmails(false);
	}
}
