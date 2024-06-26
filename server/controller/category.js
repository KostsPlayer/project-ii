import express from "express";
import configureMiddleware from "../config/middleware.js";
import supabase from "../config/supabase.js";
import { verifyToken } from "../config/verifyToken.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("id");

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/get-category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { data, error } = await supabase
      .from("category")
      .select("*")
      .eq("id", categoryId);

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.post("/insert-category", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    const { data, error } = await supabase
      .from("category")
      .insert({ name: name })
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Insert category successfully!" });
  } catch (error) {
    return res.json(error);
  }
});

router.put("/update-category/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    const { data, error } = await supabase
      .from("category")
      .update({ name: name })
      .eq("id", categoryId)
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Update category successfully!" });
  } catch (error) {
    return res.json(error);
  }
});

router.delete("/delete-category/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { data, error } = await supabase
      .from("category")
      .delete()
      .eq("id", categoryId)
      .order("id");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Delete category successfully" });
  } catch (error) {
    return res.json(error);
  }
});

export default router;
