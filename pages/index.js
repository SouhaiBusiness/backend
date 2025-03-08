"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { IoHome } from "react-icons/io5"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import Loading from "@/components/Loading"

export default function Home() {
  //to show blogs number
  const [blogsData, setBlogsData] = useState([])

  const { data: session, status } = useSession()

  const router = useRouter()
  // check if there is no active session and redirect to login page
  useEffect(() => {
    // check if there is no active session and redirect to login page
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  useEffect(() => {
    // This useEffect handles the redirection logic
    if (status !== "loading" && !session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    // loading state, loader or any other indicator
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1> loading...</h1>
      </div>
    )
  }

  ChartJS.register(CategoryScale, LinearScale, LineController, BarElement, Title, Tooltip, Legend)

  // define option within the component scope

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Blogs Created Montly By Year",
      },
    },
  }

  useEffect(() => {
    // fetch data from api
    const fetchData = async () => {
      try {
        const response = await fetch("/api/blogapi")
        const data = await response.json()
        setBlogsData(data)
      } catch (error) {
        console.error("Error fetching blog data:", error)
      }
    }

    fetchData()
  }, [])

  // Function to count blogs by category
  // Modify the count function to handle array of categories
  const getBlogCountByCategory = (categoryValue) => {
    return blogsData.filter(
      (blog) =>
        blog.status === "publish" && Array.isArray(blog.blogcategory) && blog.blogcategory.includes(categoryValue),
    ).length
  }

  // Function to get total number of unique tags across all blogs
  const getTotalTags = () => {
    // Create a Set to store unique tags
    const uniqueTags = new Set()

    // Iterate through all published blogs
    blogsData.forEach((blog) => {
      if (blog.status === "publish" && blog.tags && Array.isArray(blog.tags)) {
        // Add each tag to the Set (Sets only store unique values)
        blog.tags.forEach((tag) => uniqueTags.add(tag))
      }
    })

    // Return the size of the Set (number of unique tags)
    return uniqueTags.size
  }

  // Function to get total number of unique topics/categories
  const getTotalTopics = () => {
    // Create a Set to store unique categories
    const uniqueTopics = new Set()

    // Iterate through all published blogs
    blogsData.forEach((blog) => {
      if (blog.status === "publish" && blog.blogcategory && Array.isArray(blog.blogcategory)) {
        // Add each category to the Set
        blog.blogcategory.forEach((category) => uniqueTopics.add(category))
      }
    })

    // Return the size of the Set (number of unique topics)
    return uniqueTopics.size
  }

  // agregate data by year and month

  const monthlydata = blogsData
    .filter((dat) => dat.status === "publish")
    .reduce((acc, blog) => {
      const year = new Date(blog.createdAt).getFullYear() // to get the year
      const month = new Date(blog.createdAt).getMonth() // to get the month ( 0 indexed)
      acc[year] = acc[year] || Array(12).fill(0) // initialize array for the year if not exists
      acc[year][month]++ // increment count of the month
      return acc
    }, {})

  const currentYear = new Date().getFullYear() // to get the current year
  const years = Object.keys(monthlydata)
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] // to get the month name

  const datasets = years.map((year) => ({
    label: `${year}`,
    data: monthlydata[year] || Array(12).fill(0), // if there 's  no data for the month set it to default 0
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256,
    )}, ${Math.floor(Math.random() * 256)}, 0.6)`,
  }))

  const data = {
    labels,
    datasets,
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
          <meta name="description" content="This is the admin dashboard" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/canva.png" />
        </Head>

        <div className="dashboard">
          {/* title dashboard */}
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                {" "}
                Blogs <span>Dashboard</span>
              </h2>
              <h3>Admin Panel</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <IoHome /> <span>/</span> <span>Dashboard</span>
            </div>
          </div>

          {/* four cards dashboard */}
          <div className="topfourcards flex flex-sb">
            <div className="four_card" data-aos="fade-right">
              <h2>Total Blogs</h2>
              <span>{blogsData?.filter((ab) => ab.status === "publish").length}</span>
            </div>

            <div className="four_card" data-aos="fade-right">
              <h2>Total Topics</h2>
              <span>{getTotalTopics()}</span>
            </div>

            <div className="four_card" data-aos="fade-left">
              <h2>Total Tags</h2>
              <span>{getTotalTags()}</span>
            </div>

            <div className="four_card" data-aos="fade-left">
              <h2>Draft Blogs</h2>
              <span>{blogsData?.filter((ab) => ab.status === "draft").length}</span>
            </div>
          </div>

          {/*Year overview */}
          <div className="year_overview flex flex-sb">
            <div className="leftyearoverview" data-aos="fade-up">
              <div className="flex flex-sb">
                <h3>Year Overview</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>
                <h3 className="text-right">
                  10 / 365 <br /> <span>Total Published</span>{" "}
                </h3>
              </div>

              <Bar data={data} options={options} />
            </div>

            <div className="right_salescont" data-aos="fade-up">
              <div className="">
                <h3>Blogs by Category</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>
              </div>

              <div className="blogscategory flex flex-center">
                <table>
                  <thead>
                    <tr>
                      <th>Topics</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>HTML, CSS &Javascript</td>
                      <td>{getBlogCountByCategory("javascript")}</td>
                    </tr>
                    <tr>
                      <td>Next Js, React Js</td>
                      <td>{getBlogCountByCategory("nextjs")}</td>
                    </tr>
                    <tr>
                      <td>Database</td>
                      <td>{getBlogCountByCategory("database")}</td>
                    </tr>
                    <tr>
                      <td>Deployment</td>
                      <td>{getBlogCountByCategory("deployment")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

