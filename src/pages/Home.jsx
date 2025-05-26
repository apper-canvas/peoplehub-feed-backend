import { motion } from 'framer-motion'

import { toast } from 'react-toastify'

import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [activeTab, setActiveTab] = useState('employees')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const stats = [
    { label: "Active Employees", value: "1,247", icon: "Users" },
    { label: "Departments", value: "12", icon: "Building" },
    { label: "Pending Requests", value: "23", icon: "Clock" },
    { label: "This Month Hires", value: "8", icon: "UserPlus" }
  ]


  const departments = ['Engineering', 'Sales', 'HR', 'Marketing', 'Finance']
  
  const reportTypes = [
    { id: 'employee', name: 'Employee Reports', description: 'Comprehensive employee data and performance metrics' },
    { id: 'attendance', name: 'Attendance Reports', description: 'Time tracking and attendance analytics' },
    { id: 'payroll', name: 'Payroll Reports', description: 'Salary and compensation reports' },
    { id: 'performance', name: 'Performance Reports', description: 'Performance reviews and goal tracking' },
    { id: 'department', name: 'Department Reports', description: 'Department-wise analytics and insights' }
  ]

  const handleGenerateReport = async (reportData) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowGenerateModal(false)
      toast.success('Report generation started successfully!')
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        toast.success('Report generated successfully! Check your downloads.')
      }, 3000)
      
    } catch (error) {
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
      if (new Date(formData.dateStart) > new Date(formData.dateEnd)) {
        toast.error('Start date must be before end date')
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

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-surface-800/80 glass-effect border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">PeopleHub</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Employees</a>
              <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Departments</a>
              <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Reports</a>
            </nav>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              </button>
              <button className="md:hidden p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-6"
            >
              Streamline Your <span className="text-gradient">HR Operations</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto"
            >
              Centralize employee data, manage organizational structure, and automate HR processes with our comprehensive platform
            </motion.p>
          </div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="card p-4 sm:p-6 text-center hover:shadow-soft transition-shadow duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16"
          >
            <button 
              onClick={() => setActiveTab('add')}
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl flex items-center justify-center space-x-2 shadow-soft hover:shadow-card transition-shadow"
            >
              <ApperIcon name="UserPlus" className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl flex items-center justify-center space-x-2 shadow-soft hover:shadow-card transition-shadow"
            >
              <ApperIcon name="UserPlus" className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl flex items-center justify-center space-x-2 shadow-soft hover:shadow-card transition-shadow"
            >
              <ApperIcon name="FileText" className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Feature Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-8 sm:py-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MainFeature activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-surface-900 dark:bg-surface-950 text-surface-300 py-8 sm:py-12 mt-16 sm:mt-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">PeopleHub</h3>
              </div>
              <p className="text-surface-400">
                Streamline your HR operations with our comprehensive employee management platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>Employee Management</li>
                <li>Department Organization</li>
                <li>Leave Management</li>
                <li>Performance Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm text-surface-400">
                Get in touch with our support team for assistance with your HR management needs.
              </p>
            </div>
          </div>
          <div className="border-t border-surface-800 mt-8 pt-6 text-center text-sm text-surface-400">
            <p>&copy; 2024 PeopleHub. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>

      {/* Generate Report Modal */}
      {showGenerateModal && <GenerateReportModal />}

    </div>
  )
}

export default Home