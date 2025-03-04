import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BsPostcard } from 'react-icons/bs';
import Loading from '@/components/Loading';
import { useState, useEffect } from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import Dataloading from '@/components/Dataloading';

export default function Blogs() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from custom hook
  const { alldata, loading } = useFetchData('/api/blogapi');

  // Filter published blogs
  const publishedBlogs = Array.isArray(alldata) 
    ? alldata.filter((blog) => blog?.status === 'publish') 
    : [];

  // Filtered blogs based on search query
  const filteredBlogs = searchQuery.trim() === '' 
    ? publishedBlogs 
    : publishedBlogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalBlogs = filteredBlogs.length;

  // Pagination calculations
  const indexOfLastBlog = currentPage * perPage;
  const indexOfFirstBlog = indexOfLastBlog - perPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Total pages calculation
  const totalPages = Math.ceil(totalBlogs / perPage);

  // Pagination handler
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div data-aos="fade-right">
            <h2>All Published <span>Blogs</span></h2>
            <h3>Admin Panel</h3>
          </div>
          <div className="breadcrumb" data-aos="fade-left">
            <BsPostcard /> <span>/</span> <span>Blogs</span>
          </div>
        </div>

        <div className="blogstable">
          {/* Search input */}
          <div className="flex gap-2 mb-1" data-aos="fade-up">
            <h2>Search Blogs:</h2>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search by title"
            />
          </div>

          {/* Table */}
          <table className="table tablestyling" data-aos="fade-up">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Edit / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <Dataloading />
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    No Blogs Found
                  </td>
                </tr>
              ) : (
                currentBlogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td>{indexOfFirstBlog + index + 1}</td>
                    <td><h3>{blog.title}</h3></td>
                    <td><pre>{blog.slug}</pre></td>
                    <td>
                      <div className="flex gap-2 flex-center">
                        <Link href={`/blogs/edit/${blog._id}`}>
                          <button title="edit">
                            <FaEdit />
                          </button>
                        </Link>
                        <Link href={`/blogs/delete/${blog._id}`}>
                          <button title="delete">
                            <RiDeleteBin6Fill />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="blogpagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages))
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
