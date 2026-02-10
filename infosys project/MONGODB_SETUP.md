# MongoDB Setup Guide for WellNest Application

## 🚀 MongoDB Setup Complete!

Your application is now configured to use MongoDB with external configuration.

## 📁 Files Created/Modified:

1. **applications.properties** - Updated with external MongoDB configuration
2. **MongoDBConfig.java** - Database initialization and setup
3. **MongoDBHealthController.java** - Health check endpoint
4. **.env.example** - Environment configuration template

## 🔧 Configuration Options:

### Option 1: Local MongoDB (Recommended for Development)
- Install MongoDB locally: https://www.mongodb.com/try/download/community
- Default connection: `mongodb://localhost:27017/wellnest`

### Option 2: MongoDB Atlas (Cloud - Production)
1. Create free account at: https://www.mongodb.com/atlas
2. Create a cluster
3. Get your connection string
4. Update environment variables

## 🛠️ Environment Setup:

1. **Create .env file** (copy from .env.example):
```bash
MONGODB_URI=mongodb://localhost:27017/wellnest
# or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellnest
```

2. **Email Configuration** (update in applications.properties):
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## 🧪 Testing MongoDB Connection:

Once MongoDB is running, you can test the connection:

1. Start your Spring Boot application
2. Visit: `http://localhost:8080/api/health/mongodb`
3. You should see database status and collection information

## 📊 What's Configured:

✅ MongoDB connection with external configuration
✅ Automatic database initialization
✅ Health check endpoint
✅ User collection with proper indexing
✅ TTL index for OTP expiration (10 minutes)
✅ Unique indexes for username and email

## ⚠️ Next Steps:

1. Install and start MongoDB locally OR
2. Set up MongoDB Atlas account
3. Update your environment variables
4. Test the connection with the health endpoint

## 🎯 Your Application is Ready!

The MongoDB setup is complete and ready for your WellNest application. The configuration uses environment variables for security and flexibility.