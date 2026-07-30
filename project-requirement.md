# MERN Stack Project Requirement

## Hotel Booking Management System

### Project Objective

Develop a full-stack **Hotel Booking Management System** using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. The application should allow administrators to manage hotels and bookings, while users can browse hotels and make reservations.

---

# Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Token)
* **Image Upload:** Multer

---

# User Roles

## 1. Admin

* Login to the admin dashboard.
* Add new hotels.
* Update hotel details.
* Delete hotels.
* View all registered users.
* View all bookings.
* Update booking status.
* View dashboard statistics.

## 2. User

* Register an account.
* Login securely.
* Browse all available hotels.
* View hotel details.
* Search and filter hotels.
* Book a hotel.
* View booking history.
* Cancel bookings (before check-in if applicable).
* Update profile information.

---

# Authentication Module

### User

* Register
* Login
* Logout
* JWT Authentication
* Protected Routes

### Admin

* Secure Admin Login
* Protected Admin Dashboard

---

# Hotel Management Module (Admin)

Admin should be able to:

* Add Hotel
* Edit Hotel
* Delete Hotel
* View All Hotels

### Hotel Information

Each hotel should contain:

* Hotel Name
* Description
* Location
* Address
* City
* State
* Country
* Price Per Night
* Number of Rooms
* Available Rooms
* Amenities
* Hotel Images
* Rating (Optional)

---

# Hotel Listing Module (User)

Users should be able to:

* View all hotels
* Search by hotel name
* Filter by:

  * City
  * Price Range
  * Rating
* Sort by:

  * Price
  * Rating
* View detailed hotel information

---

# Booking Module

Users should be able to:

* Select Check-in Date
* Select Check-out Date
* Choose Number of Guests
* Select Number of Rooms
* Book Hotel
* View Booking Confirmation

Booking information should include:

* User
* Hotel
* Booking Date
* Check-in Date
* Check-out Date
* Total Nights
* Number of Rooms
* Number of Guests
* Total Price
* Booking Status

---

# Booking Status

The system should support the following statuses:  

* Pending
* Confirmed
* Cancelled
* Completed

---

# Admin Booking Management

Admin should be able to:

* View all bookings
* Search bookings
* Filter bookings by status
* Update booking status
* View booking details
* Delete bookings if necessary

---

# User Booking History

Users should be able to:

* View current bookings
* View previous bookings
* Cancel bookings
* View booking status

---

# Dashboard (Admin)

Display the following statistics:

* Total Hotels
* Total Users
* Total Bookings
* Active Bookings
* Cancelled Bookings
* Revenue (Optional)

---

# Database Collections

## Users

* Name
* Email
* Password
* Phone Number
* Role

## Hotels

* Hotel Information
* Images
* Amenities
* Price
* Available Rooms

## Bookings

* User ID
* Hotel ID
* Booking Details
* Status
* Payment Status (Optional)

---

# Validation Requirements

* Required field validation    
* Duplicate email prevention
* Password hashing using bcrypt
* JWT authentication
* Authorization for protected routes
* Proper error handling

---

# Optional Features (Bonus)

* Hotel image gallery
* Wishlist/Favorites
* Online payment integration (Stripe/Razorpay)
* Email confirmation after booking
* Hotel reviews and ratings
* Pagination
* Responsive design
* Dark mode
* Booking invoice generation (PDF)

---

# Expected API Modules

* Authentication APIs
* User APIs
* Hotel APIs
* Booking APIs
* Admin APIs

---

# Deliverables

The final submission should include:

1. Complete MERN application.
2. Well-structured folder architecture.
3. Responsive user interface.
4. RESTful APIs with proper validation.
5. MongoDB database design.
6. README file with setup instructions.
7. Clean and maintainable code following best practices.
8. GitHub repository with regular commits.

---