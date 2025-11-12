import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesPath = path.join(__dirname, "categories.json");
const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));

dotenv.config({ path: path.join(__dirname, "../.env") });

const map = new Map();

async function main() {
  if (!process.env.MONGODB_CONNECTIONSTRING) {
    console.error("Missing MONGODB_CONNECTIONSTRING");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

  try {
    await Category.deleteMany({});

    // insert all categories without parent first to get IDs
    for (const item of categories) {
      const doc = await Category.create({
        name: item.name,
        slug: item.slug,
        description: item.description || "",
        parent: null,
      });
      map.set(item.name, doc._id);
    }

    // update parent refs for those with parentName
    for (const item of categories) {
      if (item.parentName) {
        await Category.updateOne(
          { slug: item.slug },
          { parent: map.get(item.parentName) || null }
        );
      }
    }

    console.log("Seeded categories successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
