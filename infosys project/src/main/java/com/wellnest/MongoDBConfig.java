package com.wellnest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoDBConfig {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Bean
    public CommandLineRunner initializeDatabase() {
        return args -> {
            try {
                System.out.println("=== MongoDB Database Initialization ===");
                
                // Ensure 'users' collection exists
                if (!mongoTemplate.collectionExists("users")) {
                    mongoTemplate.createCollection("users");
                    System.out.println("✅ Created 'users' collection");
                }

                System.out.println("=== MongoDB Setup Complete ===");
                
            } catch (Exception e) {
                System.err.println("❌ MongoDB initialization failed: " + e.getMessage());
                throw new RuntimeException("Failed to initialize MongoDB", e);
            }
        };
    }
}
