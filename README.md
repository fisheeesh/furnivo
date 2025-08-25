# 🛋️ Furnivo

![User Interface](./frontend//public/preview.png)

## 📚 Table of Contents

- [About](#-about)
- [Challenges](#️-challenges)
- [Lessons Learned](#-lessons-learned)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [Usage](#️-usage)
  - [Install Dependencies](#-install-dependencies)
  - [Environment Variables](#-environment-variables)
  - [PostgreSQL With Prisma](#postgresql-with-prisma)
  - [Run](#️-run)
- [License](#️-license)

## 🚀 About

A full-stack modern furniture marketplace built with **React.js + React Router**, TypeScript, Zustand and shadcn/ui on the frontend, and Node.js, Express.js, Prisma, and PostgreSQL on the backend. It features JWT authentication, file uploads with Multer, and background job processing using BullMQ with Redis.

## ⚔️ Challenges

Since Furnivo was my very first attempt at building a full-stack application with a custom REST API backend (I usually worked with serverless or Next.js custom servers), there were plenty of new obstacles. The biggest challenge was securing the app, which involved validating requests layer by layer, handling CORS protection, and ensuring robust authentication. Setting up a clean backend structure with Express.js from scratch, including middleware handling and database integration using Prisma with MySQL, PostgreSQL, and SQLite, tested my patience but gave me valuable experience.

Implementing authentication securely with JWT tokens flows such as registration, OTP verification, password reset, and token rotation was particularly difficult at first, especially figuring out rotating tokens securely between the frontend and backend. Designing and managing job queues with BullMQ and Redis for performance optimizations like image processing and cache invalidation also required deep exploration.

On the frontend, learning global state management with Zustand (including persist and immer middleware) was smooth but still came with challenges when integrating API states. The toughest part was mastering React Router’s new data APIs (loaders, actions) alongside TanStack Query for API integration, caching, and infinite scrolling. Combining React Router with NProgress for route transitions also brought some tricky edge cases.

## 🧠 Lessons Learned

I could spend all day describing the lessons that I learned while working on this project, but the most important ones involved my newfound understanding of backend fundamentals and production-ready REST API design. I gained hands-on experience with building and structuring an Express.js backend, handling middleware, integrating Prisma ORM with multiple databases, and implementing secure authentication with token rotation. Learning how to offload heavy tasks to background workers using BullMQ and Redis was a game-changer for performance and scalability.

On the frontend, I strengthened my skills with React Router’s loaders and actions, API integration with TanStack Query, and managing global state effectively with Zustand. I also learned how to use React Router’s `Form`, `useFetcher` for actions, and `useNavigation` for handling loading states. I learned how to keep data alive across routes with the help of zustand, developed solid concepts like infinite scrolling, query caching, protected routes, and request interceptors with Axios. Beyond the technical aspects, I learned how crucial it is to balance code organization, performance, and security while still maintaining a smooth user experience. This project helped me grow into a more confident full-stack developer, with a clearer understanding of both frontend and backend problem-solving.

## 🛠️ Tech Stack  

### 🔹 Frontend  
- **Framework:** React 19, Vite, TypeScript  
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS), Lucide Icons, React Icons  
- **Styling:** Tailwind CSS, Tailwind Merge, Next Themes (dark/light mode)  
- **State Management:** Zustand (with persist & immer middleware)  
- **Forms & Validation:** React Hook Form, Zod, @hookform/resolvers  
- **Data Fetching & Caching:** TanStack React Query + Devtools, Axios (with interceptors)  
- **Routing:** React Router 7  
- **UX Enhancements:** NProgress (route transitions), Embla Carousel, Sonner (notifications)  
- **Security:** DOMPurify (XSS protection), Input OTP  
- **Utilities:** clsx, class-variance-authority, usehooks  

### 🔹 Backend  
- **Runtime & Framework:** Node.js, Express.js, TypeScript  
- **Database & ORM:** PostgreSQL / MySQL / SQLite with Prisma ORM  
- **Authentication & Security:** JWT tokens, bcrypt, cookie-parser, express-rate-limit, helmet, cors, express-validator  
- **Background Jobs & Caching:** BullMQ, Redis, ioredis  
- **File Handling:** Multer (uploads), Sharp (image optimization)  
- **Localization:** i18next, i18next-fs-backend, i18next-http-middleware  
- **Logging & Monitoring:** Morgan, Compression  
- **Testing:** Jest, Supertest, ts-jest  
- **Scheduling:** node-cron  
- **Other Utilities:** dotenv, moment, sanitize-html, crypto  

## ✨ Features  

- 🔐 **Secure Authentication**  
Role-based access control (RBAC) with JWT tokens, OTP verification, and token rotation.  

- 🛡️ **Protected Routes**  
  Layered validation to ensure only authorized users access restricted areas.  

- 🛒 **Shopping Cart**  
  Add, update, and remove products with persistent state across routes.  

- 💳 **Interactive Checkout**  
  Smooth checkout flow with order validation and secure processing.  

- 🏷️ **Filtering & Sorting**  
  Browse products with advanced filters and sorting options.  

- ⭐ **Featured Products Carousel**  
  Highlighted products displayed in an interactive carousel.  

- 👤 **User Profile Management**  
  Update personal details, manage orders, and view purchase history.  

- 📊 **Admin Dashboard**  
  Manage orders, products, and users with charts and stats powered by **Recharts**.  

- 📁 **File Uploads**  
  Support for single and multiple file uploads, optimized with Sharp.  

- 🔍 **Search System**  
  Fast product search with pagination support.  

- 🌟 **Ratings & Reviews**  
  Users can leave reviews and rate products.  

- 🌗 **Dark/Light Mode**  
  Switch between light and dark themes for better accessibility.  

- 🧩 **Modular Code Structure**  
  Well-organized backend and frontend architecture for scalability.  

- 🚀 **High Performance**  
  Queue job workers with BullMQ + Redis for background tasks and optimizations.  

- 🎨 **Elegant UI**  
  Built with **shadcn/ui** and **TailwindCSS** for a modern, responsive design.  

- Much more...

## ⚙️ Usage

### 📦 Install Dependencies

```bash
npm install
```

Note: Some dependencies may have not yet been upadated to support React 19. If you get any errors about depencency compatability, run the following:

```bash
npm install --legacy-peer-deps
```
### 🧬 Environment Variables

```bash
ACCESS_TOKEN_SECRET="your-secret"
REFRESH_TOKEN_SECRET="your-secret"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="your-password"
DATABASE_URL="postgresql://postgres:admin@localhost:5432/your-db-name?schema=public"
```

Access token secret, refresh token secret and redis password can be set as you wish.

#### PostgreSQL With Prisma

Invoke the Prisma CLI:
```bash
npx prisma
```
Set up your Prisma ORM project by creating your Prisma Schema file with the following command:
```
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```
This command does a few things:

- Creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma Schema with your database connection variable and schema models.
- Sets the datasource to PostgreSQL and the output to a custom location, respectively.
- Creates the `.env` file in the root directory of the project, which is used for defining environment variables (such as your database connection)
**Note** that the default schema created by prisma init uses PostgreSQL as the provider. If you didn't specify a provider with the datasource-provider option, you need to edit the datasource block to use the postgresql provider instead:

```bash
#prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

In this case, the url is set via an environment variable which is defined in `.env`:
```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

### 🖥️ Run

```bash

# front end
cd frontend
npm run dev

# back end
cd backend
npm run dev

#prisma studio
cd backend
npx prisma studio
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).