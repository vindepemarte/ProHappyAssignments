# Requirements Document

## Introduction

ProHappyAssignments is a web platform that connects students with academic assignment services through a streamlined form-based system. The platform features a landing page and three distinct forms for different user types: Assignment requests, Worker submissions, and Change requests. The system is designed to be mobile-first, integrate with n8n workflows via webhooks, and include proper data protection compliance for 2025.

## Requirements

### Requirement 1: Landing Page

**User Story:** As a visitor, I want to see an attractive landing page that clearly presents the ProHappyAssignments brand and allows me to start my project, so that I can easily access the assignment form.

#### Acceptance Criteria

1. WHEN a user visits the website THEN the system SHALL display a landing page with the ProHappyAssignments branding
2. WHEN a user views the landing page THEN the system SHALL show a prominent "Start Your Project" button
3. WHEN a user clicks "Start Your Project" THEN the system SHALL navigate to the Assignment form
4. WHEN the page loads THEN the system SHALL display the brand colors matching the provided design
5. WHEN viewed on mobile devices THEN the system SHALL render responsively with mobile-first design principles

### Requirement 2: Form Navigation System

**User Story:** As a user, I want to access different types of forms (Assignments, Request Changes, Worker) through a tabbed interface, so that I can choose the appropriate form for my needs.

#### Acceptance Criteria

1. WHEN a user accesses the forms page THEN the system SHALL display three tabs: "Assignments", "Request Changes", and "Worker"
2. WHEN a user clicks on a tab THEN the system SHALL switch to the corresponding form
3. WHEN the forms page loads THEN the system SHALL default to the "Assignments" tab
4. WHEN switching between tabs THEN the system SHALL maintain form state until submission or page refresh
5. WHEN viewed on mobile THEN the system SHALL display tabs in a mobile-friendly layout

### Requirement 3: Assignment Form with Access Control

**User Story:** As a student, I want to submit assignment requests through a secure form that requires a 5-character access code, so that I can request academic assistance while preventing spam submissions.

#### Acceptance Criteria

1. WHEN a user accesses the Assignment form THEN the system SHALL require a 5-character unique code for access
2. WHEN an invalid code is entered THEN the system SHALL display an error message and prevent form access
3. WHEN a valid code is entered THEN the system SHALL unlock the assignment form fields
4. WHEN submitting the form THEN the system SHALL collect: Full Name, Email, Module Name, Word Count, Order Deadline, Assignment Files, and Guidance
5. WHEN the form is submitted THEN the system SHALL send data to the configured n8n webhook
6. WHEN submission is successful THEN the system SHALL display a confirmation message stating "You will receive an email with updates"
7. WHEN file uploads are included THEN the system SHALL support multiple file attachments

### Requirement 4: Request Changes Form

**User Story:** As a client, I want to submit change requests for existing orders using a unique reference code, so that I can modify my assignment requirements or deadlines.

#### Acceptance Criteria

1. WHEN a user accesses the Request Changes form THEN the system SHALL require a 5-character order reference number
2. WHEN an invalid reference is entered THEN the system SHALL display an error message
3. WHEN a valid reference is entered THEN the system SHALL unlock the change request form fields
4. WHEN submitting the form THEN the system SHALL collect: Email address, Order Reference Number, Notes, Deadline Changes, and Upload Files
5. WHEN the form is submitted THEN the system SHALL send data to the configured n8n webhook
6. WHEN submission is successful THEN the system SHALL display a confirmation message about email updates

### Requirement 5: Worker Form

**User Story:** As a worker, I want to submit completed assignments using a unique order code, so that I can deliver work to clients through the platform.

#### Acceptance Criteria

1. WHEN a worker accesses the Worker form THEN the system SHALL require a 5-character order reference number
2. WHEN an invalid reference is entered THEN the system SHALL display an error message
3. WHEN a valid reference is entered THEN the system SHALL unlock the worker submission form fields
4. WHEN submitting the form THEN the system SHALL collect: Email address, Order Reference Number, Notes for Client, and Upload Section
5. WHEN the form is submitted THEN the system SHALL send data to the configured n8n webhook
6. WHEN submission is successful THEN the system SHALL display a confirmation message about email updates

### Requirement 6: Data Protection Compliance

**User Story:** As a website visitor, I want to be informed about data collection practices and provide consent, so that my privacy rights are protected according to 2025 regulations.

#### Acceptance Criteria

1. WHEN a user first visits the website THEN the system SHALL display a cookie consent banner
2. WHEN a user interacts with forms THEN the system SHALL clearly indicate data collection practices
3. WHEN a user requests it THEN the system SHALL provide access to Terms and Conditions
4. WHEN a user requests it THEN the system SHALL provide access to Privacy Policy
5. WHEN collecting personal data THEN the system SHALL comply with current data protection regulations
6. WHEN users provide consent THEN the system SHALL store consent preferences

### Requirement 7: Mobile-First Responsive Design

**User Story:** As a mobile user, I want the website to work seamlessly on my phone, so that I can access all features without desktop dependency.

#### Acceptance Criteria

1. WHEN viewed on mobile devices THEN the system SHALL prioritize mobile user experience
2. WHEN forms are displayed on mobile THEN the system SHALL use appropriate input types and layouts
3. WHEN file uploads are used on mobile THEN the system SHALL support mobile file selection
4. WHEN navigation is used on mobile THEN the system SHALL provide touch-friendly interface elements
5. WHEN content is displayed THEN the system SHALL scale appropriately across all screen sizes

### Requirement 8: Webhook Integration

**User Story:** As a system administrator, I want all form submissions to be sent to n8n webhooks, so that I can process and manage submissions through automated workflows.

#### Acceptance Criteria

1. WHEN any form is submitted THEN the system SHALL send form data to the configured webhook endpoint
2. WHEN webhook calls are made THEN the system SHALL include all form fields in the payload
3. WHEN webhook calls fail THEN the system SHALL display appropriate error messages to users
4. WHEN webhook calls succeed THEN the system SHALL confirm successful submission
5. WHEN configuring webhooks THEN the system SHALL support environment-based configuration

### Requirement 9: GitHub and Deployment Ready

**User Story:** As a developer, I want the project to be ready for GitHub deployment and Coolify hosting, so that I can easily deploy and maintain the application.

#### Acceptance Criteria

1. WHEN the project is created THEN the system SHALL include proper Git configuration files
2. WHEN deploying THEN the system SHALL include necessary build and deployment scripts
3. WHEN configuring THEN the system SHALL support environment variables for webhook URLs
4. WHEN documenting THEN the system SHALL include comprehensive README with setup instructions
5. WHEN building THEN the system SHALL optimize for production deployment