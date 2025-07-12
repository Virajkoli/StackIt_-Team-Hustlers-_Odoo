# Admin Moderation System

## Overview

StackIt now includes a comprehensive admin moderation system that allows administrators to manage content and users effectively. The system provides tools for content moderation, user management, and platform oversight.

## Features

### 🛡️ Admin Dashboard
- **Overview Statistics**: View platform metrics including total users, questions, answers, and daily activity
- **Content Management**: Browse and moderate recent questions and answers
- **User Management**: View all users and manage their roles
- **Real-time Data**: All statistics and content lists are updated in real-time

### 🔐 Role-Based Access Control
- **Admin Role**: Full access to moderation tools and admin dashboard
- **User Role**: Standard user permissions
- **Guest Role**: Limited access for unauthenticated users

### 📊 Content Moderation
- **Delete Questions**: Remove inappropriate or spam questions
- **Delete Answers**: Remove inappropriate or spam answers
- **Admin Actions**: Visible admin action buttons on all content
- **Bulk Operations**: Efficient content management through the dashboard

### 👥 User Management
- **Role Management**: Promote users to admin or demote admins to users
- **User Statistics**: View user activity and contribution metrics
- **User Oversight**: Monitor user behavior and activity patterns

## Getting Started

### 1. Creating the First Admin User

The database seed script automatically creates an admin user with the following credentials:
- **Email**: `admin@stackit.com`
- **Username**: `admin`
- **Password**: `password123`
- **Role**: `ADMIN`

To create the admin user, run:
```bash
npm run db:seed
```

### 2. Promoting Existing Users to Admin

Use the admin promotion script to make any existing user an admin:

```bash
# Promote by email
node scripts/promote-admin.js admin@stackit.com

# Promote by username
node scripts/promote-admin.js johndoe
```

### 3. Accessing the Admin Dashboard

1. Log in with admin credentials
2. Click on your profile dropdown in the navigation bar
3. Select "Admin Dashboard" (only visible to admin users)
4. Access the dashboard at `/admin`

## Admin Interface

### Dashboard Sections

#### Overview
- Platform statistics and metrics
- Daily activity summaries
- User and content counts

#### Recent Questions
- List of recently posted questions
- Quick delete actions
- Author information and engagement metrics

#### Recent Answers
- List of recently posted answers
- Quick delete actions
- Associated question information

#### Users
- Complete user listing
- Role management (promote/demote)
- User activity statistics

### Admin Actions on Content

Admin users will see additional moderation controls on all questions and answers:

- **Delete Button**: Immediately remove inappropriate content
- **Admin Badge**: Visual indicator of admin actions
- **Confirmation Dialogs**: Prevent accidental deletions

## API Endpoints

### Admin Moderation API (`/api/admin/moderate`)

#### GET - Retrieve Data
- `?type=overview` - Get platform statistics
- `?type=recent_questions` - Get recent questions
- `?type=recent_answers` - Get recent answers
- `?type=users` - Get all users

#### DELETE - Remove Content
- `?questionId={id}` - Delete a specific question
- `?answerId={id}` - Delete a specific answer

#### POST - Admin Actions
```json
{
  "action": "ban_user|hide_question|hide_answer",
  "userId": "user-id",
  "questionId": "question-id",
  "answerId": "answer-id"
}
```

### User Role Management API (`/api/admin/users/role`)

#### POST - Update User Role
```json
{
  "userId": "user-id",
  "role": "USER|ADMIN"
}
```

## Security Features

### Authentication & Authorization
- **Session Validation**: All admin endpoints require valid authentication
- **Role Verification**: Admin-only routes protected by role checking
- **Error Handling**: Proper error responses for unauthorized access

### Admin Middleware
- **requireAdmin()**: Server-side admin validation
- **isAdmin()**: Client-side role checking
- **createAdminResponse()**: Standardized error responses

## Database Schema

### User Model Updates
```prisma
model User {
  // ... existing fields
  role Role @default(USER)
}

enum Role {
  GUEST
  USER
  ADMIN
}
```

## Components

### AdminActions Component
- **Location**: `/components/AdminActions.js`
- **Purpose**: Renders admin-only action buttons on content
- **Features**: Delete functionality with confirmation dialogs

### Admin Dashboard
- **Location**: `/app/admin/page.js`
- **Purpose**: Main admin interface
- **Features**: Statistics, content management, user management

## Usage Guidelines

### Best Practices
1. **Content Moderation**: Review content before deletion
2. **User Management**: Use promotion/demotion sparingly
3. **Documentation**: Keep track of administrative actions
4. **Security**: Regularly review admin user list

### Content Deletion
- Deletions are permanent and cannot be undone
- All related data (votes, notifications) are automatically removed
- Consider the impact on user experience before deletion

### User Role Management
- Only promote trusted users to admin
- Regularly review admin user permissions
- Maintain at least one admin user at all times

## Development Notes

### File Structure
```
/lib/adminAuth.js          # Admin authentication utilities
/api/admin/moderate/       # Content moderation endpoints
/api/admin/users/role/     # User role management endpoints
/app/admin/                # Admin dashboard pages
/components/AdminActions.js # Admin action buttons
/scripts/promote-admin.js   # Admin promotion utility
```

### Environment Variables
No additional environment variables are required for admin functionality. The system uses the existing database and authentication configuration.

### Testing
1. Create test users with different roles
2. Test content moderation actions
3. Verify role promotion/demotion
4. Test admin dashboard functionality

## Troubleshooting

### Common Issues

#### Admin Dashboard Not Accessible
- **Verify user has ADMIN role in database**: Run `node scripts/promote-admin.js <email>` to promote user
- **Check authentication session**: Log out and log back in after role change
- **Ensure proper navigation to `/admin`**: Admin dashboard link appears in profile dropdown

#### Admin Actions Not Visible
- Confirm user is logged in as admin
- Check role in session data - may require logout/login after role change
- Verify AdminActions component is properly imported

#### Permission Errors
- Verify admin middleware is working
- Check database connection
- Ensure proper role assignment

#### Session Role Not Updating
If admin role changes don't appear immediately:
1. **Log out and log back in** - This refreshes the session with latest role
2. **Clear browser cache** if issues persist
3. **Verify role in database** using the promote script

**Note**: The authentication system now automatically fetches the latest user role on each session call, but existing sessions may need to be refreshed.

### Support
For additional support or feature requests, please refer to the project documentation or contact the development team.

## Future Enhancements

Potential future improvements include:
- Content flagging system
- Automated moderation rules
- Admin activity logging
- Advanced user analytics
- Bulk content operations
- Email notifications for admin actions
