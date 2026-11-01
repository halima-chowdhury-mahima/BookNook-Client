# 📚 BookNook – A Small Online Library

BookNook is a modern online library platform where users can explore books, add their own books, borrow available books, and manage their borrowed collection. It provides a simple and user-friendly experience for book lovers.

🌐 **Live Website:** `YOUR_VERCEL_LIVE_URL`

## ✨ Features

- **User Authentication:** Secure registration and login using Better Auth, including social login.
- **Explore Books:** Browse books with search, category filters, and sorting options.
- **Book Details:** View detailed information about each book.
- **Add Books:** Logged-in users can add books with images, descriptions, and copy information.
- **Manage My Books:** Edit and delete books added by the logged-in user.
- **Borrow Books:** Borrow available books and prevent duplicate active borrowing.
- **Return Books:** Return borrowed books and automatically update available copies.
- **My Borrows:** View personal borrowing history.
- **Profile Management:** Manage account information and upload a custom profile picture.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Notifications:** Toast messages for success and error feedback.
- **Dynamic Homepage:** Includes a Swiper hero slider, latest book arrivals, and additional library sections.

## 🛠️ Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- shadcn/ui
- Swiper.js
- Lucide React
- React Hot Toast

### Authentication
- Better Auth
- MongoDB Adapter
- Google OAuth
- JWT

### Image Management
- Cloudinary for profile pictures
- Book image upload integration

### Backend Integration
- Express.js REST API
- MongoDB Database

## 📂 Project Structure

```text
booknook-client/
├── app/
│   ├── add-book/
│   ├── all-books/
│   ├── api/
│   │   └── auth/
│   ├── books/
│   │   └── [id]/
│   ├── components/
│   │   ├── home/
│   │   ├── BookCard.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── google-books/
│   ├── lib/
│   ├── login/
│   ├── my-books/
│   ├── my-borrows/
│   ├── profile/
│   ├── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd BookNook-Client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
```

Only configure the providers you actually use. Never commit your environment file or expose credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Backend API

The client communicates with the BookNook Express backend.

Default development API URL:

```text
http://localhost:5000
```

See the BookNook Server repository for API documentation.

## 🚀 Deployment

The frontend is designed to be deployed on Vercel.

1. Push the client code to GitHub.
2. Import the repository into Vercel.
3. Configure the production environment variables.
4. Deploy the application.

## 👩‍💻 Developer

**Halima Chowdhury Mahima**

- GitHub: https://github.com/halima-chowdhury-mahima
- LinkedIn: https://linkedin.com/in/halima-chowdhury-mahima/

## 📄 License

This project was developed for educational and learning purposes.