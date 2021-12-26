/* eslint-disable import/extensions */
import mongoose from "mongoose";
import PostSchema from "./schemas/Post.js";
import UserSchema from "./schemas/User.js";
import LocationSchema from "./schemas/Location.js";
import BookmarkSchema from "./schemas/Bookmark.js";
import CommentSchema from "./schemas/Comment.js";

export const Post = mongoose.model("Post", PostSchema);
export const Location = mongoose.model("Location", LocationSchema);
export const User = mongoose.model("User", UserSchema);
export const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
export const Comment = mongoose.model("Comment", CommentSchema);
