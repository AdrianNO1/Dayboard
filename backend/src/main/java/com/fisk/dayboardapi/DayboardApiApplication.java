package com.fisk.dayboardapi;

import com.fisk.dayboardapi.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class DayboardApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(DayboardApiApplication.class, args);
    }
}
