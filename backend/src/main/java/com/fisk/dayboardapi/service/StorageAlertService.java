package com.fisk.dayboardapi.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;

@Slf4j
@Service
public class StorageAlertService {

    @Value("${STORAGE_ALERT_PATH:}")
    private String alertPath;

    @Value("${STORAGE_ALERT_THRESHOLD_GB:10}")
    private long thresholdGb;

    public StorageAlertService() {
    }

    public boolean isStorageLow() {
        if (alertPath == null || alertPath.trim().isEmpty()) {
            return false;
        }

        File file = new File(alertPath);
        if (!file.exists()) {
            log.warn("Storage alert path does not exist: {}", alertPath);
            return false;
        }

        long usableSpace = file.getUsableSpace(); // in bytes
        long usableGb = usableSpace / (1024 * 1024 * 1024);

        log.info("Checking storage for {}: {} GB free (threshold: {} GB)", alertPath, usableGb, thresholdGb);

        return usableGb < thresholdGb;
    }

    public String getAlertText() {
        File file = new File(alertPath);
        long usableSpace = file.getUsableSpace();
        long totalSpace = file.getTotalSpace();
        
        long usableGb = usableSpace / (1024 * 1024 * 1024);
        long totalGb = totalSpace / (1024 * 1024 * 1024);
        
        int percentFull = (int) ((1.0 - ((double) usableSpace / totalSpace)) * 100);
        
        return String.format("Low Storage: %s is %d%% full (%d GB free)", alertPath, percentFull, usableGb);
    }
}
