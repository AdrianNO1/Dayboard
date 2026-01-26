package com.fisk.dayboardapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DayboardApiApplicationTests {

    static {
        System.setProperty("DAYBOARD_APP_PATH", "");
    }

    @Test
    void contextLoads() {
    }

}
