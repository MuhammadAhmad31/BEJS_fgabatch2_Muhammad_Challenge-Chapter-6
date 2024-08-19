import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GA_CLIENT_ID, GA_CLIENT_SECRET } from "./env.js";
import { findOrCreateUser } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: GA_CLIENT_ID,
      clientSecret: GA_CLIENT_SECRET,
      callbackURL: "/api/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
