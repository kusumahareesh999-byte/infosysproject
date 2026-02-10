package com.wellnest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class MongoDBHealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/mongodb")
    public ResponseEntity<?> checkMongoDBHealth() {
        try {
            // Check if database is accessible
            boolean databaseUp = mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1)) != null;
            
            // Get collection information
            var collections = mongoTemplate.getDb().listCollectionNames().into(new java.util.ArrayList<>());
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", databaseUp ? "UP" : "DOWN");
            response.put("database", "MongoDB");
            response.put("collections", collections);
            response.put("collectionCount", collections.size());
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            if (databaseUp) {
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Unable to connect to MongoDB");
                return ResponseEntity.status(503).body(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "DOWN");
            errorResponse.put("database", "MongoDB");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            return ResponseEntity.status(503).body(errorResponse);
        }
    }
}