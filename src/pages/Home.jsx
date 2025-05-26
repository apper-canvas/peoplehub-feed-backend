import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [activeTab, setActiveTab] = useState('employees')

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

  return (
    <div className="min-h-screen">
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
            </button>
            <button className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl flex items-center justify-center space-x-2 shadow-soft hover:shadow-card transition-shadow">
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
    </div>
  )
}

export default Home