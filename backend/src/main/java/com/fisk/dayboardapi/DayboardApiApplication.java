package com.fisk.dayboardapi;

import io.github.cdimascio.dotenv.Dotenv;
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


	@Value("${DAYBOARD_OPEN_URLS:}")
	private String openUrls;

	@Value("${DEV_MODE:false}")
	private boolean devMode;

	@Value("${AUTOKILL_DELAY_S:60}")
	private int AUTOKILL_DELAY_S;

    public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        SpringApplication.run(DayboardApiApplication.class, args);
    }

	@Override
    public void run(String... args) throws Exception {
		if (devMode) return;
		if (frontendAppPath != null && !frontendAppPath.isEmpty()) {
			new ProcessBuilder("cmd.exe", "/c", frontendAppPath).start();
			if (openUrls != null && !openUrls.isEmpty()) {
				for (String url : openUrls.split(",")) {
					if (!url.trim().isEmpty()) {
						new ProcessBuilder("cmd.exe", "/c", "start " + url.trim()).start();
					}
				}
			}
			if (AUTOKILL_DELAY_S > 0) {
				Thread.sleep(AUTOKILL_DELAY_S * 1000L);
				System.exit(0);
			}
		} else {
			log.warn("Frontend App Path not set");
		}
	}
}
