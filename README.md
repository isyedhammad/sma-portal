# SMA Licensing & Hearing Management System

### Director SMA/T (Licensing Authority)
### Directorate General of Mines & Minerals, Government of the Punjab
### Small Mines Assistance/Titles (SMA/T)

![Gov of Punjab](https://img.shields.io/badge/Government_of_the_Punjab-Mines_%26_Minerals_Department-0e704a?style=for-the-badge)
![Status](https://img.shields.io/badge/Statutory_Authority-Active-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/Jurisdiction-Punjab_Mining_Concession_Rules_2002-blue?style=for-the-badge)

---

## Executive Overview
The **SMA Licensing & Hearing Management System** is an executive web application built for the **Director SMA/T (Licensing Authority)**, Directorate General of Mines & Minerals (DGM&M), Government of the Punjab.

It provides end-to-end administration of **Small Mines Assistance/Titles (SMA/T)** concessions, monitoring all **1,836 Small Scale Mining (SSM)** leases across Punjab (Attock, Chakwal, Dera Ghazi Khan, Jhelum, Khushab, Mianwali, Rahim Yar Khan, Rajanpur, Rawalpindi, Sargodha), scheduling statutory **Personal Hearings**, and tracking post-hearing **Orders & Decisions**.

---

## Core Capabilities & Modules

### 1. Executive Summary Dashboard & Leases Explorer
- **Genuine Data from 1,836 Small Scale Mining Leases**:
  - Live status breakdown (*Active*, *Show-Cause Issued*, *Suspended*, *Expired*).
  - Searchable and filterable data grid directly on the dashboard.
- **Major Small Scale Mineral Assets**:
  - Himalayan Pink Salt (Salt Range: Jhelum & Khushab)
  - Coal (Chakwal & Mianwali Collieries)
  - Limestone & Stone (Attock, Rawalpindi & Chakwal Quarries)
  - Sand & Silica Sand (Mianwali, D.G. Khan & Khushab)
- **Cause List Day Sheet Generator**:
  - One-click generation of the statutory **Daily Cause List** formatted for the Director's bench with print stylesheet.

### 2. Schedule Personal Hearing & Issue Notice
- **Searchable Lease Selector**:
  - Search across all 1,836 Small Scale Mining concessions by ID, company name, mineral, or district.
  - Automatically fetches and locks official concession attributes (Lease ID, Title, Mineral, Company Name, Proprietor, Location, Acreage, and Status).
- **Statutory Notice Docket Generator**:
  - Auto-generated dispatch numbering (e.g., `DGM&M/SMA/H-104/2026`).
  - Pre-filled statutory violation templates (Royalty default, boundary encroachment, Form-C return failure, illegal subletting, mine safety violations).
  - Generates a **certified, printable Show-Cause Summons Docket** on official Government of the Punjab letterhead.

### 3. Post-Hearing Ledger & Decisions
- Searchable repository with multi-parameter filtering by date range, order status (*Issued* vs *Pending*), violation category, and district.
- **"Record / Issue Order" Drawer**:
  - Official order dispatch numbering & date.
  - Determination categories: *Penalty Imposed*, *Direction Issued*, *Lease Revoked/Cancelled*, *Exonerated/Compliance Accepted*, *Adjourned to New Date*.
  - Financial penalty calculations in PKR with treasury deposit timelines.
- **Official Certified Order Document**:
  - Formal Government of the Punjab Directorate General letterhead.
  - Certified seal, digital signature block of Director SMA/T, operative judgment, and distribution list.

### 4. SMA Leases Master Directory
- Complete registry of Small Mines Agreement concessions across the Punjab.
- Visual **Active Hearing Indicator** pulsing badge for leases currently subject to statutory notice.
- Expandable case history dossier detailing all past show-cause notices, hearing transcripts, and judicial rulings.
- Onboarding modal for registering new lease concessions.

### 5. Compliance Analytics & Data Security
- Breakdown of statutory violation patterns and district distribution.
- Disposal efficiency rate tracking.
- LocalStorage state persistence + cloud synchronization.
- Complete JSON export and restoration utilities.

---

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (Executive slate, navy, emerald, and gold palette)
- **Icons:** Lucide React
- **Deployment:** GitHub Pages

---

## Local Development & Setup

```bash
# Clone the repository
git clone https://github.com/isyedhammad/sma-portal.git
cd sma-portal

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Statutory Authority
**Directorate General of Mines & Minerals**  
Poonch House, Multan Road, Lahore, Punjab, Pakistan  
*Regulated under the Punjab Mining Concession Rules 2002 & Punjab Minerals Act*
