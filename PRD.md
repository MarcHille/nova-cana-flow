
# Product Requirements Document (PRD) for NovaCana Medical Cannabis Platform

## 1. Product Overview

NovaCana is a specialized B2B platform connecting pharmacies with medical cannabis suppliers. The platform serves as a centralized marketplace where verified pharmacies can browse, order, and manage medical cannabis products for their patients. The platform includes pharmacy verification, product management, order processing, and formulation guidance for medical cannabis products.

## 2. Target Users

- **Pharmacists**: Licensed pharmacy professionals seeking to order medical cannabis products
- **Administrators**: Platform managers who oversee product catalog, user verification, and operations
- **Medical Professionals**: Doctors who might access scientific information (future expansion)

## 3. Current Functionality

### 3.1 User Authentication & Authorization
- Registration system with pharmacy license verification
- Role-based access control (admin, pharmacist, user)
- Secure login and session management
- Multi-step verification process for pharmacies

### 3.2 Product Catalog
- Product listing with detailed information
- Product search and filtering
- Detailed product information (THC/CBD content, terpenes, etc.)
- Bilingual interface (German/English)

### 3.3 Order Management
- Shopping cart functionality
- Order placement with shipping/billing information
- Order history and tracking
- Payment method selection (currently invoice-based)

### 3.4 Admin Functions
- User management (creation, verification, role assignment)
- Product management (CRUD operations)
- Order oversight
- Pharmacy verification approval workflow

### 3.5 Formulation Guidance
- Instructional content for cannabis product formulation
- Formulation calculator tools

## 4. Current Technical Architecture

### 4.1 Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS and shadcn/ui for UI components
- Context API for state management
- React Query for data fetching

### 4.2 Backend
- Supabase for authentication, database, and storage
- Edge functions for secure operations
- Row-level security for data protection

### 4.3 Database Schema
- **User roles**: Manages user permissions
- **Products**: Stores product catalog information
- **Orders**: Tracks order information and status
- **Pharmacy verification**: Manages verification workflow

## 5. Key Improvements Needed

### 5.1 User Experience
- Streamline pharmacy verification process
- Improve product browsing with advanced filtering
- Create stronger product detail pages with recommendations
- Add order status tracking notifications

### 5.2 Technical Enhancements
- Optimize authentication and role verification
- Improve error handling across the application
- Implement comprehensive analytics and reporting
- Enhance security practices

### 5.3 Business Features
- Implement subscription options for regular orders
- Develop loyalty program for pharmacies
- Add customer support system
- Create educational resources for medical practitioners

## 6. Multilingual Support
- Full German/English language support across all interfaces
- Consider adding additional European languages in future phases

## 7. Integration Requirements
- Payment gateway integration
- Shipping provider integration
- ERP/inventory management integration for pharmacies
- Medical research database connections

## 8. Compliance Requirements
- GDPR compliance for user data protection
- Medical cannabis regulations compliance
- Pharmacy standards compliance
- Secure handling of sensitive medical information

## 9. Success Metrics
- Number of verified pharmacies
- Order volume and frequency
- Product catalog growth
- User engagement metrics
- Support request volume and resolution time
- Platform uptime and performance metrics
