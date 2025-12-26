require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const employeeRoutes = require('./src/routes/employee.routes');
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const managerRoutes = require('./src/routes/manager.routes');
const managerDashboardRoutes = require('./src/routes/managerDashboard.routes');
const employeeTaskRoutes = require('./src/routes/employeeTask.routes');
const Tasks = require('./src/routes/task.routes');
const userRoutes = require('./src/routes/user.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const SuperAdminManEmp=require('./src/./routes/./superAdminManEmp.routes')
const superAdminTask=require('./src/./routes/./superAdminTask.routes')
const managertaskRoutes=require('./src/./routes/./Managertask.routes')
const taskRoutes=require('./src/./routes/./taskEmployee.routes')
const ManagerTaskView=require('./src/./routes/./ManagerTaskView.routes')
const EmployeeHome=require('./src/./routes/./EmployeeHome.route')
const app = express();
connectDB();
const allowedOrigins = [
  'http://localhost:5173',
  'https://project-intellentech-frontend-d9fk-6nvxcuw5d.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// 🔥 THIS LINE IS MANDATORY
app.options('*', cors());
app.use(express.json());
// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/employee', employeeTaskRoutes);
app.use('/api/manager-dashboard', managerDashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', Tasks);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/superAdminManEmp",SuperAdminManEmp);
app.use("/api/superAdminTask",superAdminTask)
app.use("/api/managertask", managertaskRoutes);
app.use("/api/Emploeetasks", taskRoutes);
app.use('/api/ManagerTaskView',ManagerTaskView)
app.use("/api/EmployeeHome",EmployeeHome)
// ✅ Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
