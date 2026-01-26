package com.fisk.dayboardapi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class DayboardApiApplication implements CommandLineRunner {
	@Value("${DAYBOARD_APP_PATH:}")
	private String frontendAppPath;

	@Value("${DEV_MODE:false}")
	private boolean devMode;

	@Value("${AUTOKILL_DELAY_MS:60000}")
	private int AUTOKILL_DELAY_MS;

    public static void main(String[] args) {
        SpringApplication.run(DayboardApiApplication.class, args);
    }

	@Override
    public void run(String... args) throws Exception {
		if (devMode) return;
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
