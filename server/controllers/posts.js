import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPostMessage = new PostMessage(post);
  try {
    await newPostMessage.save();
    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).send("No post with that ID.");
  }
  const modifiedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );
  res.json(modifiedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send("No post with that ID.");
  }
  await PostMessage.findByIdAndRemove(id);
  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send("No post with that ID.");
  }
  const post = await PostMessage.findById(id);
  let count = Number(post.likeCount) + 1;

  const modifiedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: count },
    { new: true }
  );
  res.json(modifiedPost);
};
