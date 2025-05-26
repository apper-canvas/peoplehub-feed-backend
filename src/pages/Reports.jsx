import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Reports = () => {
  const [activeReportType, setActiveReportType] = useState('employee')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Sample report data
  const sampleReports = [
    {
      id: 1,
      title: 'Employee Performance Q4 2024',
      type: 'employee',
      department: 'Engineering',
      generatedDate: '2024-01-15',
      status: 'completed',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Department Attendance Summary',
      type: 'attendance',
      department: 'Sales',
      generatedDate: '2024-01-14',
      status: 'completed',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Payroll Report December 2024',
      type: 'payroll',
      department: 'HR',
      generatedDate: '2024-01-13',
      status: 'processing',
      fileSize: '3.2 MB'
    }
  ]

  const departments = ['Engineering', 'Sales', 'HR', 'Marketing', 'Finance']
  
  const reportTypes = [
    { id: 'employee', name: 'Employee Reports', icon: 'Users', description: 'Comprehensive employee data and performance metrics' },
    { id: 'attendance', name: 'Attendance Reports', icon: 'Clock', description: 'Time tracking and attendance analytics' },
    { id: 'payroll', name: 'Payroll Reports', icon: 'DollarSign', description: 'Salary and compensation reports' },
    { id: 'performance', name: 'Performance Reports', icon: 'TrendingUp', description: 'Performance reviews and goal tracking' },
    { id: 'department', name: 'Department Reports', icon: 'Building', description: 'Department-wise analytics and insights' }
  ]

  const analytics = {
    totalEmployees: 1247,
    activeReports: 23,
    completedReports: 156,
    pendingReports: 8
  }

  useEffect(() => {
    setReports(sampleReports)
  }, [])

  const handleGenerateReport = async (reportData) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newReport = {
        id: Date.now(),
        title: reportData.title,
        type: reportData.type,
        department: reportData.department,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'processing',
        fileSize: '0 MB'
      }
      
      setReports(prev => [newReport, ...prev])
      setShowGenerateModal(false)
      toast.success('Report generation started successfully!')
      
      // Simulate completion after 5 seconds
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'completed', fileSize: '2.1 MB' }
            : report
        ))
        toast.success('Report generated successfully!')
      }, 5000)
      
    } catch (error) {
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = (reportId) => {
    const report = reports.find(r => r.id === reportId)
    if (report?.status === 'completed') {
      toast.success(`Downloading ${report.title}...`)
      // Simulate download
    } else {
      toast.warning('Report is still processing. Please wait.')
    }
  }

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(report => report.id !== reportId))
      toast.success('Report deleted successfully!')
    }
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    toast.info(`Viewing ${report.title}`)
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || report.department === filterDepartment
    const matchesType = activeReportType === 'all' || report.type === activeReportType
    return matchesSearch && matchesDepartment && matchesType
  })

  const GenerateReportModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      type: 'employee',
      department: 'Engineering',
      dateStart: '',
      dateEnd: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.title || !formData.dateStart || !formData.dateEnd) {
        toast.error('Please fill in all required fields')
        return
      }
      handleGenerateReport(formData)
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">Generate New Report</h3>
            <button
              onClick={() => setShowGenerateModal(false)}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field"
                placeholder="Enter report title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Report Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="input-field"
                required
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="input-field"
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.dateStart}
                  onChange={(e) => setFormData({...formData, dateStart: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.dateEnd}
                  onChange={(e) => setFormData({...formData, dateEnd: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading && <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Generating...' : 'Generate Report'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50 to-secondary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-surface-800/80 glass-effect border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">PeopleHub</h1>
              </Link>
              <span className="text-surface-400">/</span>
              <h2 className="text-lg font-semibold text-surface-700 dark:text-surface-300">Reports</h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              </button>
              <Link
                to="/"
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name="Home" className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Employees</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{analytics.totalEmployees.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Active Reports</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{analytics.activeReports}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{analytics.completedReports}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Pending</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{analytics.pendingReports}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Types Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Report Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveReportType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  activeReportType === type.id
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  activeReportType === type.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                }`}>
                  <ApperIcon name={type.icon} className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-surface-900 dark:text-surface-100 mb-1">{type.name}</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">{type.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="input-field w-full sm:w-48"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="input-field"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="input-field"
                  placeholder="End date"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowGenerateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Generated Reports</h3>
            <p className="text-surface-600 dark:text-surface-400">Manage and download your reports</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{report.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200">
                        {reportTypes.find(t => t.id === report.type)?.name || report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{report.department}</td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{report.generatedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : report.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {report.status === 'processing' && <ApperIcon name="Loader" className="w-3 h-3 mr-1 animate-spin" />}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{report.fileSize}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="p-2 text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          disabled={report.status !== 'completed'}
                          className={`p-2 rounded-lg transition-colors ${
                            report.status === 'completed'
                              ? 'text-surface-600 dark:text-surface-400 hover:text-accent hover:bg-accent/10'
                              : 'text-surface-400 dark:text-surface-600 cursor-not-allowed'
                          }`}
                          title="Download Report"
                        >
                          <ApperIcon name="Download" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-surface-600 dark:text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="FileText" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">No reports found</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4">No reports match your current filters.</p>
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="btn-primary"
                >
                  Generate Your First Report
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && <GenerateReportModal />}
      
      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Title</label>
                <p className="text-surface-900 dark:text-surface-100">{selectedReport.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Type</label>
                <p className="text-surface-900 dark:text-surface-100">{reportTypes.find(t => t.id === selectedReport.type)?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Department</label>
                <p className="text-surface-900 dark:text-surface-100">{selectedReport.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Generated Date</label>
                <p className="text-surface-900 dark:text-surface-100">{selectedReport.generatedDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</label>
                <p className="text-surface-900 dark:text-surface-100">{selectedReport.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">File Size</label>
                <p className="text-surface-900 dark:text-surface-100">{selectedReport.fileSize}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadReport(selectedReport.id)}
                disabled={selectedReport.status !== 'completed'}
                className="btn-primary flex items-center space-x-2"
              >
                <ApperIcon name="Download" className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports