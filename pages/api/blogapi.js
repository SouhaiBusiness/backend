import { mongooseconnect } from '@/lib/mongoose';
import { Blog } from '@/models/blog';

export default async function handle(req, res) {
  // if authenticated connect to mongodb
  await mongooseconnect();

  const { method } = req;

  // data send or post data
  if (method === 'POST') {
    const { title, slug, description, blogcategory, tags, status } = req.body;

    

    const blogDoc = await Blog.create({
      title,
      slug,
      description,
      blogcategory,
      tags,
      status,
    });

    res.json(blogDoc);
  }

  // data fetch or get
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Blog.findById(req.query.id));
    } else {
      res.json((await Blog.find()).reverse());
    }
  }

  // Update

  if (method === 'PUT') {
    const { _id, title, slug, description, blogcategory, tags, status } =
      req.body;

    await Blog.updateOne(
      { _id },
      {
        title,
        slug,
        description,
        blogcategory,
        tags,
        status,
      }
    );

    res.json(true);
  }

  // Delete

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Blog.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
