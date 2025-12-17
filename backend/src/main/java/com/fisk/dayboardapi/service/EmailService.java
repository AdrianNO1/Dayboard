package com.fisk.dayboardapi.service;

import com.fisk.dayboardapi.models.Email;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.search.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.util.*;

import static com.fisk.dayboardapi.config.EmailConfig.EMAIL_LOOKBACK_DAYS;
import static java.nio.charset.StandardCharsets.UTF_8;

@Slf4j
@Service
public class EmailService {
	private Store store;
	public boolean errorOccurred = false;

	@Value("classpath:gmailFlags.txt")
	private Resource gmailFlagsResource;

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

	public Message[] getRecentUnreadEmails(boolean filter) throws MessagingException {
		Folder inbox = store.getFolder("inbox");
		inbox.open(Folder.READ_ONLY);

		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_MONTH, EMAIL_LOOKBACK_DAYS);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);

		Date twoDaysAgo = cal.getTime();

		SearchTerm newerThan = new ReceivedDateTerm(ComparisonTerm.GE, twoDaysAgo);

		Flags seen = new Flags(Flags.Flag.SEEN);
		SearchTerm unseen = new FlagTerm(seen, false);
		SearchTerm searchFilter = new AndTerm(newerThan, unseen);

		Message[] messages = inbox.search(searchFilter);

		if (filter) {
			return filterMessages(messages);
		}

		return messages;
	}

	public Message[] getRecentUnreadEmails() throws MessagingException {
		return getRecentUnreadEmails(true);
	}

	public static Email messageToEmail(Message msg) {
		Email email = new Email();
		try {
			email.setEventText(msg.getSubject());
			email.setSender(addressesToString(msg.getFrom(), true));
		} catch (MessagingException e) {
			email.setEventText("MessagingException");
		}
		return email;
	}

	private static String getMessageContent(Part part) throws MessagingException, IOException {
		if (part.isMimeType("text/*")) {
			Object content = part.getContent();
			return content == null ? "" : content.toString();
		}

		if (part.isMimeType("multipart/*")) {
			Multipart mp = (Multipart) part.getContent();
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < mp.getCount(); i++) {
				BodyPart bp = mp.getBodyPart(i);

				String disp = bp.getDisposition();
				if (disp != null && disp.equalsIgnoreCase(Part.ATTACHMENT)) continue;

				String s = getMessageContent(bp);
				if (s != null && !s.isEmpty()) {
					if (!sb.isEmpty()) sb.append("\n");
					sb.append(s);
				}
			}
			return sb.toString();
		}

		if (part.isMimeType("message/rfc822")) {
			Object content = part.getContent();
			if (content instanceof Part) return getMessageContent((Part) content);
			return content == null ? "" : content.toString();
		}

		return "";
	}

	private static String addressesToString(Address[] addrs, boolean personal) {
		if (addrs == null || addrs.length == 0) return "";
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < addrs.length; i++) {
			if (i > 0) {
				sb.append(", ");
			}
			sb.append(addressToDisplayName(addrs[i], personal));
		}
		return sb.toString();
	}

	private static String addressToDisplayName(Address addr, boolean personal) {
		if (addr instanceof InternetAddress iaddr) {
			String personalAddrName = iaddr.getPersonal();
			if (personal && personalAddrName != null && !personalAddrName.isBlank()) {
				return personalAddrName;
			}
			return iaddr.getAddress();
		}
		return addr.toString();
	}

	private Message[] filterMessages(Message[] messages) {
		log.info(asString(gmailFlagsResource));
		String[] flags = Arrays.stream(asString(gmailFlagsResource).split("\\R")).map(flag -> flag.trim().toLowerCase(Locale.ROOT).split(" # ", 2)[0]).toArray(String[]::new);
		if (flags.length == 0) {
			log.info("Could not find flags file. Defaulting to showing everything");
			flags = null;
		}
		String[] finalFlags = flags;
		return Arrays.stream(messages).filter(msg -> {
			try {
				String address = addressesToString(msg.getFrom(), false).toLowerCase(Locale.ROOT);
				String content = getMessageContent(msg).toLowerCase(Locale.ROOT);
				String[] toHeaderContent = msg.getHeader("To");
				if (finalFlags == null) {
					return true;
				}
				for (String flag : finalFlags) {
					if (flag.isEmpty()) continue;
					if (flag.contains("@")) {
						if (address.contains(flag)) {
							return true;
						} else if (toHeaderContent != null) {
							for (String line : toHeaderContent) {
								if (line.toLowerCase(Locale.ROOT).contains(flag)) {
									return true;
								}
							}
						}
					} else if (content.contains(flag)) {
						return true;
					}
				}
			} catch (MessagingException | IOException e) {
				log.error("Error reading message content or address");
				return true;
			}
			return false;
		}).toArray(Message[]::new);
	}

	private static String asString(Resource resource) {
		if (!resource.exists()) {
			return "";
		}
		try (Reader reader = new InputStreamReader(resource.getInputStream(), UTF_8)) {
			return FileCopyUtils.copyToString(reader);
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}
}
