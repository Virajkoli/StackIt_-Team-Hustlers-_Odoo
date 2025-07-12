# StackIt - Enhanced Authentication & Profile Features

## 🚀 **New Features Implemented**

### 1. **Enhanced Login System**
- **Dual Login Support**: Users can now login with either their email address OR username
- **Flexible Authentication**: The system automatically detects whether the input is an email or username
- **Improved User Experience**: Single input field for both email and username login

### 2. **Profile Management System**
- **Complete Profile Editor**: Users can edit their name, username, email, and password
- **Profile Photo Upload**: Support for uploading and updating profile pictures
- **Secure Password Updates**: Current password verification required for password changes
- **Real-time Validation**: Form validation with helpful error messages

### 3. **Enhanced Navigation**
- **Profile Dropdown**: Click on profile picture/avatar to access profile settings
- **Profile Picture Display**: User's uploaded photo appears in the navbar
- **Quick Access**: Direct access to profile settings from the dropdown menu
- **Visual Improvements**: Better user avatar display with fallback initials

## 🔧 **Technical Implementation**

### Authentication System
- **Modified NextAuth Configuration**: Enhanced to support email/username login
- **Database Integration**: Updated to handle both email and username lookups
- **Session Management**: Profile pictures and user data sync with session

### File Upload System
- **Cloudinary Integration**: Primary image hosting service (configurable)
- **Local Fallback**: Automatic fallback to local storage if Cloudinary isn't configured
- **Image Processing**: Automatic resizing and optimization
- **Security**: File type and size validation

### API Endpoints
- `POST /api/upload/profile` - Profile picture upload
- `PUT /api/user/profile` - Profile information updates
- Enhanced `/api/questions` - Question filtering (Newest, Active, Unanswered)

## 🎯 **How to Use**

### Login Enhancement
1. Go to the login page (`/login`)
2. Enter either your **email address** or **username** in the login field
3. Enter your password
4. Click "Sign in"

### Profile Management
1. **Access Profile Settings**:
   - Click on your profile picture/avatar in the navbar
   - Select "Profile Settings" from the dropdown

2. **Upload Profile Picture**:
   - Click the camera icon on your profile picture
   - Select an image file (JPG, PNG, GIF - max 5MB)
   - Image will be automatically uploaded and updated

3. **Edit Profile Information**:
   - Update your name, username, or email
   - All fields are validated in real-time
   - Username and email uniqueness is enforced

4. **Change Password**:
   - Enter your current password
   - Set a new password (minimum 6 characters)
   - Confirm the new password
   - Current password verification ensures security

### Question Filtering
1. Use the filter buttons on the main page:
   - **Newest**: Most recently asked questions
   - **Active**: Questions with recent answers or activity
   - **Unanswered**: Questions that haven't been answered yet

## 🔧 **Setup Requirements**

### Environment Variables
Add these to your `.env` file for full functionality:

```bash
# Required for image uploads (optional - uses local storage as fallback)
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Existing required variables
DATABASE_URL="your_database_url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key"
```

### Dependencies
The following packages have been added:
- `cloudinary` - Image upload and processing
- `lucide-react` - Additional icons for the UI

## 📁 **File Structure**

### New Files Created
```
app/
├── profile/
│   └── page.js              # Profile management page
├── api/
│   ├── user/
│   │   └── profile/
│   │       └── route.js     # Profile update API
│   └── upload/
│       └── profile/
│           └── route.js     # Profile image upload API
├── HomePageWrapper.js       # Suspense wrapper for homepage
└── HomePage.js              # Enhanced homepage component

public/
└── uploads/
    └── profiles/            # Local image storage (fallback)
        └── .gitkeep
```

### Modified Files
- `lib/auth.js` - Enhanced authentication for email/username login
- `components/Navbar.js` - Added profile dropdown and avatar display
- `app/login/page.js` - Updated to support email/username input
- `app/page.js` - Converted to use client-side filtering

## 🎨 **UI/UX Improvements**

### Visual Enhancements
- **Professional Profile Dropdown**: Clean dropdown menu with user info
- **Responsive Profile Pictures**: Properly sized and styled avatars
- **Loading States**: Smooth loading indicators for all operations
- **Form Validation**: Real-time feedback for form inputs
- **Error Handling**: Clear error messages for better user experience

### Accessibility
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Maintained high contrast for readability
- **Focus Management**: Clear focus indicators throughout the interface

## 🚀 **Getting Started**

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Up Environment**:
   - Copy `.env.example` to `.env`
   - Fill in your database and authentication details
   - (Optional) Add Cloudinary credentials for image hosting

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Test the Features**:
   - Create an account or login with existing credentials
   - Try logging in with both email and username
   - Access profile settings and upload a profile picture
   - Test the question filtering functionality

## 📱 **Mobile Responsiveness**

All new features are fully responsive and work seamlessly across:
- **Desktop**: Full feature set with dropdown menus
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Collapsed navigation with accessible profile management

---

**Note**: The image upload feature works with local storage by default. For production use, it's recommended to configure Cloudinary for better performance and reliability.
