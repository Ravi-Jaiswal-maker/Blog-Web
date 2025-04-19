const Blog = require("../models/Blog");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");
const moment = require("moment");

// @desc create blogs (paginated)
exports.createBlog = async (req, res) => {
  try {
    let imageData = null;

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog",
      });

      imageData = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      slug: req.body.slug,
      createdBy: req.admin?.name || "Admin",
      image: imageData,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Blog create error:", error.message);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get all blogs (paginated)
exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  try {
    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// @desc    Get Single Blog by ID (Public)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog" });
  }
};

// @desc    Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.slug = slugify(blog.title, { lower: true });

    if (req.file) {
      try {
        if (blog.image?.public_id) {
          await cloudinary.uploader.destroy(blog.image.public_id);
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "blog",
        });

        blog.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      } catch (uploadError) {
        return res.status(500).json({ message: "Error uploading image" });
      }
    }
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating blog" });
  }
};

// @desc    Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image && blog.image.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Error deleting blog" });
  }
};

exports.getBlogStats = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .select("createdAt views status title")
      .sort({ createdAt: -1 });

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    const totalBlogs = blogs.length;
    const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = moment().subtract(i, "months").startOf("month");
      const monthEnd = moment().subtract(i, "months").endOf("month");

      const count = blogs.filter((blog) => {
        const createdAt = moment(blog.createdAt);
        return createdAt.isBetween(monthStart, monthEnd, undefined, "[]");
      }).length;

      months.push({
        month: monthStart.format("MMM YYYY"),
        count,
      });
    }

    const latestBlogs = blogs.slice(0, 5).map((blog) => ({
      _id: blog._id,
      title: blog.title,
      status: blog.status || "published",
      createdAt: moment(blog.createdAt).format("MMM DD, YYYY"),
    }));

    res.status(200).json({
      totalBlogs,
      totalViews,
      monthlyData: months,
      latestBlogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blog stats" });
  }
};

exports.incrementBlogView = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({ message: "View count updated", views: blog.views });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to increment view count" });
  }
};
