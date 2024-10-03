import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../../../shared/prisma"; // Adjust the path as needed
import config from "../../../config"; // Adjust the path as needed

passport.use(
  new GoogleStrategy(
    {
      clientID: config.socialLogin.googleClientId as string,
      clientSecret: config.socialLogin.googleClientSecret as string,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile); // Log the profile data

      //   // Upsert user
      //   const user = await prisma.user.upsert({
      //     where: { googleId: profile.id },
      //     update: {},
      //     create: {
      //       googleId: profile.id,
      //       email: profile.emails[0].value,
      //       phoneNumber: '', // Leave phoneNumber blank
      //       role: 'USER', // Default role
      //       password: null, // No password for OAuth users
      //     },
      //   });

      //   done(null, user);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: any, done) => {
  const foundUser = await prisma.user.findUnique({ where: { id: user.id } });
  done(null, foundUser);
});

// Create social routes
import express from "express";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
const router = express.Router();

// Initiate Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle the Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // JWT generation logic here
    const token = jwtHelpers.generateToken(
      req.user,
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string
    );
  res.redirect(`http://localhost:3001/login?token=${token}`);
  }
);

export const socialRoutes = router;
