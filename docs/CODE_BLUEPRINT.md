
# Arogyadhatha: Application Code Blueprint

## 1. Introduction

This document provides a comprehensive technical and functional blueprint of the Arogyadhatha application. It is designed to serve as a reference for developers, outlining the app's architecture, features, components, and data structures.

Arogyadhatha is an all-in-one digital health platform that simplifies healthcare management for users in India. It integrates a wide range of services, from AI-powered diagnostics to appointment booking and medication management, into a single, user-friendly interface with bilingual (English/Telugu) support.

---

## 2. Core Features & Functionality

This section details the primary features available to the user and the components that power them.

### 2.1. Main Dashboard (`/`)
- **File:** `src/app/(app)/page.tsx`
- **Description:** The central landing page providing an overview and quick access to all major modules.
- **Key Components:**
    - **Quick Access Grid:** A responsive grid of icons linking to all major features. (`quickAccessItems`)
    - **Organ Health Overview:** A visual summary of the user's organ health status, based on recent reports. Each organ is a clickable component that opens a detailed dialog.
    - **Health Tips Carousel:** An auto-playing carousel displaying app updates and daily health tips.
    - **Medicine Assistance Links:** Direct links to the AI Medicine Assistant and Pharmacist Consultation.

### 2.2. AI Symptom Checker (`/symptom-checker`)
- **File:** `src/app/(app)/symptom-checker/page.tsx`
- **Genkit Flow:** `src/ai/flows/ai-disease-info.ts` (`getDiseaseInfo`)
- **Description:** Allows users to input symptoms via text or voice and receive an AI-powered analysis.
- **Functionality:**
    - Determines if the input is a disease name or a symptom description.
    - Provides a summary, recommended diet, potential tests, and suggests the correct specialist.
    - Includes a searchable list of common diseases and symptoms.

### 2.3. Appointments & History (`/appointments`)
- **File:** `src/app/(app)/appointments/page.tsx`
- **Description:** A dual-purpose module for finding and booking new appointments, and viewing past appointment history.
- **Functionality:**
    - **Find a Doctor:**
        - Filter doctors by specialty, hospital, location, and name.
        - Displays a list of doctors with their profiles, experience, and fees.
        - **Booking Flow:** A multi-step dialog to select a date/time and process payment.
    - **Appointments History:**
        - Displays a chronological, collapsible list of past health issues.
        - Each issue contains follow-up visits, prescriptions, and lab reports.
        - Users can add/edit/delete follow-up entries.
        - Supports uploading and viewing prescription/report images.
        - Integrates an **AI Report Analysis** feature (`analyzeReport` flow).

### 2.4. Live OPD Status (`/opd-queue`)
- **File:** `src/app/(app)/opd-queue/page.tsx`
- **Description:** Provides real-time status for a user's upcoming outpatient department (OPD) appointment.
- **Functionality:**
    - Displays the user's token number and the token number currently being served.
    - Shows an estimated wait time.
    - Displays the doctor's current status (e.g., "Available", "In Surgery").
    - Provides detailed information about the doctor and hospital.

### 2.5. Diagnostics & Lab Reports (`/lab-reports`)
- **File:** `src/app/(app)/lab-reports/page.tsx` & `lab-reports-client.tsx`
- **Description:** A comprehensive module for managing diagnostic tests and reports.
- **Functionality:**
    - **Find a Lab:** Search and filter diagnostic labs by name, location, and test category. View lab details and available tests.
    - **My Reports:**
        - View a chronologically grouped list of all past lab reports.
        - Upload new reports with associated details.
        - View report images and trigger AI analysis for a simplified summary.

### 2.6. My Medicines (`/medicines`)
- **File:** `src/app/(app)/medicines/page.tsx`
- **Description:** A tool for managing medication schedules, tracking adherence, and ordering from pharmacies.
- **Functionality:**
    - **My Schedule:** Displays current prescriptions, dosages, and timings. Users can mark doses as "taken" or "missed."
    - **Medication History:** A collapsible view of adherence records for past days.
    - **Order from Pharmacy:** A tab to browse local pharmacies, upload prescriptions, chat with the pharmacist, and complete payment.
    - **AI Diet Plan:** Integrates the `generateDietPlan` AI flow to create a personalized diet based on the user's conditions and medications.

### 2.7. Old Age Assistant (`/old-age-assistant`)
- **File:** `src/app/(app)/old-age-assistant/page.tsx`
- **Description:** A service to connect users with caretakers, nurses, and other support providers for senior citizens.
- **Functionality:**
    - **Book a Service:** Users can request a service or browse a directory of verified providers.
    - **Become a Provider:** A complete application flow for individuals to register as service providers, including document upload.
    - **Service Tracking:** A "Family View" to track an assigned provider's daily attendance and see hourly photo/location updates for peace of mind.

### 2.8. Blood Bank (`/blood-bank`)
- **File:** `src/app/(app)/blood-bank/page.tsx`
- **Description:** A community-driven feature to connect blood donors with those in need.
- **Functionality:**
    - **Find Donors:** A filterable list of registered donors.
    - **Request Blood:** A form for users to post a public request for blood.
    - **Register as Donor:** A form for users to register themselves as a potential donor.
    - **Blood Bank Centers:** A static list of official blood bank contact information.

---

## 3. Technical Architecture

### 3.1. Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Components:** ShadCN UI, custom components built with Radix UI primitives.
- **Styling:** Tailwind CSS. The theme is configured in `src/app/globals.css` with CSS variables.
- **State Management:**
    - React Hooks (`useState`, `useEffect`, `useMemo`).
    - React Context API for global state like `language` and `location`.
- **Icons:** `lucide-react`.

### 3.2. Backend & AI
- **Platform:** Firebase (implied for future deployment via `apphosting.yaml`).
- **Generative AI:** Google AI via Genkit.
    - **Configuration:** `src/ai/genkit.ts` initializes the `ai` object with the `gemini-2.0-flash` model.
    - **AI Flows:** Located in `src/ai/flows/`. Each flow is a server-side function (`'use server'`) that defines input/output schemas (using Zod) and a prompt for the AI model.
        - `ai-assistant.ts`: General-purpose chatbot using user's health data.
        - `ai-disease-info.ts`: Provides detailed info on diseases or symptoms.
        - `ai-diet-plan.ts`: Generates personalized diet plans.
        - `ai-report-analysis.ts`: Summarizes medical reports and finds abnormalities.
        - And others for specific use cases.

### 3.3. Project Structure
`'
/
├── public/                 # Static assets
├── src/
│   ├── app/                # Main application source
│   │   ├── (app)/          # Main authenticated layout group
│   │   │   ├── [page]/     # Individual feature pages
│   │   │   ├── layout.tsx  # Main app layout
│   │   │   └── page.tsx    # Dashboard/Home page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles & ShadCN theme
│   ├── ai/                 # Genkit AI configuration and flows
│   │   ├── flows/
│   │   └── genkit.ts
│   ├── components/         # Reusable React components
│   │   ├── icons/          # Custom icon components
│   │   ├── layout/         # Layout-specific components (header, nav)
│   │   └── ui/             # ShadCN UI components
│   ├── context/            # React Context providers (Language, Location)
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions and static data
├── tailwind.config.ts      # Tailwind CSS configuration
└── next.config.ts          # Next.js configuration
`'

---

## 4. Data Structures & Static Data

The application currently relies on static TypeScript/JSON files for data, acting as mocks for a future database.

- **`src/lib/appointments-data.ts`**: Contains `previousAppointments`, a detailed array of patient appointment histories, including follow-ups, prescriptions, and lab results.
- **`src/lib/lab-reports-data.ts`**: A simple array listing all lab reports with their status.
- **`src/lib/medicines-data.ts`**: Defines the user's current `medicineSchedule` and `medicineHistoryData`.
- **`src/lib/organ-health-data.ts`**: An array of objects detailing the health status of major organs, sourced from various reports.
- **`src/lib/notifications.ts`**: A static list of user notifications.
- **`src/lib/keywords.json`**: A comprehensive list of medical and app-related keywords used for the global search feature.
- **`src/lib/nav-config.ts`**: Defines the structure, icons, and properties of all navigation items in the app.

---

## 5. Key UI Components & Patterns

- **`AppLayout` (`src/components/layout/app-layout.tsx`):** The core layout component containing the sticky header and fixed footer navigation. It manages the global search, notifications, and user profile dropdowns.
- **`Dialog` Components:** Custom dialogs are used extensively for forms (booking, editing), detailed views (reports), and interactions (AI Assistant).
- **`Card` Components:** Used as the primary container for organizing information sections on most pages.
- **`Tabs` Components:** Employed for separating major sections of content, such as on the Appointments and Blood Bank pages.
- **`Collapsible` Components:** Used for creating nested, expandable sections, particularly in the appointment history to show/hide follow-up details.
- **Context Providers (`src/context/`):**
    - **`LanguageProvider`:** Manages the `en`/`te` language state, allowing for dynamic translation across the UI.
    - **`LocationProvider`:** Manages the user's selected city, with a dialog for selection.
- **Global Search (`src/components/layout/global-search.tsx`):** A `cmdk`-powered command palette allowing users to quickly search for features and keywords across the app.
