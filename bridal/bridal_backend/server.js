import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";    
import passport from "passport";
import "./config/passport.js";
import "./config/db.js";  
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";  
import paymentRoutes from "./routes/PaymentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import workshopRoutes from './routes/workshopRoutes.js';
import workshopRegistrationRoutes from "./routes/workshopRegistrationRoutes.js";
import wishlistRoutes from "./routes/wishlist.js";
import userDashboardRoutes from "./routes/userDashboard.js";
import workshopPaymentRoutes from './routes/workshopPaymentRoutes.js';
import staffRoutes from "./routes/staffRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userChatbotRoutes from "./routes/UserChatbotRoutes.js";
import adminChatbotRoutes from "./routes/AdminChatbotRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bridal-frontend-gray.vercel.app"
  ],
  credentials: true
}));


app.use(bodyParser.json());
app.use(
  session({
    secret: "secret123",   
    resave: false,
 saveUninitialized: false,
  cookie: { secure: false, sameSite: "lax" }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard/bookings", bookingRoutes);  
app.use("/api/payments", paymentRoutes); 
app.use("/api/contact", contactRoutes); 
app.use("/api/services", serviceRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api", workshopRoutes);
app.use("/api", workshopRegistrationRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", userDashboardRoutes);
app.use('/api/workshop-payments', workshopPaymentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api", reviewRoutes); 
app.use("/api/inventory", inventoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/userChatbot", userChatbotRoutes);
app.use("/api/adminChatbot", adminChatbotRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});