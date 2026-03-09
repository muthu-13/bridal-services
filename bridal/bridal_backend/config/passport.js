import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";
import dotenv from "dotenv";

dotenv.config(); // Load .env

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      // Check if user exists
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return done(err);

        if (result.length > 0) return done(null, result[0]); // existing user

        // If new user, insert
        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, null],
          (err2, res2) => {
            if (err2) return done(err2);
            return done(null, { id: res2.insertId, name, email });
          }
        );
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return done(err);
    done(null, result[0]);
  });
});

export default passport;
