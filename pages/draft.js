"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsPostcard } from "react-icons/bs";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import useFetchData from "@/hooks/useFetchData";
import Dataloading from "@/components/Dataloading";

export default function Draft() {
   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const [perPage] = useState(2);
   const [searchQuery, setSearchQuery] = useState('');
 
   // Fetch data from custom hook
   const { alldata, loading } = useFetchData('/api/blogapi');
 
   // Filter draft blogs
   const draftBlogs = Array.isArray(alldata) 
     ? alldata.filter((blog) => blog?.status === 'draft') 
     : [];
 
   // Filtered blogs based on search query
   const filteredBlogs = searchQuery.trim() === '' 
     ? draftBlogs 
     : draftBlogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));
 
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
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="blogpage">
      <div className="titledashboard flex flex-sb">
        <div data-aos="fade-right">
          <h2>
            All Draft <span>Blogs</span>
          </h2>
          <h3>Admin Panel</h3>
        </div>
        <div className="breadcrumb" data-aos="fade-left">
          <BsPostcard /> <span>/</span> <span>Draft Blogs</span>
        </div>
      </div>

      <div className="blogstable" data-aos="fade-up">
        <table className="table table-styling">
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
            ) : currentBlogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No Draft Blogs
                </td>
              </tr>
            ) : (
              currentBlogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td>{indexOfFirstBlog + index + 1}</td>
                  <td>
                    <h3>{blog.title}</h3>
                  </td>
                  <td>
                    <pre>{blog.slug}</pre>
                  </td>
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

        {totalPages > 1 && (
          <div className="blogpagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
