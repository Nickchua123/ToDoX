import User from "../models/User.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const getConfig = () => {
  const delayDays = Number(process.env.ACCOUNT_DELETE_DELAY_DAYS) || 7;
  const intervalMinutes = Number(process.env.ACCOUNT_DELETE_JOB_INTERVAL_MINUTES) || 60;
  return { delayDays, intervalMinutes };
};

const deleteExpiredAccounts = async (delayDays) => {
  const cutoff = new Date(Date.now() - delayDays * DAY_MS);
  if (Number.isNaN(cutoff.getTime())) return 0;
  // Dùng collection.deleteMany để bỏ qua cast lỗi nếu có dữ liệu xấu
  const result = await User.collection.deleteMany({
    deleteRequestedAt: { $lte: cutoff },
  });
  return result?.deletedCount || 0;
};

export const startAccountDeletionJob = () => {
  const { delayDays, intervalMinutes } = getConfig();
  const run = async () => {
    try {
      const deleted = await deleteExpiredAccounts(delayDays);
      if (deleted) {
        console.log(`[account-deletion] Deleted ${deleted} account(s) requested >= ${delayDays} day(s) ago.`);
      }
    } catch (err) {
      console.error("[account-deletion] Job error", err);
    }
  };

  run(); // Kick off once at startup
  const handle = setInterval(run, intervalMinutes * 60 * 1000);
  console.log(`[account-deletion] Job scheduled every ${intervalMinutes}m; delay=${delayDays}d`);
  return handle;
};
