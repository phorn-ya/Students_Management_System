# API Testing Guide - Student Management System

## Base URL
```
http://localhost:3000/api
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "role": "student"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

---

### 1.2 Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "student@example.com",
      "name": "John Doe",
      "role": "student"
    }
  }
}
```

**Note:** Save the token for subsequent authenticated requests

---

### 1.3 Get User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

---

### 1.4 Logout User
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 2. STUDENT ENDPOINTS

### 2.1 Get All Students
**GET** `/students`

**Query Parameters (Optional):**
- `limit`: number of results (default: 10)
- `offset`: pagination offset (default: 0)

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "departmentId": 1,
      "enrollmentYear": 2023
    }
  ]
}
```

---

### 2.2 Search Students
**GET** `/students/search`

**Query Parameters:**
- `q`: search query (name/email)
- `departmentId`: filter by department (optional)

**Example:** `/students/search?q=john&departmentId=1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "departmentId": 1
    }
  ]
}
```

---

### 2.3 Get Students by Department
**GET** `/students/department/:deptId`

**Example:** `/students/department/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "departmentId": 1
    }
  ]
}
```

---

### 2.4 Get Student by ID
**GET** `/students/:id`

**Example:** `/students/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "departmentId": 1,
    "enrollmentYear": 2023
  }
}
```

---

### 2.5 Create Student
**POST** `/students`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "departmentId": 1,
  "enrollmentYear": 2024
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "departmentId": 1,
    "enrollmentYear": 2024
  }
}
```

---

### 2.6 Update Student
**PUT** `/students/:id`

**Example:** `/students/1`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "departmentId": 2
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "departmentId": 2
  }
}
```

---

### 2.7 Delete Student
**DELETE** `/students/:id`

**Example:** `/students/1`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## 3. DEPARTMENT ENDPOINTS

### 3.1 Get All Departments
**GET** `/departments`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Computer Science",
      "code": "CS",
      "description": "Department of Computer Science"
    }
  ]
}
```

---

### 3.2 Get Department by ID
**GET** `/departments/:id`

**Example:** `/departments/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Computer Science",
    "code": "CS",
    "description": "Department of Computer Science"
  }
}
```

---

### 3.3 Create Department
**POST** `/departments`

**Request Body:**
```json
{
  "name": "Business Administration",
  "code": "BA",
  "description": "Department of Business Administration"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": 2,
    "name": "Business Administration",
    "code": "BA",
    "description": "Department of Business Administration"
  }
}
```

---

### 3.4 Update Department
**PUT** `/departments/:id`

**Example:** `/departments/1`

**Request Body:**
```json
{
  "name": "Computer Science & Engineering",
  "code": "CSE",
  "description": "Updated description"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "id": 1,
    "name": "Computer Science & Engineering",
    "code": "CSE"
  }
}
```

---

### 3.5 Delete Department
**DELETE** `/departments/:id`

**Example:** `/departments/1`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

---

## 4. COURSE ENDPOINTS

### 4.1 Get All Courses
**GET** `/courses`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "code": "CS101",
      "teacherId": 1,
      "creditHours": 3
    }
  ]
}
```

---

### 4.2 Get Courses by Teacher
**GET** `/courses/teacher/:teacherId`

**Example:** `/courses/teacher/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "code": "CS101",
      "teacherId": 1,
      "creditHours": 3
    }
  ]
}
```

---

### 4.3 Get Course by ID
**GET** `/courses/:id`

**Example:** `/courses/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Introduction to Programming",
    "code": "CS101",
    "teacherId": 1,
    "creditHours": 3,
    "description": "Learn programming basics"
  }
}
```

---

### 4.4 Create Course
**POST** `/courses`

**Request Body:**
```json
{
  "title": "Data Structures",
  "code": "CS201",
  "teacherId": 1,
  "creditHours": 3,
  "description": "Study data structures and algorithms"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 2,
    "title": "Data Structures",
    "code": "CS201",
    "teacherId": 1,
    "creditHours": 3
  }
}
```

---

### 4.5 Update Course
**PUT** `/courses/:id`

**Example:** `/courses/1`

**Request Body:**
```json
{
  "title": "Advanced Programming",
  "creditHours": 4,
  "description": "Updated description"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": 1,
    "title": "Advanced Programming",
    "code": "CS101",
    "creditHours": 4
  }
}
```

---

### 4.6 Delete Course
**DELETE** `/courses/:id`

**Example:** `/courses/1`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 5. ENROLLMENT ENDPOINTS

### 5.1 Get All Enrollments
**GET** `/enrollments`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "enrollmentDate": "2024-01-15",
      "status": "active"
    }
  ]
}
```

---

### 5.2 Get Enrollments by Student
**GET** `/enrollments/student/:studentId`

**Example:** `/enrollments/student/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "enrollmentDate": "2024-01-15",
      "status": "active"
    }
  ]
}
```

---

### 5.3 Get Enrollments by Course
**GET** `/enrollments/course/:courseId`

**Example:** `/enrollments/course/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "enrollmentDate": "2024-01-15",
      "status": "active"
    }
  ]
}
```

---

### 5.4 Create Enrollment
**POST** `/enrollments`

**Request Body:**
```json
{
  "studentId": 1,
  "courseId": 2,
  "enrollmentDate": "2024-01-20"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Enrollment created successfully",
  "data": {
    "id": 2,
    "studentId": 1,
    "courseId": 2,
    "enrollmentDate": "2024-01-20",
    "status": "active"
  }
}
```

---

### 5.5 Delete Enrollment
**DELETE** `/enrollments/:id`

**Example:** `/enrollments/1`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Enrollment deleted successfully"
}
```

---

## 6. GRADE ENDPOINTS

### 6.1 Get All Grades
**GET** `/grades`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "score": 85,
      "grade": "A",
      "gradedDate": "2024-02-15"
    }
  ]
}
```

---

### 6.2 Get Grade by ID
**GET** `/grades/:id`

**Example:** `/grades/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": 1,
    "courseId": 1,
    "score": 85,
    "grade": "A",
    "gradedDate": "2024-02-15"
  }
}
```

---

### 6.3 Get Grades by Student
**GET** `/grades/student/:studentId`

**Example:** `/grades/student/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "score": 85,
      "grade": "A"
    }
  ]
}
```

---

### 6.4 Get Grades by Course
**GET** `/grades/course/:courseId`

**Example:** `/grades/course/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "score": 85,
      "grade": "A"
    }
  ]
}
```

---

### 6.5 Create Grade
**POST** `/grades`

**Request Body:**
```json
{
  "studentId": 1,
  "courseId": 1,
  "score": 85,
  "grade": "A"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Grade created successfully",
  "data": {
    "id": 1,
    "studentId": 1,
    "courseId": 1,
    "score": 85,
    "grade": "A"
  }
}
```

---

### 6.6 Update Grade
**PUT** `/grades/:id`

**Example:** `/grades/1`

**Request Body:**
```json
{
  "score": 90,
  "grade": "A+"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Grade updated successfully",
  "data": {
    "id": 1,
    "studentId": 1,
    "courseId": 1,
    "score": 90,
    "grade": "A+"
  }
}
```

---

### 6.7 Delete Grade
**DELETE** `/grades/:id`

**Example:** `/grades/1`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Grade deleted successfully"
}
```

---

## 7. ATTENDANCE ENDPOINTS

### 7.1 Get All Attendance Records
**GET** `/attendances`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "attendanceDate": "2024-01-15",
      "status": "present"
    }
  ]
}
```

---

### 7.2 Get Attendance by Student
**GET** `/attendances/student/:studentId`

**Example:** `/attendances/student/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "attendanceDate": "2024-01-15",
      "status": "present"
    }
  ]
}
```

---

### 7.3 Get Attendance by Course
**GET** `/attendances/course/:courseId`

**Example:** `/attendances/course/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "attendanceDate": "2024-01-15",
      "status": "present"
    }
  ]
}
```

---

### 7.4 Get Attendance by Date
**GET** `/attendances/date`

**Query Parameters:**
- `date`: attendance date (YYYY-MM-DD)

**Example:** `/attendances/date?date=2024-01-15`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "attendanceDate": "2024-01-15",
      "status": "present"
    }
  ]
}
```

---

### 7.5 Create Attendance Record
**POST** `/attendances`

**Request Body:**
```json
{
  "studentId": 1,
  "courseId": 1,
  "attendanceDate": "2024-01-20",
  "status": "present"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Attendance recorded successfully",
  "data": {
    "id": 2,
    "studentId": 1,
    "courseId": 1,
    "attendanceDate": "2024-01-20",
    "status": "present"
  }
}
```

---

### 7.6 Update Attendance Record
**PUT** `/attendances/:id`

**Example:** `/attendances/1`

**Request Body:**
```json
{
  "status": "absent"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Attendance updated successfully",
  "data": {
    "id": 1,
    "studentId": 1,
    "courseId": 1,
    "attendanceDate": "2024-01-15",
    "status": "absent"
  }
}
```

---

## 8. TEACHER ENDPOINTS

### 8.1 Get All Teachers
**GET** `/teachers` or `/v1/teachers`

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dr. Smith",
      "email": "smith@example.com",
      "departmentId": 1,
      "qualification": "Ph.D"
    }
  ]
}
```

---

### 8.2 Get Teacher by ID
**GET** `/teachers/:id`

**Example:** `/teachers/1`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "departmentId": 1,
    "qualification": "Ph.D"
  }
}
```

---

### 8.3 Create Teacher
**POST** `/teachers`

**Request Body:**
```json
{
  "name": "Prof. Johnson",
  "email": "johnson@example.com",
  "departmentId": 1,
  "qualification": "M.Tech",
  "specialization": "Artificial Intelligence"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Teacher created successfully",
  "data": {
    "id": 2,
    "name": "Prof. Johnson",
    "email": "johnson@example.com",
    "departmentId": 1
  }
}
```

---

### 8.4 Update Teacher
**PUT** `/teachers/:id`

**Example:** `/teachers/1`

**Request Body:**
```json
{
  "name": "Dr. Smith Updated",
  "qualification": "Ph.D (Post-Doc)"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Teacher updated successfully",
  "data": {
    "id": 1,
    "name": "Dr. Smith Updated",
    "email": "smith@example.com"
  }
}
```

---

### 8.5 Delete Teacher
**DELETE** `/teachers/:id`

**Example:** `/teachers/1`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Teacher deleted successfully"
}
```

---

## Testing with cURL

### Example: Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePassword123",
    "name": "John Doe",
    "role": "student"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePassword123"
  }'
```

### Example: Get Profile (with authentication)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example: Create Student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "departmentId": 1,
    "enrollmentYear": 2024
  }'
```

---

## Testing with Postman

1. **Create a New Collection** - "Student Management System"
2. **Add Variable** - Set `base_url` = `http://localhost:3000/api`
3. **Add Variable** - Set `token` = "" (to be filled after login)
4. **Create Folders** - Auth, Students, Departments, Courses, Enrollments, Grades, Attendance, Teachers
5. **Add Requests** - Use the endpoints documented above
6. **Auto-update Token** - After login, set the token variable:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.data.token);
   ```

---

## Response Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Common Error Responses

### Missing Required Field
```json
{
  "success": false,
  "message": "Email is required",
  "statusCode": 400
}
```

### Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "statusCode": 401
}
```

### Resource Not Found
```json
{
  "success": false,
  "message": "Student not found",
  "statusCode": 404
}
```

---

## Testing Checklist

- [ ] Auth: Register & Login
- [ ] Auth: Get Profile
- [ ] Auth: Logout
- [ ] Students: CRUD operations
- [ ] Students: Search & filter
- [ ] Departments: CRUD operations
- [ ] Courses: CRUD operations
- [ ] Courses: Get by teacher
- [ ] Enrollments: CRUD operations
- [ ] Enrollments: Get by student/course
- [ ] Grades: CRUD operations
- [ ] Grades: Get by student/course
- [ ] Attendance: CRUD operations
- [ ] Attendance: Get by student/course/date
- [ ] Teachers: CRUD operations
- [ ] Error handling for all endpoints
- [ ] Authentication required endpoints
- [ ] Pagination/Filtering where applicable
