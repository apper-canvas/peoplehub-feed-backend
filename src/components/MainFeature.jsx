import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ activeTab, setActiveTab }) => {
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
    employeeId: '',
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
  
  
  const [timesheets, setTimesheets] = useState([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      weekEnding: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
      totalHours: 40,
      regularHours: 40,
      overtimeHours: 0,
      status: 'Submitted',
      submittedDate: format(new Date(), 'yyyy-MM-dd'),
      entries: [
        { date: '2024-01-15', hours: 8, type: 'Regular' },
        { date: '2024-01-16', hours: 8, type: 'Regular' },
        { date: '2024-01-17', hours: 8, type: 'Regular' },
        { date: '2024-01-18', hours: 8, type: 'Regular' },
        { date: '2024-01-19', hours: 8, type: 'Regular' }
      ]
    }
  ])
  
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState('month')
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      clockIn: '09:00',
      clockOut: '17:30',
      totalHours: 8.5,
      status: 'Present'
    },
    {
      id: '2', 
      employeeId: '2',
      employeeName: 'Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      clockIn: '08:30',
      clockOut: null,
      totalHours: 0,
      status: 'Clocked In'
    },
    {
      id: '3',
      employeeId: '3', 
      employeeName: 'Emily Rodriguez',
      date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
      clockIn: '09:15',
      clockOut: '17:45',
      totalHours: 8.5,
      status: 'Present'
    }
  ])
  
  const [clockedInEmployees, setClockedInEmployees] = useState(new Set(['2']))
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')


  

  
  // Departments state
  const [departmentsList, setDepartmentsList] = useState(['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'])
  const [showDepartmentForm, setShowDepartmentForm] = useState(false)
  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    description: ''
  })


  const tabs = [
    { id: 'employees', label: 'Employee Directory', icon: 'Users' },
    { id: 'add', label: 'Add Employee', icon: 'UserPlus' },
    { id: 'departments', label: 'Departments', icon: 'Building' },
    { id: 'attendance', label: 'Attendance', icon: 'Calendar' }
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
    
    if (!formData.employeeId || !formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.department || !formData.hireDate) {
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
      employeeId: '',
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
      employeeId: employee.employeeId || '',
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
    return departmentsList.map(dept => ({
      name: dept,
      count: employees.filter(emp => emp.department === dept).length,
      icon: getDepartmentIcon(dept)
    }))
  }


  // Department management functions
  const handleDepartmentInputChange = (e) => {
    setDepartmentFormData({
      ...departmentFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleDepartmentSubmit = (e) => {
    e.preventDefault()
    
    if (!departmentFormData.name.trim()) {
      toast.error('Department name is required')
      return
    }

    if (departmentsList.includes(departmentFormData.name.trim())) {
      toast.error('Department already exists')
      return
    }

    const newDepartment = departmentFormData.name.trim()
    setDepartmentsList([...departmentsList, newDepartment])
    setDepartmentFormData({ name: '', description: '' })
    setShowDepartmentForm(false)
    toast.success('Department added successfully!')
  }

  const handleDeleteDepartment = (deptName) => {
    const employeesInDept = employees.filter(emp => emp.department === deptName)
    if (employeesInDept.length > 0) {
      toast.error(`Cannot delete department. ${employeesInDept.length} employees are assigned to this department.`)
      return
    }
    
    setDepartmentsList(departmentsList.filter(dept => dept !== deptName))
    toast.success('Department deleted successfully!')
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


  // Time clock functions
  const handleClockIn = (employeeId, employeeName) => {
    const now = new Date()
    const timeString = format(now, 'HH:mm')
    const dateString = format(now, 'yyyy-MM-dd')
    
    const newRecord = {
      id: Date.now().toString(),
      employeeId,
      employeeName,
      date: dateString,
      clockIn: timeString,
      clockOut: null,
      totalHours: 0,
      status: 'Clocked In'
    }
    
    setAttendanceRecords([...attendanceRecords, newRecord])
    setClockedInEmployees(new Set([...clockedInEmployees, employeeId]))
    toast.success(`${employeeName} clocked in at ${timeString}`)
  }
  
  const handleClockOut = (employeeId, employeeName) => {
    const now = new Date()
    const timeString = format(now, 'HH:mm')
    const dateString = format(now, 'yyyy-MM-dd')
    
    setAttendanceRecords(attendanceRecords.map(record => {
      if (record.employeeId === employeeId && record.date === dateString && !record.clockOut) {
        const clockInTime = new Date(`${dateString}T${record.clockIn}:00`)
        const clockOutTime = new Date(`${dateString}T${timeString}:00`)
        const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60)
        
        return {
          ...record,
          clockOut: timeString,
          totalHours: Math.round(totalHours * 100) / 100,
          status: 'Present'
        }
      }
      return record
    }))
    
    setClockedInEmployees(new Set([...clockedInEmployees].filter(id => id !== employeeId)))
    toast.success(`${employeeName} clocked out at ${timeString}`)
  }
  
  const getCurrentDayHours = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayRecord = attendanceRecords.find(record => 
      record.employeeId === employeeId && record.date === today
    )
    return todayRecord ? todayRecord.totalHours : 0
  }
  
  const getTodaysAttendanceRecord = (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return attendanceRecords.find(record => 
      record.employeeId === employeeId && record.date === today
    )
  }


  
  const handleSubmitTimesheet = (timesheetId) => {
    setTimesheets(timesheets.map(timesheet => 
      timesheet.id === timesheetId 
        ? { ...timesheet, status: 'Submitted', submittedDate: format(new Date(), 'yyyy-MM-dd') }
        : timesheet
    ))
    toast.success('Timesheet submitted successfully!')
  }
  
  const handleApproveTimesheet = (timesheetId) => {
    setTimesheets(timesheets.map(timesheet => 
      timesheet.id === timesheetId 
        ? { ...timesheet, status: 'Approved' }
        : timesheet
    ))
    toast.success('Timesheet approved successfully!')
  }
  
  const getCalendarEvents = () => {
    const events = []
    
    // Add attendance events
    attendanceRecords.forEach(record => {
      if (record.status === 'Present') {
        events.push({
          id: `attendance-${record.id}`,
          title: `${record.employeeName} - Present`,
          start: new Date(`${record.date}T${record.clockIn}:00`),
          end: new Date(`${record.date}T${record.clockOut}:00`),
          type: 'attendance'
        })
      } else if (record.status === 'Clocked In') {
        events.push({
          id: `clocked-in-${record.id}`,
          title: `${record.employeeName} - Clocked In`,
          start: new Date(`${record.date}T${record.clockIn}:00`),
          end: new Date(`${record.date}T23:59:59`),
          type: 'clocked-in'
        })
      }
    })
    
    // Add timesheet events
    timesheets.forEach(timesheet => {
      events.push({
        id: `timesheet-${timesheet.id}`,
        title: `${timesheet.employeeName} - Timesheet (${timesheet.status})`,
        start: new Date(timesheet.weekEnding),
        end: new Date(timesheet.weekEnding),
        type: timesheet.status.toLowerCase()
      })
    })
    
    return events
  }
  
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'
    
    switch (event.type) {
      case 'attendance':
        backgroundColor = '#10b981'
        break
      case 'clocked-in':
        backgroundColor = '#f59e0b'
        break
      case 'submitted':
        backgroundColor = '#3b82f6'
        break
      case 'approved':
        backgroundColor = '#059669'
        break
      default:
        backgroundColor = '#6b7280'
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }
  
  const localizer = momentLocalizer(moment)
  
  
  const filteredAttendanceRecords = selectedEmployee ? 
    attendanceRecords.filter(record => record.employeeId === selectedEmployee) : 
    attendanceRecords
  
  const filteredTimesheets = selectedEmployee ? 
    timesheets.filter(timesheet => timesheet.employeeId === selectedEmployee) : 
    timesheets
  
  const filteredEmployeesForAttendance = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(attendanceSearchTerm.toLowerCase())
  )

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


            {/* Employee Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-50 dark:bg-surface-700">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Employee</th>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Position</th>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Department</th>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Email</th>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Hire Date</th>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-surface-900 dark:text-surface-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee, index) => (
                      <motion.tr
                        key={employee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                                {employee.firstName} {employee.lastName}
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-surface-600 dark:text-surface-400">
                          {employee.position}
                        </td>
                        <td className="py-4 px-6 text-surface-600 dark:text-surface-400">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Building" className="w-4 h-4 text-surface-400" />
                            <span>{employee.department}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-surface-600 dark:text-surface-400">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                            <span className="truncate max-w-[200px]">{employee.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-surface-600 dark:text-surface-400">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                            <span>{format(new Date(employee.hireDate), 'MMM dd, yyyy')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                            {employee.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(employee)}
                              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                              title="Edit Employee"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Employee"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter employee ID"
                  required
                />
              </div>
              
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
                    {departmentsList.map(dept => (
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
                        employeeId: '',
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
            
            {/* Add Department Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowDepartmentForm(true)}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2 shadow-soft hover:shadow-card transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Add New Department</span>
              </button>
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
                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() => handleDeleteDepartment(dept.name)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Department"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
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
        

        
        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Attendance Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Attendance Tracking
              </h2>
              <p className="text-surface-600 dark:text-surface-400">
                Manage employee time tracking, timesheets, and attendance records
              </p>
            </div>

            {/* Employee Filter */}
            <div className="card p-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="input-field"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
            </div>

            {/* Time Clock Section */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5" />
                <span>Time Clock</span>
              </h3>
              
              
            {/* Employee Search */}
            <div className="card p-4 mb-6">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees by name, position, or department..."
                  value={attendanceSearchTerm}
                  onChange={(e) => setAttendanceSearchTerm(e.target.value)}
                  className="input-field pl-12 w-full"
                />
              </div>
            </div>




              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployeesForAttendance.map(employee => {

                  const isEmployeeClockedIn = clockedInEmployees.has(employee.id)
                  const hoursToday = getCurrentDayHours(employee.id)
                  
                  return (
                    <div key={employee.id} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900 dark:text-surface-100">
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p className="text-xs text-surface-600 dark:text-surface-400">
                            {employee.position}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-surface-600 dark:text-surface-400">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isEmployeeClockedIn 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                          }`}>
                            {isEmployeeClockedIn ? 'Clocked In' : 'Clocked Out'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-surface-600 dark:text-surface-400">Today:</span>
                          <span className="font-medium text-surface-900 dark:text-surface-100">
                            {hoursToday}h
                          </span>
                        </div>

                      
                      {/* Sign In/Out Times */}
                      <div className="space-y-2 mb-4 p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
                        <div className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Today's Times
                        </div>
                        {(() => {
                          const todaysRecord = getTodaysAttendanceRecord(employee.id)
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-surface-600 dark:text-surface-400 flex items-center space-x-1">
                                  <ApperIcon name="LogIn" className="w-3 h-3" />
                                  <span>Sign In:</span>
                                </span>
                                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                  {todaysRecord?.clockIn || 'Not signed in'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-surface-600 dark:text-surface-400 flex items-center space-x-1">
                                  <ApperIcon name="LogOut" className="w-3 h-3" />
                                  <span>Sign Out:</span>
                                </span>
                                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                  {todaysRecord?.clockOut || 'Not signed out'}
                                </span>
                              </div>
                            </>
                          )
                        })()}
                      </div>

                        <button
                          onClick={() => handleClockIn(employee.id, `${employee.firstName} ${employee.lastName}`)}
                          disabled={isEmployeeClockedIn}
                          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            isEmployeeClockedIn
                              ? 'bg-surface-100 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
                              : 'bg-accent/10 text-accent hover:bg-accent/20'
                          }`}
                        >
                          Sign In

                        </button>
                        <button
                          onClick={() => handleClockOut(employee.id, `${employee.firstName} ${employee.lastName}`)}
                          disabled={!isEmployeeClockedIn}
                          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            !isEmployeeClockedIn
                              ? 'bg-surface-100 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          Sign Out

                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Attendance Records */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center space-x-2">
                <ApperIcon name="Calendar" className="w-5 h-5" />
                <span>Attendance Records</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-surface-200 dark:border-surface-700">
                    <tr>
                      <th className="text-left py-3 px-2 font-medium text-surface-900 dark:text-surface-100">Employee</th>
                      <th className="text-left py-3 px-2 font-medium text-surface-900 dark:text-surface-100">Date</th>
                      <th className="text-left py-3 px-2 font-medium text-surface-900 dark:text-surface-100">Clock In</th>
                      <th className="text-left py-3 px-2 font-medium text-surface-900 dark:text-surface-100">Clock Out</th>
                      <th className="text-left py-3 px-2 font-medium text-surface-900 dark:text-surface-100">Total hours</th>
                      <th className="text-left py-3 px-2 font-medium text-surface-900 dark:text-surface-100">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceRecords.slice(0, 10).map(record => (
                      <tr key={record.id} className="border-b border-surface-100 dark:border-surface-800">
                        <td className="py-3 px-2 text-surface-900 dark:text-surface-100">
                          {record.employeeName}
                        </td>
                        <td className="py-3 px-2 text-surface-600 dark:text-surface-400">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-3 px-2 text-surface-600 dark:text-surface-400">
                          {record.clockIn}
                        </td>
                        <td className="py-3 px-2 text-surface-600 dark:text-surface-400">
                          {record.clockOut || '-'}
                        </td>
                        <td className="py-3 px-2 text-surface-600 dark:text-surface-400">
                          {record.totalHours > 0 ? `${record.totalHours}h` : '-'}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'Present' ? 'bg-green-100 text-green-800' :
                            record.status === 'Clocked In' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredAttendanceRecords.length === 0 && (
                  <div className="text-center py-8">
                    <ApperIcon name="Calendar" className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                    <p className="text-surface-600 dark:text-surface-400">
                      No attendance records found
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timesheets Section */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center space-x-2">
                <ApperIcon name="FileText" className="w-5 h-5" />
                <span>Timesheets</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTimesheets.map(timesheet => (
                  <div key={timesheet.id} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-surface-900 dark:text-surface-100">
                          {timesheet.employeeName}
                        </h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          Week ending {format(new Date(timesheet.weekEnding), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        timesheet.status === 'Draft' ? 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400' :
                        timesheet.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                        timesheet.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                      }`}>
                        {timesheet.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Total Hours:</span>
                        <span className="font-medium text-surface-900 dark:text-surface-100">{timesheet.totalHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Regular:</span>
                        <span className="text-surface-900 dark:text-surface-100">{timesheet.regularHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Overtime:</span>
                        <span className="text-surface-900 dark:text-surface-100">{timesheet.overtimeHours}h</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {timesheet.status === 'Draft' && (
                        <button
                          onClick={() => handleSubmitTimesheet(timesheet.id)}
                          className="w-full py-2 px-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                        >
                          Submit Timesheet
                        </button>
                      )}
                      {timesheet.status === 'Submitted' && (
                        <button
                          onClick={() => handleApproveTimesheet(timesheet.id)}
                          className="w-full py-2 px-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
                        >
                          Approve Timesheet
                        </button>
                      )}
                      {timesheet.status === 'Approved' && (
                        <div className="w-full py-2 px-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium text-center">
                          ✓ Approved
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTimesheets.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="FileText" className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                  <p className="text-surface-600 dark:text-surface-400">
                    No timesheets found
                  </p>
                </div>
              )}
            </div>

            {/* Calendar View */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 flex items-center space-x-2">
                  <ApperIcon name="CalendarDays" className="w-5 h-5" />
                  <span>Calendar View</span>
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      calendarView === 'month'
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      calendarView === 'week'
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    Week
                  </button>
                </div>
              </div>
              
              <div className="h-96 border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                <Calendar
                  localizer={localizer}
                  events={getCalendarEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  view={calendarView}
                  onView={setCalendarView}
                  date={selectedDate}
                  onNavigate={setSelectedDate}
                  eventPropGetter={eventStyleGetter}
                  className="h-full"
                  popup
                  views={['month', 'week', 'day']}
                  step={60}
                  showMultiDayTimes
                  style={{
                    height: '100%',
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-surface-600 dark:text-surface-400">Attendance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-surface-600 dark:text-surface-400">Clocked In</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-surface-600 dark:text-surface-400">Timesheet (Submitted)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-surface-600 dark:text-surface-400">Timesheet (Approved)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Department Form Modal */}
        {showDepartmentForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDepartmentForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                  Add New Department
                </h3>
                <button
                  onClick={() => setShowDepartmentForm(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={departmentFormData.name}
                    onChange={handleDepartmentInputChange}
                    className="input-field"
                    placeholder="Enter department name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={departmentFormData.description}
                    onChange={handleDepartmentInputChange}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Enter department description (optional)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-3 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add Department</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDepartmentForm(false)}
                    className="btn-secondary flex-1 py-3 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}


    </motion.div>
  )
}

export default MainFeature