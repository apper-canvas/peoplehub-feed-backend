import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
        >
          <Link
            to="/"
            className="btn-primary px-8 py-4 text-lg rounded-xl flex items-center justify-center space-x-2 shadow-soft hover:shadow-card transition-shadow w-full sm:w-auto"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary px-8 py-4 text-lg rounded-xl flex items-center justify-center space-x-2 shadow-soft hover:shadow-card transition-shadow w-full sm:w-auto"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound