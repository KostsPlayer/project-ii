import express from "express";
import configureMiddleware from "../config/middleware.js";
import supabase from "../config/supabase.js";
import multer from "multer";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.get("/get-category", async (req, res) => {
  try {
    const { data, error } = await supabase.from("category").select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/product", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("product")
      .select(`*, category(*)`);

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.get("/product-seller/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const { data, error } = await supabase
      .from("product")
      .select(`*, category(*)`)
      .eq("user_email", email);

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

router.get("/get-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const { data, error } = await supabase
      .from("product")
      .select(`*, category(*)`)
      .eq("id", productId);

    if (error) {
      return res.json(error.message);
    }

    return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

const pathStorage = supabase.storage.from("Images").getPublicUrl();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { data, error } = await supabase.storage
      .from("Images")
      .upload(pathStorage, file);

    if (error) {
      cb(error.message);
      cb(error.name);
      cb(error.stack);
    }

    cb(null, data.path);
  },
});
const upload = multer({ storage });

router.post(
  "/insert-product/:email",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;
      const image = req.file;

      const { data, error } = await supabase
        .from("product")
        .insert({
          user_email: email,
          name: name,
          description: description,
          price: price,
          stock: stock,
          category_id: category,
          images: image,
        })
        .select("*");

      if (error) {
        res.json(error.message);
        res.json(error.code);
        res.json(error.details);
        res.json(error.hint);
      }

      return res.json({ data: data, message: "Insert product successfully!" });
    } catch (error) {
      return res.json(error);
    }
  }
);

router.put("/update-product/:id", upload.single("image"), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock, category } = req.body;
    const image = req.file.filename;

    const { data, error } = await supabase
      .from("product")
      .update({
        name: name,
        description: description,
        price: price,
        stock: stock,
        category_id: category,
        images: image,
      })
      .eq("id", productId)
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Update product successfully!" });
  } catch (error) {
    return res.json(error);
  }
});

router.put("/delete-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const { data, error } = await supabase
      .from("product")
      .delete()
      .eq("id", productId);

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Delete product successfully!" });
  } catch (error) {
    return res.json(error);
  }
});

export default router;
