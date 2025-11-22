# API Implementation Guide

## Overview
This document outlines the step-by-step implementation of all user-related API routes from the Laravel API Postman collection.

## API Structure

### Base Configuration
- **Base URL**: `http://10.62.36.10:8000/api/v1`
- **Authentication**: Bearer Token (stored in AsyncStorage)
- **Content-Type**: `application/json` (except for file uploads)

### File Structure
```
/api
  /services
    - authService.js          # Authentication endpoints
    - programService.js       # Programs endpoints
    - planService.js          # Plans endpoints
    - exerciseService.js      # Exercises endpoints
    - faqService.js          # FAQs endpoints
    - videoLibraryService.js  # Video Libraries endpoints
    - bannerService.js        # Banners endpoints
    - achievementService.js   # Achievements endpoints
    - reviewService.js        # Reviews endpoints
    - communityService.js     # Communities endpoints
    - productService.js       # Products endpoints
    - packageService.js       # Packages endpoints
    - userProgramService.js   # User Programs endpoints
    - workoutLogService.js    # Workout Logs endpoints
    - nutritionLogService.js  # Nutrition Logs endpoints
    - progressLogService.js   # Progress Logs endpoints
    - checkInService.js       # Check-ins endpoints
    - messageService.js       # Messages endpoints
    - notificationService.js  # Notifications endpoints
    - orderService.js         # Orders endpoints
    - myPlanService.js        # My Plans (Premium) endpoints
  /hooks
    - useAuth.js              # Auth hooks
    - usePrograms.js          # Program hooks
    - usePlans.js             # Plan hooks
    - useExercises.js         # Exercise hooks
    - useFAQs.js              # FAQ hooks
    - useVideoLibraries.js    # Video Library hooks
    - useBanners.js           # Banner hooks
    - useAchievements.js      # Achievement hooks
    - useReviews.js           # Review hooks
    - useCommunities.js       # Community hooks
    - useProducts.js         # Product hooks
    - usePackages.js          # Package hooks
    - useUserPrograms.js      # User Program hooks
    - useWorkoutLogs.js       # Workout Log hooks
    - useNutritionLogs.js     # Nutrition Log hooks
    - useProgressLogs.js      # Progress Log hooks
    - useCheckIns.js          # Check-in hooks
    - useMessages.js          # Message hooks
    - useNotifications.js     # Notification hooks
    - useOrders.js            # Order hooks
    - useMyPlans.js           # My Plan (Premium) hooks
```

## Implementation Steps

### Step 1: Update API Configuration
- Update `apiConfig.js` with all endpoint definitions
- Organize endpoints by resource type
- Include query parameter helpers

### Step 2: Create Service Files
Each service file exports functions that:
- Build the full URL with query parameters
- Handle authentication
- Return data in consistent format
- Handle errors appropriately

### Step 3: Create React Query Hooks
Each hook file exports:
- **Queries**: For GET requests (useQuery)
- **Mutations**: For POST/PUT/DELETE requests (useMutation)
- Proper query key management
- Cache invalidation strategies

### Step 4: Update Existing Code
- Replace hardcoded API calls with new hooks
- Update AuthContext to use new auth service
- Update screens to use new hooks

## API Endpoints by Category

### Public Endpoints (No Auth Required)
1. **Health & Config**
   - GET `/api/v1/health`
   - GET `/api/v1/config`

2. **Authentication**
   - POST `/api/v1/auth/register`
   - POST `/api/v1/auth/login`

3. **Programs**
   - GET `/api/v1/programs`
   - GET `/api/v1/programs/:id`

4. **Plans**
   - GET `/api/v1/plans`
   - GET `/api/v1/plans/:id`

5. **Exercises**
   - GET `/api/v1/exercises`
   - GET `/api/v1/exercises/:id`

6. **FAQs**
   - GET `/api/v1/faqs`
   - GET `/api/v1/faqs/:id`

7. **Video Libraries**
   - GET `/api/v1/video-libraries`
   - GET `/api/v1/video-libraries/:id`

8. **Banners**
   - GET `/api/v1/banners`
   - GET `/api/v1/banners/:id`

9. **Achievements**
   - GET `/api/v1/achievements`
   - GET `/api/v1/achievements/:id`

10. **Reviews**
    - GET `/api/v1/reviews`
    - GET `/api/v1/reviews/:id`

11. **Communities**
    - GET `/api/v1/communities`
    - GET `/api/v1/communities/:id`

12. **Products**
    - GET `/api/v1/products`
    - GET `/api/v1/products/:id`

13. **Packages**
    - GET `/api/v1/packages`
    - GET `/api/v1/packages/:id`

14. **WhatsApp Support**
    - GET `/api/v1/messages/whatsapp-support`

### Authenticated Endpoints (Auth Required)
1. **User Management**
   - GET `/api/v1/auth/me`
   - PUT `/api/v1/auth/me`
   - PUT `/api/v1/auth/password`
   - POST `/api/v1/auth/logout`

2. **User Programs**
   - GET `/api/v1/user-programs`
   - POST `/api/v1/user-programs`
   - GET `/api/v1/user-programs/:id`

3. **Workout Logs**
   - GET `/api/v1/workout-logs`
   - POST `/api/v1/workout-logs`
   - GET `/api/v1/workout-logs/:id`

4. **Nutrition Logs**
   - GET `/api/v1/nutrition-logs`
   - POST `/api/v1/nutrition-logs`

5. **Progress Logs**
   - GET `/api/v1/progress-logs`
   - POST `/api/v1/progress-logs`

6. **Check-ins**
   - GET `/api/v1/check-ins`
   - POST `/api/v1/check-ins`

7. **Messages**
   - GET `/api/v1/messages`
   - POST `/api/v1/messages`
   - GET `/api/v1/messages/unread-count`

8. **Notifications**
   - GET `/api/v1/notifications`
   - GET `/api/v1/notifications/unread-count`
   - GET `/api/v1/notifications/:id`
   - PUT `/api/v1/notifications/:id/read`
   - PUT `/api/v1/notifications/read-all`

9. **Orders**
   - GET `/api/v1/products` (authenticated)
   - POST `/api/v1/orders`

### Premium Endpoints (Auth + Premium Required)
1. **My Plans**
   - GET `/api/v1/myplans`
   - GET `/api/v1/myplans/:id`

## Query Parameters

### Common Query Parameters
- `per_page`: Number of items per page (default: 15)
- `page`: Page number for pagination
- `search`: Search term

### Resource-Specific Parameters
- **Programs**: `goal`, `level`
- **Plans**: `category`, `difficulty`
- **Exercises**: `equipment`, `primary_muscle`, `difficulty`, `search`
- **FAQs**: `category`, `search`
- **Notifications**: `status` (unread, read, or omit for all)

## Response Format

### Success Response
```json
{
  "data": { ... },
  "meta": { ... },  // For paginated responses
  "links": { ... }  // For paginated responses
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

## Error Handling

All API calls should:
1. Handle network errors
2. Handle authentication errors (401)
3. Handle validation errors (422)
4. Handle not found errors (404)
5. Provide user-friendly error messages

## Authentication Flow

1. User registers/logs in
2. Token is stored in AsyncStorage
3. Token is included in Authorization header for authenticated requests
4. On 401 error, clear token and redirect to login

## File Uploads

For endpoints that accept file uploads:
- Use FormData
- Content-Type header is automatically set by axios
- Include file in FormData with appropriate field name

## Best Practices

1. **Query Keys**: Use consistent query key structure
   - Format: `['resource', 'list']` or `['resource', id]`
   - Include filters in query key for filtered queries

2. **Cache Management**:
   - Invalidate related queries on mutations
   - Use optimistic updates where appropriate

3. **Loading States**:
   - Use `isLoading` for initial load
   - Use `isFetching` for background refetches

4. **Error States**:
   - Display user-friendly error messages
   - Provide retry mechanisms

5. **Pagination**:
   - Use infinite queries for scrollable lists
   - Use paginated queries for page-based navigation

