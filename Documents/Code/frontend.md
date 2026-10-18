# CivicConnect Frontend Technical Documentation

## 1. System Overview
The **CivicConnect Frontend** is a modern, responsive web portal designed for citizens of **Cape Town** to submit, track, and manage municipal service requests (such as road maintenance, electrical infrastructure, and waste management). Built using vanilla HTML5, CSS3, and JavaScript, the interface implements a high-end 2026 SaaS glassmorphic design system with strict modularity and seamless cross-page navigation.

*   **Project Module:** SEN381
*   **Target User Profile:** Nickyle Kannemeyer (Citizen Role)
*   **Municipality Context:** City of Cape Town Portal

---

## 2. File & Directory Architecture
The frontend codebase is structured cleanly within the repository layout under `civicconnect/frontend/`:

```text
civicconnect/
└── frontend/
    ├── src/
    │   └── style.css                 # Master glassmorphism design system stylesheet
    ├── index.html                    # Citizen Dashboard & Real-Time Metrics
    ├── submit-request.html           # Service Request Creation Form
    ├── my-requests.html              # Comprehensive Request History Table
    ├── messages.html                 # Municipal Communication & Chat Inbox
    ├── settings.html                 # Profile Information Settings
    ├── settings-notifications.html   # Notification Preferences (Email/SMS/Push)
    ├── settings-security.html        # Password Management & 2FA Configuration
    ├── login.html                    # Secure Citizen Login Portal
    ├── register.html                 # New User Registration (with Legal Consent)
    ├── forgot-password.html          # Account Password Recovery Flow
    ├── terms-of-service.html         # Portal Terms of Service Agreement
    ├── privacy-policy.html           # POPIA-Compliant Privacy Policy
    ├── package.json                  # Node/Vite dependency and build configuration
    └── vite.config.js                # Vite build tool settings