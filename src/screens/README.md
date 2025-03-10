# Screens

This directory contains all the screen components for the ApexTime application. Each screen file represents a specific page or view in the application.

## Files

- **AttendanceScreen.tsx**: Handles the attendance logging for employees.
- **GenerateReportScreen.tsx**: Handles the generation of reports for employees.
- **DashboardScreen.tsx**: Main dashboard for administrators and managers.
- **EmployeeListScreen.tsx**: List of employees.
- **EmployeeProfileScreen.tsx**: Detailed profile of an employee.
- **LoginScreen.tsx**: Login screen for authentication.
- **ForgotPasswordScreen.tsx**: Screen for password recovery.
- **SignupScreen.tsx**: Screen for user registration.
- **AdminDashboardScreen.tsx**: Dashboard for administrators.
- **ManagerDashboardScreen.tsx**: Dashboard for managers.
- **AbsenceManagementScreen.tsx**: Management of employee absences.
- **LeaveManagementScreen.tsx**: Management of employee leaves.
- **OvertimeManagementScreen.tsx**: Management of employee overtime.
- **PayrollScreen.tsx**: Management of employee payroll.
- **SupportScreen.tsx**: Support and help functionalities.
- **TeamPerformanceScreen.tsx**: Performance tracking for teams.

## Usage

Each screen file exports a React component that can be imported and used in the navigation stack. For example:

```typescript
import { AttendanceScreen } from './AttendanceScreen';

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Attendance" component={AttendanceScreen} />
  </Stack.Navigator>
);
```

## Contributing

If you want to add a new screen, create a new file in this directory and follow the existing patterns. Make sure to add JSDoc comments for all functions and components.
