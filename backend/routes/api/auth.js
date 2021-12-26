/* eslint-disable import/extensions */
import { Router } from "express";
import passport from "passport";

import { createToken } from "../../utils/index.js";

const router = Router();

export default (app) => {
  app.use("/auth", router);

  // Google OAuth2
  router.get(
    "/google",
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
    }),
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureMessage: "로그인 실패",
    }),
    async (req, res) => {
      const user = await createToken(req.user);
      res.cookie("user", JSON.stringify(user));
      res.redirect("/?redirected=true");
    },
  );

  // logout
  router.get("/logout", (req, res) => {
    // req.logout();
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};
