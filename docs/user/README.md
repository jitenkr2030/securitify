# SecurityGuard Pro User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Guard Management](#guard-management)
4. [Location Tracking](#location-tracking)
5. [Geofencing](#geofencing)
6. [Attendance Management](#attendance-management)
7. [Alert Management](#alert-management)
8. [Document Management](#document-management)
9. [Billing & Subscriptions](#billing--subscriptions)
10. [Mobile App Usage](#mobile-app-usage)
11. [Reports & Analytics](#reports--analytics)
12. [Settings & Configuration](#settings--configuration)

## Getting Started

### System Requirements

- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile App**: iOS 12+, Android 8+
- **Internet Connection**: Stable broadband connection for real-time features
- **Device GPS**: Required for location tracking features

### First-Time Login

1. **Access the Platform**
   - Web: Navigate to your company's SecurityGuard Pro URL
   - Mobile: Download the app from App Store or Google Play

2. **Initial Setup**
   ```
   Username: your-email@company.com
   Password: [provided by admin]
   ```

3. **Change Password**
   - You'll be prompted to change your password on first login
   - Password requirements:
     - Minimum 8 characters
     - At least one uppercase letter
     - At least one number
     - At least one special character

4. **Two-Factor Authentication (2FA)**
   - Set up 2FA for enhanced security
   - Options: SMS, Authenticator App, Email

### Navigation Overview

The SecurityGuard Pro interface consists of:

- **Top Navigation Bar**: Quick access to main sections
- **Sidebar Menu**: Detailed navigation and settings
- **Main Content Area**: Current section content
- **Notification Center**: Real-time alerts and updates
- **User Profile**: Account settings and logout

## Dashboard Overview

### Key Metrics

The dashboard provides an at-a-glance view of your security operations:

- **Active Guards**: Number of guards currently on duty
- **Current Alerts**: Active alerts requiring attention
- **Attendance Rate**: Today's attendance percentage
- **Geofence Status**: Active geofences and breach status

### Real-Time Map

- **Live Guard Locations**: Real-time GPS positions of all active guards
- **Geofence Boundaries**: Visual representation of geofenced areas
- **Alert Markers**: Color-coded alerts based on severity
- **Map Controls**: Zoom, pan, and layer toggles

### Recent Activity Feed

- **Timeline View**: Chronological list of recent events
- **Filter Options**: Filter by event type, guard, or time range
- **Quick Actions**: Direct access to related actions from feed items

### Quick Actions Panel

- **Emergency Alert**: Trigger immediate emergency alerts
- **Guard Check-in**: Manual check-in for guards
- **Report Incident**: Quick incident reporting
- **Broadcast Message**: Send messages to all guards

## Guard Management

### Adding New Guards

1. **Navigate to Guards Section**
   - Click "Guards" in the sidebar menu
   - Select "Add New Guard"

2. **Fill Guard Information**
   ```
   Personal Information:
   - Full Name: John Doe
   - Email: john.doe@company.com
   - Phone: +1 (555) 123-4567
   - Photo: [Upload profile picture]
   
   Employment Details:
   - Employee ID: EMP001
   - License Number: LIC123456
   - License Expiry: 2024-12-31
   - Hire Date: 2023-01-15
   
   Assignment:
   - Status: Active
   - Department: Security
   - Shift: Day Shift
   ```

3. **Upload Required Documents**
   - Security license
   - Identification documents
   - Training certificates
   - Background check results

4. **Set Permissions**
   - Access level based on role
   - Mobile app access
   - Notification preferences

### Managing Guard Profiles

**Viewing Guard Details:**
- Click on any guard's name to view their complete profile
- View attendance history, location trails, and assigned geofences

**Updating Guard Information:**
- Edit personal details, employment status, or assignments
- Update license information and documents
- Modify notification preferences

**Guard Status Management:**
- **Active**: Guard is currently employed and active
- **On Leave**: Guard is on approved leave
- **Suspended**: Guard is temporarily suspended
- **Inactive**: Guard is no longer employed

### Guard Scheduling

**Creating Schedules:**
1. Navigate to "Scheduling" under Guards section
2. Select guard(s) to schedule
3. Choose date range and shift times
4. Assign locations and geofences
5. Set recurring patterns if needed

**Schedule Templates:**
- Create reusable schedule templates
- Apply templates to multiple guards
- Modify templates as needed

**Shift Management:**
- Monitor real-time shift coverage
- Handle shift swaps and requests
- Track overtime and compliance

## Location Tracking

### Real-Time Location Monitoring

**Live Tracking Features:**
- **Real-time Updates**: Guard locations update every 30 seconds
- **Location Accuracy**: GPS accuracy indicators for each guard
- **Battery Status**: Monitor device battery levels
- **Movement Trails**: View historical movement paths

**Map Controls:**
- **Zoom Levels**: Street, satellite, and hybrid views
- **Layer Toggles**: Show/hide geofences, alerts, and guard details
- **Filter Options**: Filter guards by status, department, or location
- **Search Function**: Find specific guards or locations

**Location Accuracy:**
- **High Accuracy**: < 10 meters (optimal GPS conditions)
- **Medium Accuracy**: 10-50 meters (moderate GPS conditions)
- **Low Accuracy**: > 50 meters (poor GPS conditions)

### Location History

**Viewing Location Trails:**
1. Select a guard from the list or map
2. Click "Location History" in the guard details panel
3. Choose date range and time filters
4. View movement trails on the map

**Export Options:**
- Export location data as CSV or KML files
- Generate location reports for specific time periods
- Share location trails with authorized personnel

**Geofence Interaction History:**
- Track when guards enter/exit geofences
- Monitor duration of stays within geofenced areas
- Generate geofence compliance reports

### Location Privacy

**Privacy Settings:**
- Guards can disable location tracking during off-duty hours
- Location data is automatically anonymized after 90 days
- Access controls for viewing sensitive location information

**Data Retention:**
- Active location data: 30 days
- Historical location data: 90 days
- Compliance reports: 1 year

## Geofencing

### Creating Geofences

**Geofence Types:**
- **Circular Geofences**: Point and radius-based areas
- **Polygonal Geofences**: Custom-shaped areas with multiple points
- **Linear Geofences**: Route-based monitoring along paths

**Creating a Circular Geofence:**
1. Navigate to "Geofences" in the sidebar
2. Click "Create New Geofence"
3. Select "Circular" type
4. Enter center point (latitude/longitude or click on map)
5. Set radius in meters
6. Configure geofence settings:
   ```
   Geofence Details:
   - Name: Main Building Perimeter
   - Description: Security perimeter around main office building
   - Radius: 200 meters
   - Color: Red
   
   Alert Settings:
   - Entry Alert: Enabled
   - Exit Alert: Enabled
   - Alert Severity: Medium
   - Notification Recipients: All Supervisors
   
   Schedule:
   - Active Hours: 24/7
   - Exception Dates: [List holidays]
   ```

**Creating a Polygonal Geofence:**
1. Select "Polygonal" type
2. Click on map to place vertices
3. Close polygon by clicking first point or "Complete"
4. Configure settings similar to circular geofences

### Geofence Management

**Active Geofences:**
- View all active geofences on the main map
- Monitor real-time geofence status
- Enable/disable geofences as needed

**Geofence Analytics:**
- Entry/exit frequency reports
- Dwell time analysis
- Breach pattern identification
- Peak activity times

**Geofence Groups:**
- Group related geofences for bulk management
- Apply consistent settings across groups
- Generate group-level reports

### Geofence Alerts

**Alert Types:**
- **Entry Alert**: Triggered when guard enters geofence
- **Exit Alert**: Triggered when guard exits geofence
- **Dwell Time Alert**: Triggered when guard stays too long/short
- **Unauthorized Entry**: Triggered for unauthorized access

**Alert Configuration:**
```
Alert Settings:
- Trigger Conditions: Entry, Exit, Both
- Grace Period: 30 seconds (prevents false alerts)
- Quiet Hours: 10:00 PM - 6:00 AM
- Escalation Rules: Notify supervisor after 5 minutes
```

**Alert Response:**
- Real-time push notifications
- Email alerts for critical incidents
- SMS alerts for emergency situations
- Automated escalation procedures

## Attendance Management

### Check-in/Check-out System

**Attendance Methods:**
- **GPS Check-in**: Location-based verification
- **Facial Recognition**: AI-powered face verification
- **QR Code**: Scanning QR codes at locations
- **Manual Check-in**: Supervisor-approved manual entries

**GPS Check-in Process:**
1. Guard opens mobile app
2. App verifies GPS location
3. Guard confirms check-in location
4. System validates against assigned geofences
5. Attendance record is created

**Facial Recognition Check-in:**
1. Guard selects "Check-in with Face"
2. Camera activates for face capture
3. AI verifies face against registered profile
4. Location is captured simultaneously
5. Attendance record with verification score

### Attendance Rules

**Check-in Requirements:**
- Must be within assigned geofence
- GPS accuracy must be < 50 meters
- Must be during scheduled shift hours
- Device battery must be > 20%

**Check-out Requirements:**
- Must complete assigned duties
- Must be within designated check-out area
- Must report any incidents
- Equipment must be returned

**Attendance Policies:**
- **Late Arrival**: More than 15 minutes after scheduled time
- **Early Departure**: More than 15 minutes before scheduled end
- **Missed Check-in**: No check-in recorded for scheduled shift
- **Incomplete Shift**: Less than minimum required hours

### Attendance Monitoring

**Real-Time Attendance Dashboard:**
- Current shift coverage
- Late arrivals and early departures
- Absent guards and replacements
- Attendance compliance rates

**Attendance Reports:**
- Daily attendance summaries
- Weekly attendance trends
- Monthly compliance reports
- Individual guard attendance history

**Exception Management:**
- Approve/deny attendance exceptions
- Track exception reasons
- Generate exception reports
- Monitor exception patterns

## Alert Management

### Alert Types and Severity

**Alert Categories:**
- **Geofence Breaches**: Unauthorized entry/exit
- **Emergency Alerts**: Panic button, medical emergencies
- **System Alerts**: Device offline, low battery
- **Schedule Alerts**: Missed check-ins, schedule violations
- **Security Alerts**: Unauthorized access, suspicious activity

**Severity Levels:**
- **Critical**: Immediate action required (life-threatening)
- **High**: Urgent attention needed (security breach)
- **Medium**: Important but not urgent (policy violation)
- **Low**: Informational (routine notifications)

### Alert Configuration

**Alert Rules:**
```
Alert Rule Example:
- Name: After-Hours Geofence Breach
- Trigger: Guard enters restricted area after 10 PM
- Conditions: 
  * Geofence: Restricted Zone
  * Time: 22:00 - 06:00
  * Guard Status: On Duty
- Actions:
  * Immediate notification to supervisor
  * Email alert to security manager
  * Log incident for review
- Escalation: Call security manager after 5 minutes
```

**Notification Channels:**
- **Push Notifications**: Mobile app notifications
- **Email Alerts**: Detailed email notifications
- **SMS Alerts**: Text messages for critical alerts
- **Voice Calls**: Automated calls for emergencies

### Alert Response Workflow

**Alert Acknowledgment:**
1. Alert is triggered and sent to relevant personnel
2. Recipients acknowledge receipt of alert
3. System tracks acknowledgment time
4. Unacknowledged alerts are escalated

**Alert Resolution:**
1. Investigate alert cause and circumstances
2. Take appropriate action based on alert type
3. Document resolution steps and outcomes
4. Close alert with resolution details

**Alert Analytics:**
- Alert frequency and patterns
- Response time analysis
- False alert identification
- Alert effectiveness metrics

## Document Management

### Document Types

**Required Documents:**
- **Security License**: Valid security guard license
- **Identification**: Government-issued ID
- **Training Certificates**: Security training completion
- **Background Check**: Criminal background check results

**Optional Documents:**
- **First Aid Certification**: First aid training certificate
- **Fire Safety Training**: Fire safety training completion
- **Vehicle License**: Driver's license if required
- **Specialized Training**: Additional skill certifications

### Document Upload and Management

**Uploading Documents:**
1. Navigate to guard's profile
2. Select "Documents" tab
3. Click "Upload Document"
4. Choose document type and file
5. Set expiry date if applicable
6. Add relevant notes or descriptions

**Supported File Types:**
- PDF documents
- Image files (JPG, PNG)
- Word documents
- Excel spreadsheets

**File Size Limits:**
- Maximum file size: 10MB per document
- Maximum documents per guard: 50
- Storage quota per organization: 5GB

### Document Expiry Tracking

**Expiry Monitoring:**
- Automatic expiry date tracking
- 30-day advance expiry warnings
- 7-day critical expiry alerts
- Expired document notifications

**Expiry Actions:**
- Automatic guard status suspension for expired licenses
- Notification to supervisors and guards
- Document renewal reminders
- Compliance reporting

**Document Compliance:**
- Compliance status dashboard
- Missing document alerts
- Expiry risk assessments
- Compliance audit trails

## Billing & Subscriptions

### Subscription Plans

**Plan Comparison:**

| Feature | Basic | Professional | Enterprise |
|---------|-------|-------------|------------|
| Guards | Up to 10 | Up to 50 | Unlimited |
| Geofences | 5 | 25 | Unlimited |
| Location History | 30 days | 90 days | 1 year |
| Advanced Reports | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| Custom Integrations | ❌ | ❌ | ✅ |
| White Label | ❌ | ❌ | ✅ |

**Pricing:**
- **Basic**: $29/month
- **Professional**: $99/month
- **Enterprise**: Custom pricing

### Billing Management

**Subscription Management:**
- View current plan and usage
- Upgrade/downgrade subscription
- Cancel subscription
- View billing history

**Payment Methods:**
- Credit/Debit cards
- Bank transfers
- Invoicing (Enterprise only)

**Billing Cycle:**
- Monthly billing
- Annual billing (20% discount)
- Prorated charges for plan changes

### Usage Monitoring

**Usage Dashboard:**
- Active guard count
- Geofence utilization
- Storage usage
- API call volume

**Usage Alerts:**
- 80% usage warning
- 100% usage notification
- Overage charges notification
- Plan upgrade recommendations

## Mobile App Usage

### App Installation and Setup

**Downloading the App:**
- **iOS**: App Store - "SecurityGuard Pro"
- **Android**: Google Play Store - "SecurityGuard Pro"
- **Requirements**: iOS 12+ or Android 8+

**Initial Setup:**
1. Install app from respective app store
2. Open app and enter company code
3. Login with provided credentials
4. Complete profile setup
5. Enable location services
6. Set up notification preferences

### Mobile App Features

**Core Features:**
- **Check-in/Check-out**: Location-based attendance
- **Location Sharing**: Real-time GPS tracking
- **Alert Notifications**: Push notifications for alerts
- **Document Access**: View assigned documents
- **Schedule Viewing**: View assigned shifts
- **Communication**: In-app messaging

**Advanced Features:**
- **Offline Mode**: Work without internet connection
- **Geofence Alerts**: Receive boundary notifications
- **Emergency Button**: Quick emergency alert trigger
- **Photo Capture**: Take photos for reports
- **Signature Capture**: Digital signatures for reports

### Offline Functionality

**Offline Data Storage:**
- Location data cached locally
- Attendance records stored offline
- Alert history available offline
- Documents available for offline viewing

**Data Synchronization:**
- Automatic sync when internet available
- Manual sync option
- Conflict resolution for duplicate data
- Sync status indicators

**Offline Limitations:**
- Real-time alerts not available
- Location accuracy may be reduced
- Some features require internet
- Large documents may not be available offline

## Reports & Analytics

### Available Reports

**Attendance Reports:**
- Daily attendance summary
- Weekly attendance trends
- Monthly compliance reports
- Individual guard attendance history
- Late arrival analysis
- Early departure tracking

**Location Reports:**
- Location history trails
- Geofence compliance reports
- Movement pattern analysis
- Distance traveled reports
- Location accuracy reports

**Alert Reports:**
- Alert frequency analysis
- Response time metrics
- Alert resolution rates
- False alert identification
- Alert pattern analysis

**Performance Reports:**
- Guard performance metrics
- Shift coverage analysis
- Overtime tracking
- Compliance scores
- Productivity metrics

### Custom Reports

**Report Builder:**
- Drag-and-drop interface
- Custom data filters
- Multiple chart types
- Scheduled report generation
- Export in multiple formats

**Report Templates:**
- Save custom report templates
- Share templates with team members
- Modify existing templates
- Template version control

**Scheduled Reports:**
- Automatic report generation
- Email delivery options
- Custom scheduling (daily, weekly, monthly)
- Report distribution lists

### Data Export

**Export Formats:**
- CSV (Comma Separated Values)
- Excel (XLSX)
- PDF (Portable Document Format)
- JSON (JavaScript Object Notation)
- KML (Keyhole Markup Language)

**Export Options:**
- Date range selection
- Data filtering
- Column selection
- Format customization
- Compression options

## Settings & Configuration

### Organization Settings

**Company Information:**
- Company name and logo
- Contact information
- Business hours
- Time zone settings
- Language preferences

**Security Settings:**
- Password policies
- Two-factor authentication
- Session timeout settings
- IP address restrictions
- Audit logging configuration

**Notification Settings:**
- Email notification preferences
- Push notification settings
- SMS alert configuration
- Notification schedules
- Quiet hours configuration

### User Management

**User Roles and Permissions:**

| Role | Permissions |
|------|------------|
| Admin | Full system access, user management, billing |
| Manager | Guard management, reports, alerts |
| Supervisor | Real-time monitoring, alert response |
| Guard | Check-in/out, location sharing, basic features |

**User Management Features:**
- Add/remove users
- Modify user roles
- Reset passwords
- Manage user sessions
- View user activity logs

### Integration Settings

**Third-Party Integrations:**
- **Email Services**: SMTP configuration
- **Payment Processing**: Stripe integration
- **Communication**: Twilio for SMS
- **Storage**: Cloud storage configuration
- **Analytics**: Google Analytics integration

**API Configuration:**
- API key management
- Rate limiting settings
- Webhook configuration
- Access token management
- API usage monitoring

### Data Management

**Data Retention Policies:**
- Location data retention: 90 days
- Alert history retention: 1 year
- Document retention: 7 years
- Audit log retention: 10 years

**Data Backup:**
- Automatic daily backups
- Manual backup options
- Backup restoration procedures
- Backup integrity verification

**Data Export/Import:**
- Bulk data export
- Data import utilities
- Format conversion tools
- Data validation procedures

## Troubleshooting

### Common Issues

**Login Problems:**
- Forgot password: Use "Forgot Password" link
- Account locked: Contact administrator
- 2FA issues: Use backup codes or contact support
- Browser issues: Clear cache and cookies

**Location Tracking Issues:**
- GPS not working: Check location services
- Inaccurate locations: Ensure clear sky view
- Battery drain: Optimize location settings
- Offline mode: Check internet connection

**Mobile App Issues:**
- App crashes: Restart app and device
- Sync problems: Check internet connection
- Notifications not working: Check notification settings
- Performance issues: Clear app cache

### Getting Support

**Support Channels:**
- **Help Center**: In-app help documentation
- **Email Support**: support@securityguardpro.com
- **Phone Support**: 1-800-SECURITY (Enterprise only)
- **Live Chat**: Available during business hours

**Support Response Times:**
- **Critical Issues**: 1 hour response
- **High Priority**: 4 hours response
- **Medium Priority**: 24 hours response
- **Low Priority**: 48 hours response

**System Status:**
- Check system status at status.securityguardpro.com
- Subscribe to status notifications
- View maintenance schedules
- Report system issues

### Best Practices

**Security Best Practices:**
- Use strong, unique passwords
- Enable two-factor authentication
- Regular security training
- Report suspicious activity
- Keep software updated

**Operational Best Practices:**
- Regular system backups
- Monitor system performance
- Keep documentation updated
- Regular staff training
- Incident response planning

**Data Management Best Practices:**
- Regular data cleanup
- Monitor storage usage
- Validate data integrity
- Implement data retention policies
- Secure sensitive information