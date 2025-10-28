# arogyadhatha Application Maintenance Costs (Estimated)

## Introduction

This document provides a detailed estimate of the potential monthly and yearly maintenance costs for the arogyadhatha application. The costs are broken down by service category and are provided in Indian Rupees (INR).

Please note that these are **estimates**. Actual costs can vary significantly based on user traffic, the number of API calls made, data storage, and the specific pricing plans of third-party services at the time.

---

## 1. Cloud Hosting & Backend (Firebase)

arogyadhatha is built on Firebase, which offers a pay-as-you-go pricing model (Blaze Plan) after a generous free tier (Spark Plan). For a new application, it is likely that you will remain within the free tier for some time.

#### a. Spark Plan (Free Tier)
For low-to-moderate traffic, your costs could be **₹0**. The free tier includes:
- **App Hosting:** 10 GB storage / 360 MB per day data transfer.
- **Cloud Functions:** 2 million invocations/month.
- **Firestore Database (if added):** 1 GiB storage, 50k reads/day, 20k writes/day.

#### b. Blaze Plan (Pay-as-you-go) - Estimated Costs
Once you exceed the free tier, costs are calculated based on usage.

- **App Hosting:**
  - Storage: ~₹2 per GB/month.
  - Data Transfer: ~₹12 per GB transferred.
  - **Estimated Monthly Cost:** ₹0 - ₹800 (depending on traffic)

- **Cloud Functions (for Genkit AI flows):**
  - Invocations: ~₹0.03 per million after the first 2 million.
  - vCPU-time: Very low, typically fractions of a rupee per hour.
  - **Estimated Monthly Cost:** ₹0 - ₹400

**Total Estimated Firebase Monthly Cost:** **₹0 - ₹1,200**

---

## 2. Generative AI Services (Google AI Platform - Gemini)

This is the most variable cost and is directly tied to how many users use the AI-powered features (Symptom Checker, Report Analysis, Medicine Assistant).

- **Pricing Model:** Pay-as-you-go, typically priced per 1,000 characters or per image processed.
- **Example Calculation (Symptom Checker):**
  - An average analysis might involve 3,000 characters (input + output).
  - Gemini Pro pricing is around ₹0.01 per 1,000 characters.
  - Cost per analysis: ~₹0.03
  - If 1,000 analyses are performed in a month: 1,000 * ₹0.03 = ₹30

#### Estimated Monthly AI Costs:
- **Low Usage (a few hundred AI feature uses per month):** **₹50 - ₹250**
- **Moderate Usage (a few thousand AI feature uses per month):** **₹250 - ₹1,500**
- **High Usage (tens of thousands of AI uses):** **₹1,500+**

---

## 3. Domain Name

You will need a custom domain name for your application (e.g., `www.arogyadhatha.com`).

- **Cost:** Varies by registrar (.com domains are typically around ₹800 - ₹1,200 per year).
- **Estimated Yearly Cost:** **~₹1,000**

---

## 4. Third-Party Services & APIs

This includes any other services you might integrate, such as payment gateways, SMS providers for notifications, or advanced mapping services.

- **SMS Gateway (for alerts, OTPs):**
  - Cost: ~₹0.15 - ₹0.25 per SMS.
  - **Estimated Monthly Cost:** Depends entirely on usage. For 1,000 SMS messages, this would be ~₹150 - ₹250.
- **Payment Gateway (if you charge for appointments):**
  - Typically a percentage of the transaction (e.g., 2% + GST). This is a transactional cost, not a fixed maintenance cost.

**Estimated Monthly Cost for Optional Services:** **₹0 - ₹500+**

---

## 5. Developer Maintenance (Optional but Recommended)

For ongoing app health, you may need a developer to perform regular maintenance.

- **Tasks:** Updating software dependencies, fixing bugs, monitoring performance, applying security patches, and developing minor new features.
- **Cost:** This can range from a few hours per month on a freelance basis to a dedicated support contract.
  - **Freelancer:** ~₹800 - ₹2,500 per hour.
  - **Annual Maintenance Contract (AMC):** Could range from **₹40,000 - ₹1,50,000+ per year**.

---

## Summary of Estimated Costs

| Cost Category              | Estimated Monthly Cost (INR) | Estimated Yearly Cost (INR)  | Notes                                        |
| -------------------------- | ---------------------------- | ---------------------------- | -------------------------------------------- |
| **Firebase Services**      | ₹0 - ₹1,200                  | ₹0 - ₹14,400                 | Starts at ₹0 with the free tier.             |
| **Generative AI (Gemini)** | ₹50 - ₹1,500+                | ₹600 - ₹18,000+              | Highly dependent on user activity.           |
| **Domain Name**            | ~₹85 (prorated)              | ~₹1,000                      | Fixed annual cost.                           |
| **Optional Services (SMS)**| ₹0 - ₹500+                   | ₹0 - ₹6,000+                 | Depends on integrations.                     |
| **Developer Maintenance**  | ₹3,000 - ₹12,500+            | ₹40,000 - ₹1,50,000+         | Optional, but recommended for long-term health. |
| **TOTAL (without dev)**    | **₹50 - ₹3,285+**            | **~₹1,600 - ₹39,400+**       | **Core operational costs.**                  |
| **TOTAL (with dev)**       | **₹3,050 - ₹15,785+**        | **~₹41,600 - ₹189,400+**     | **Recommended for a production application.** |
