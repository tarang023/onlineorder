# **🍔 Restaurant Online Ordering System**

A full-stack web application built with Next.js that provides a modern, seamless online ordering experience for a restaurant. It features a complete user authentication system, persistent shopping cart, and a full order management workflow.

 

## **About The Project**

This project is a comprehensive online food ordering platform designed for a modern restaurant. It allows customers to browse a dynamic menu, add items to a persistent cart that is linked to their user account, and place orders securely. The application was built using the Next.js App Router, providing a fast, server-rendered experience. It features a complete RESTful API backend for managing users, carts, and orders, with a MongoDB database as the data source.

## **Key Features**

* **Secure User Authentication**: Full email/password sign-up and login flow, with support for social logins (Google, Facebook) via NextAuth.js.  
* **JWT Session Management**: Uses JSON Web Tokens stored in secure, HttpOnly cookies for managing user sessions.  
* **Dynamic Menu**: A browsable menu page with real-time search and filtering capabilities.  
* **Persistent Shopping Cart**: A global state-managed cart (using React Context) that is saved to the user's account in the database, allowing their cart to persist between sessions.  
* **Order Management**: A complete checkout process that saves the final order to the database and provides an order history page for users.  
* **Kitchen Display System**: A dedicated view for kitchen staff to see incoming orders in real-time.  
* **RESTful API**: A well-structured backend API built with Next.js API Routes to handle all application logic.
### **Frontend**
* Next.js – Modern React framework for SEO-optimized and fast-loading UI.
* Tailwind CSS – Sleek and responsive UI design.
### **Backend**
* Next.js – Robust backend handling APIs and business logic.
* MongoDB & Mongoose – NoSQL database for scalable data management.
* JSON Web Tokens (JWT) & jose – Secure authentication & authorization.
 

### **Database**
* MongoDb



## **Getting Started**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

You need to have Node.js and npm installed on your machine.

* npm  
  npm install npm@latest \-g

### **Installation**

1. Clone the repo  
   git clone \[https://github.com/tarang023/onlineorder.git\] 
2. Install NPM packages  
   npm install

3. Create a .env.local file in the root of your project and add the following environment variables:  
   MONGO\_URL="your\_mongodb\_connection\_string"  
   TOKEN\_SECRET="your\_super\_secret\_jwt\_string"

   \# For NextAuth.js Google/Facebook login  
   GOOGLE\_CLIENT\_ID="your\_google\_client\_id"  
   GOOGLE\_CLIENT\_SECRET="your\_google\_client\_secret"  
   FACEBOOK\_CLIENT\_ID="your\_facebook\_client\_id"  
   FACEBOOK\_CLIENT\_SECRET="your\_facebook\_client\_secret"  
   NEXTAUTH\_SECRET="a\_random\_string\_for\_nextauth"

4. Run the development server  
   npm run dev

   The application will be available at http://localhost:3000.

## **API Endpoints**

The application uses a RESTful API structure for its backend operations:

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/users/signup | Creates a new user. |
| POST | /api/users/login | Authenticates a user and returns a JWT. |
| GET | /api/cart | Fetches the current user's cart. |
| POST | /api/cart | Adds an item to the user's cart. |
| POST | /api/cart/update | Updates the quantity of an item in the cart. |
| POST | /api/orders/place | Creates a new order from the user's cart. |
| GET | /api/users/my-orders | Fetches the order history for the logged-in user. |

 