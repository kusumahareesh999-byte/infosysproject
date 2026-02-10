package com.wellnest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MongoDBTestApp {
    public static void main(String[] args) {
        System.out.println("=== MongoDB Connection Test ===");
        System.out.println("1. Make sure MongoDB is running on localhost:27017");
        System.out.println("2. Or set MONGODB_URI environment variable for Atlas");
        System.out.println("3. Starting application...");
        
        SpringApplication.run(MongoDBTestApp.class, args);
    }
}