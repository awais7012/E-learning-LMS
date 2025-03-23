"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiPlus, FiDownload, FiAward, FiEye, FiEdit, FiTrash2, FiCheck } from "react-icons/fi"
import axios from "axios"

// Base URL from .env
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"

const Certifications = () => {
  // 'view' can be "student" (default: get all student certificates) or "course" (filter by course)
  const [activeTab, setActiveTab] = useState("issued")
  const [view, setView] = useState("student")
  const [courseFilter, setCourseFilter] = useState("") // for filtering course certificates
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch certificates from the backend based on the current view
  const fetchCertificates = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found. Please log in.")
        setLoading(false)
        setError("Authentication required. Please log in.")
        return
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }

      let res
      if (view === "student") {
        // Fetch certificates for all students
        res = await axios.get(`${baseUrl}/api/certificates/admin`, config)
      } else if (view === "course") {
        // For course view, courseFilter must be provided
        if (!courseFilter) {
          setLoading(false)
          return
        }
        res = await axios.get(`${baseUrl}/api/certificates/course/${courseFilter}`, config)
      }

      // Assume response is an array or object with certificates array
      const data = Array.isArray(res.data) ? res.data : res.data.certificates || []

      // Map the data to ensure it has the expected structure
      const formattedCertificates = data.map((cert) => ({
        id: cert._id || cert.id || "N/A",
        studentName: cert.student_name || "Unknown Student",
        studentId: cert.student_id || "N/A",
        courseName: cert.course_name || "Unknown Course",
        courseId: cert.course_id || "N/A",
        grade: cert.grade || "N/A",
        status: cert.status || "issued",
        issueDate: cert.issue_date || cert.created_at || null,
        certificateUrl: cert.certificate_url || null,
        credentialId: cert.credential_id || "N/A",
      }))

      setCertificates(formattedCertificates)
    } catch (error) {
      console.error("Error fetching certificates:", error.response?.data || error.message)
      setError("Failed to load certificates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, courseFilter])

  // Filter certificates by search term with null checks
  const filteredCertificates = certificates.filter((cert) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      (cert.studentName && cert.studentName.toLowerCase().includes(searchTermLower)) ||
      (cert.courseName && cert.courseName.toLowerCase().includes(searchTermLower)) ||
      (cert.id && cert.id.toString().toLowerCase().includes(searchTermLower)) ||
      (cert.credentialId && cert.credentialId.toLowerCase().includes(searchTermLower))
    )
  })

  // Handler functions for actions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleNewCertificate = async () => {
    // Prompt for the certificate template name
    const templateName = prompt("Enter certificate template name:")
    if (!templateName) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You are not logged in. Please log in first.")
        return
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // in case your backend uses cookies
      }

      // Build the payload according to your backend requirements.
      const payload = {
        title: templateName,
        description: "Default certificate template", // Adjust if needed or prompt the user
        course_id: courseFilter || null,
      }

      const res = await axios.post(`${baseUrl}/api/certificates/create`, payload, config)

      alert("Certificate template created successfully.")
      // Refresh the certificate list
      fetchCertificates()
    } catch (error) {
      console.error("Error creating certificate template:", error.response?.data || error.message)
      alert("Failed to create certificate template.")
    }
  }

  const handleIssueCertificate = async (courseId, studentId) => {
    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const res = await axios.post(`${baseUrl}/api/certificates/issue/${courseId}/${studentId}`, {}, config)
      alert(`Certificate issued for student ${studentId} in course ${courseId}`)
      fetchCertificates()
    } catch (error) {
      console.error("Error issuing certificate:", error.response?.data || error.message)
      alert("Failed to issue certificate.")
    }
  }

  const handleViewCertificate = (certificateUrl) => {
    if (certificateUrl) {
      window.open(`${baseUrl}/${certificateUrl}`, "_blank")
    } else {
      alert("Certificate preview not available")
    }
  }

  const handleEditCertificate = (id) => {
    alert(`Edit certificate ${id}`)
    // Implement editing functionality
  }

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(`${baseUrl}/api/certificates/${id}`, config)
      alert("Certificate deleted successfully")
      fetchCertificates()
    } catch (error) {
      console.error("Error deleting certificate:", error.response?.data || error.message)
      alert("Failed to delete certificate.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19a4db]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchCertificates} className="px-4 py-2 bg-[#19a4db] text-white rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Certification Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Certificates</p>
              <h3 className="text-3xl font-bold text-gray-800">{certificates.length}</h3>
              <p className="text-gray-500 text-xs font-medium mt-2">All-time issued</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiAward className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Certificates</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {certificates.filter((c) => c.status === "issued").length}
              </h3>
              <p className="text-green-500 text-xs font-medium mt-2">Currently valid</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">This Month</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {
                  certificates.filter((c) => {
                    if (!c.issueDate) return false
                    const issueDate = new Date(c.issueDate)
                    const now = new Date()
                    return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear()
                  }).length
                }
              </h3>
              <p className="text-blue-500 text-xs font-medium mt-2">Recently issued</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiAward className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search certificates"
              className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg flex items-center text-sm hover:bg-gray-50"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNewCertificate}
            className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
          >
            <FiPlus className="inline-block mr-2" />
            New Certificate Template
          </button>
          <button
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                "ID,Student Name,Student ID,Course Name,Issue Date,Status\n" +
                certificates
                  .map(
                    (cert) =>
                      `${cert.id},"${cert.studentName}",${cert.studentId},"${cert.courseName}",${cert.issueDate || ""},${cert.status}`,
                  )
                  .join("\n")
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", "certificates.csv")
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <FiDownload className="inline-block mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Optional: Filters Panel */}
      {filterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">View By</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                value={view}
                onChange={(e) => setView(e.target.value)}
              >
                <option value="student">All Students</option>
                <option value="course">By Course</option>
              </select>
            </div>
            {view === "course" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                <input
                  type="text"
                  placeholder="Enter course ID"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="issued">Issued</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setView("student")
                setCourseFilter("")
                setActiveTab("issued")
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 mr-2"
            >
              Reset Filters
            </button>
            <button
              onClick={fetchCertificates}
              className="px-3 py-1.5 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Certificates List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credential ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                      <div className="text-sm text-gray-500">{cert.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.credentialId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cert.status === "issued"
                            ? "bg-green-100 text-green-800"
                            : cert.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cert.issueDate
                        ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Not issued"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* For issued certificates, allow viewing */}
                        {cert.status === "issued" && (
                          <button
                            onClick={() => handleViewCertificate(cert.certificateUrl)}
                            className="text-[#19a4db] hover:text-[#1582af]"
                            title="View Certificate"
                          >
                            <FiEye />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditCertificate(cert.id)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit Certificate"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete Certificate"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No certificates found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State - Only show if no certificates at all */}
      {certificates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-6">
          <FiAward className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by creating a certificate template and issuing certificates to students.
          </p>
          <div className="mt-6">
            <button
              onClick={handleNewCertificate}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#19a4db] hover:bg-[#1582af]"
            >
              <FiPlus className="mr-2" />
              Create Certificate Template
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certifications

