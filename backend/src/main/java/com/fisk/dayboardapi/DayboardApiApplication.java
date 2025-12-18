package com.fisk.dayboardapi;

import com.fisk.dayboardapi.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class DayboardApiApplication implements CommandLineRunner {
	@Value("${FRONTEND_APP_PATH:}")
	private String frontendAppPath;

	@Value("${AUTOKILL_DELAY_MS:60000}")
	private int AUTOKILL_DELAY_MS;

    public static void main(String[] args) {
        SpringApplication.run(DayboardApiApplication.class, args);
    }

	@Override
    public void run(String... args) throws Exception {
		log.info("FORNTEND APP APTH: " + frontendAppPath);
		if (frontendAppPath != null && !frontendAppPath.isEmpty()) {
			ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", frontendAppPath);
			pb.start();
			Thread.sleep(AUTOKILL_DELAY_MS);
			System.exit(0);
		} else {
			log.warn("Frontend App Path not set");
		}
	}
}
