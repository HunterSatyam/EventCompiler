import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/api/v1/user/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (!user) {
                        user = await User.create({
                            fullname: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            role: "student", // Default role
                            profile: {
                                profilePhoto: profile.photos[0].value,
                            },
                        });
                    } else if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.log("Google Strategy not initialized: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/api/v1/user/auth/github/callback",
                scope: ["user:email"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) {
                        // If email is private, we might need to fetch it separately, but let's assume it's available for now
                        // or use a dummy email if absolutely necessary (not recommended)
                        return done(new Error("No email found in GitHub profile"), null);
                    }

                    let user = await User.findOne({ email });

                    if (!user) {
                        user = await User.create({
                            fullname: profile.displayName || profile.username,
                            email: email,
                            githubId: profile.id,
                            role: "student", // Default role
                            profile: {
                                profilePhoto: profile.photos?.[0]?.value || "",
                            },
                        });
                    } else if (!user.githubId) {
                        user.githubId = profile.id;
                        await user.save();
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.log("GitHub Strategy not initialized: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET");
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
        "linkedin",
        new LinkedInStrategy(
            {
                clientID: process.env.LINKEDIN_CLIENT_ID,
                clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/api/v1/user/auth/linkedin/callback",
                scope: ["r_emailaddress", "r_liteprofile"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    let user = await User.findOne({ email });

                    if (!user) {
                        user = await User.create({
                            fullname: profile.displayName,
                            email: email,
                            linkedinId: profile.id,
                            role: "student", // Default role
                            profile: {
                                profilePhoto: profile.photos?.[0]?.value || "",
                            },
                        });
                    } else if (!user.linkedinId) {
                        user.linkedinId = profile.id;
                        await user.save();
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.log("LinkedIn Strategy not initialized: Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET");
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
