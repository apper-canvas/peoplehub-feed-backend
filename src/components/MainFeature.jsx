import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('employees')
  const [employees, setEmployees] = useState([
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      position: 'Software Engineer',
      department: 'Engineering',
      hireDate: '2023-01-15',
      status: 'Active'
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@company.com',
      position: 'Product Manager',
      department: 'Product',
      hireDate: '2022-11-08',
      status: 'Active'
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@company.com',
      position: 'UX Designer',
      department: 'Design',
      hireDate: '2023-03-22',
      status: 'Active'
    }
  ])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    hireDate: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']

  const tabs = [
    { id: 'employees', label: 'Employee Directory', icon: 'Users' },
    { id: 'add', label: 'Add Employee', icon: 'UserPlus' },
    { id: 'departments', label: 'Departments', icon: 'Building' }
  ]

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.department || !formData.hireDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...editingEmployee, ...formData, status: 'Active' }
          : emp
      ))
      toast.success('Employee updated successfully!')
      setEditingEmployee(null)
    } else {
      const newEmployee = {
        id: Date.now().toString(),
        ...formData,
        status: 'Active'
      }
      setEmployees([...employees, newEmployee])
      toast.success('Employee added successfully!')
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: '',
      hireDate: ''
    })
    setActiveTab('employees')
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate
    })
    setActiveTab('add')
  }

  const handleDelete = (employeeId) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId))
    toast.success('Employee removed successfully!')
  }

  const getDepartmentStats = () => {
    return departments.map(dept => ({
      name: dept,
      count: employees.filter(emp => emp.department === dept).length,
      icon: getDepartmentIcon(dept)
    }))
  }

  const getDepartmentIcon = (department) => {
    const icons = {
      'Engineering': 'Code',
      'Product': 'Lightbulb',
      'Design': 'Palette',
      'Marketing': 'Megaphone',
      'Sales': 'TrendingUp',
      'HR': 'Users',
      'Finance': 'DollarSign'
    }
    return icons[department] || 'Building'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
    >
      {/* Tab Navigation */}
      <div className="border-b border-surface-200 dark:border-surface-700 mb-6 sm:mb-8">
        <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {/* Employee Directory Tab */}
        {activeTab === 'employees' && (
          <motion.div
            key="employees"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 sm:p-6 hover:shadow-soft transition-shadow duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          {employee.position}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                      {employee.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400 truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <ApperIcon name="Building" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400">{employee.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                      <span className="text-surface-600 dark:text-surface-400">
                        Hired {format(new Date(employee.hireDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="flex-1 py-2 px-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="Users" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-600 dark:text-surface-400">
                  {searchTerm ? 'No employees found matching your search.' : 'No employees added yet.'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Add Employee Tab */}
        {activeTab === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-surface-600 dark:text-surface-400">
                {editingEmployee ? 'Update employee information below.' : 'Fill in the details to add a new team member.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter job position"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Hire Date *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 rounded-xl flex items-center justify-center space-x-2 flex-1 sm:flex-none"
                >
                  <ApperIcon name={editingEmployee ? "Save" : "UserPlus"} className="w-5 h-5" />
                  <span>{editingEmployee ? 'Update Employee' : 'Add Employee'}</span>
                </button>
                {editingEmployee && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEmployee(null)
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        position: '',
                        department: '',
                        hireDate: ''
                      })
                    }}
                    className="btn-secondary px-8 py-3 rounded-xl flex items-center justify-center space-x-2 flex-1 sm:flex-none"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <motion.div
            key="departments"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Department Overview
              </h2>
              <p className="text-surface-600 dark:text-surface-400">
                View employee distribution across departments
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {getDepartmentStats().map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 hover:shadow-soft transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                      <ApperIcon name={dept.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                        {dept.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        {dept.count}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    {dept.count === 1 ? 'Employee' : 'Employees'}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Department Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Total Employees:</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">{employees.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Active Departments:</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">
                    {getDepartmentStats().filter(d => d.count > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Largest Department:</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">
                    {getDepartmentStats().reduce((max, dept) => dept.count > max.count ? dept : max, { name: 'None', count: 0 }).name}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MainFeature