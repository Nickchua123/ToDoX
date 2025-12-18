import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

export const getAdminSummary = async (req, res) => {
  try {
    const now = new Date();
    const since = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueAgg,
      statusAgg,
      recentOrders,
      trendAgg,
      pendingReviews,
      lowStockProducts,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("total status createdAt")
        .populate("user", "name email"),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: since } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Review.countDocuments({ approved: false }),
      Product.countDocuments({ stock: { $lte: 10 } }),
      Order.countDocuments({ status: { $in: ["pending", "processing"] } }),
    ]);

    const totalRevenue = revenueAgg?.[0]?.totalRevenue || 0;
    const statusCounts = statusAgg.reduce((acc, item) => {
      acc[item._id || "unknown"] = item.count;
      return acc;
    }, {});

    const trendMap = new Map(trendAgg.map((item) => [item._id, item]));
    const trendLabels = [];
    const trendRevenue = [];
    const trendOrders = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().slice(0, 10);
      const day = trendMap.get(key);
      trendLabels.push(key);
      trendRevenue.push(day?.revenue || 0);
      trendOrders.push(day?.orders || 0);
    }

    res.json({
      totals: {
        users: totalUsers,
        products: totalProducts,
        orders: totalOrders,
        revenue: totalRevenue,
      },
      statusCounts,
      recentOrders,
      trends: {
        labels: trendLabels,
        revenue: trendRevenue,
        orders: trendOrders,
      },
      tasks: {
        pendingOrders,
        pendingReviews,
        lowStockProducts,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Không lấy được dữ liệu tổng quan",
        error: err.message,
      });
  }
};
