// backend/scripts/migrate-add-user-to-tasks.js
// Usage:
//   NODE_ENV=production node backend/scripts/migrate-add-user-to-tasks.js --userEmail you@example.com [--dry]
//   or
//   node backend/scripts/migrate-add-user-to-tasks.js --userId 6655abc... [--dry]

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import minimist from "minimist";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";

const args = minimist(process.argv.slice(2));

async function main() {
  await connectDB();

  const dry = Boolean(args.dry);
  const userIdArg = args.userId || args.userID;
  const userEmailArg = args.userEmail || args.email;

  let userId = userIdArg;
  if (!userId && userEmailArg) {
    const user = await User.findOne({ email: String(userEmailArg).toLowerCase().trim() });
    if (!user) {
      console.error(`User with email ${userEmailArg} not found.`);
      process.exit(1);
    }
    userId = user._id.toString();
  }

  if (!userId) {
    console.error("Provide --userId or --userEmail to assign tasks to.");
    process.exit(1);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid userId provided.");
    process.exit(1);
  }

  const filter = { $or: [{ user: { $exists: false } }, { user: null }] };

  const count = await Task.countDocuments(filter);
  console.log(`Found ${count} tasks missing user.`);

  if (count === 0) {
    console.log("Nothing to migrate.");
    process.exit(0);
  }

  if (dry) {
    console.log("--dry run only. No changes applied.");
    process.exit(0);
  }

  const res = await Task.updateMany(filter, { $set: { user: userId } });
  console.log("Migration result:", res);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

