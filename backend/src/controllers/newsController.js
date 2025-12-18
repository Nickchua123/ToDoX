import News from "../models/News.js";

export const listNews = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), "i");
      query.$or = [{ title: rx }, { summary: rx }, { content: rx }];
    }
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;
    const [items, total] = await Promise.all([
      News.find(query).sort({ publishedAt: -1 }).skip(skip).limit(perPage),
      News.countDocuments(query),
    ]);
    res.json({ total, page: Number(page) || 1, items });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không lấy được tin tức", error: err.message });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(news);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không lấy được bài viết", error: err.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, summary, content, image, publishedAt, author } =
      req.body || {};
    if (!title) return res.status(400).json({ message: "Thiếu tiêu đề" });
    const doc = await News.create({
      title,
      summary,
      content,
      image,
      publishedAt,
      author,
    });
    res.status(201).json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không tạo được bài viết", error: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const doc = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không cập nhật được bài viết", error: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const doc = await News.findByIdAndDelete(req.params.id);
    if (!doc)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json({ message: "Đã xóa bài viết" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không xóa được bài viết", error: err.message });
  }
};
