"use client"

import { useEffect, useState } from "react"
import axios from "axios"

function useFetchData(apiEndPoint) {
  const [data, setData] = useState({
    alldata: [],
    loading: true,
  })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get(apiEndPoint)
        setData({
          alldata: res.data,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching blog data:", error)
        setData({
          alldata: [],
          loading: false,
        })
      }
    }

    if (apiEndPoint) {
      fetchAllData()
    }
  }, [apiEndPoint])

  return data // Returns { alldata: [], loading: boolean }
}

export default useFetchData

