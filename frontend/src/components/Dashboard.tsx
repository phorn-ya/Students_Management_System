import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CalendarDays,
  ClipboardCheck,
  CircleDollarSign,
  FileText,
  GraduationCap,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { findName, formatDate } from "../resources";
import type { DataStore, PageKey } from "../types";

export function Dashboard({
  data,
  loading,
  navigate,
}: {
  data: DataStore;
  loading: boolean;
  navigate: (page: PageKey) => void;
}) {
  const studentCount = data.students?.length ?? 0;
  const teacherCount = data.teachers?.length ?? 0;
  const courseCount = data.courses?.length ?? 0;
  const enrollmentCount = data.enrollments?.length ?? 0;
  const stats = [
    {
      label: "Total students",
      value: studentCount,
      delta: "Enrolled learners",
      icon: GraduationCap,
      color: "purple",
      key: "students" as PageKey,
    },
    {
      label: "Teaching staff",
      value: teacherCount,
      delta: "Active educators",
      icon: Users,
      color: "blue",
      key: "teachers" as PageKey,
    },
    {
      label: "Active courses",
      value: courseCount,
      delta: "Across all departments",
      icon: BookOpen,
      color: "orange",
      key: "courses" as PageKey,
    },
    {
      label: "Enrollments",
      value: enrollmentCount,
      delta: "Course registrations",
      icon: ClipboardCheck,
      color: "green",
      key: "enrollments" as PageKey,
    },
  ];
  const departments = data.departments ?? [];
  const maxDepartmentCount = Math.max(
    1,
    ...departments.map(
      (department) =>
        (data.students ?? []).filter(
          (student) => Number(student.department_id) === Number(department.id),
        ).length,
    ),
  );
  const recentStudents = [...(data.students ?? [])].reverse().slice(0, 5);
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <section className="dashboard-page">
      <div className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-tag">
            <Sparkles size={14} /> YOUR CAMPUS AT A GLANCE
          </div>
          <h1>
            Good day, Admin <span>✦</span>
          </h1>
          <p>Here’s what’s happening across your school today.</p>
          <div className="welcome-date">
            <CalendarDays size={15} />
            {today}
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-sun" />
          <div className="art-book">
            <BookMarked size={72} strokeWidth={1.1} />
          </div>
          <div className="art-sparkle">✳</div>
          <div className="art-lines" />
        </div>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              className="stat-card"
              key={stat.label}
              onClick={() => navigate(stat.key)}
            >
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={20} />
              </div>
              <span className="stat-trend">
                <ArrowUpRight size={14} /> Live
              </span>
              <div className="stat-value">
                {loading && data[stat.key] === undefined ? (
                  <span className="value-skeleton" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-caption">{stat.delta}</div>
            </button>
          );
        })}
      </div>
      <div className="dashboard-grid">
        <div className="panel department-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">YOUR SCHOOL</span>
              <h2>Students by department</h2>
            </div>
            <button
              className="text-button"
              onClick={() => navigate("departments")}
            >
              View departments <span>→</span>
            </button>
          </div>
          {loading && !departments.length ? (
            <div className="loading-state compact">
              <span className="spinner" />
              Loading insights…
            </div>
          ) : departments.length ? (
            <div className="department-bars">
              {departments.slice(0, 6).map((department, index) => {
                const count = (data.students ?? []).filter(
                  (student) =>
                    Number(student.department_id) === Number(department.id),
                ).length;
                const colors = [
                  "#7c6cf2",
                  "#5ca8f3",
                  "#f3a659",
                  "#53c7aa",
                  "#ec79a5",
                  "#8293a7",
                ];
                return (
                  <div className="department-row" key={department.id}>
                    <div className="dept-row-top">
                      <span>
                        <i
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        {department.name}
                      </span>
                      <b>{count}</b>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.max(count ? 9 : 2, (count / maxDepartmentCount) * 100)}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="chart-footnote">
                <span>
                  <span className="legend-dot" />
                  Students linked to each department
                </span>
                <span>{studentCount} students</span>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No departments to show"
              subtitle="Add departments to see a student breakdown."
              action="Add department"
              onAction={() => navigate("departments")}
            />
          )}
        </div>
        <div className="panel quick-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">QUICK ACTIONS</span>
              <h2>Make a move</h2>
            </div>
            <div className="quick-spark">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="quick-description">Jump into the things you do most.</p>
          <div className="quick-actions">
            <button onClick={() => navigate("students")}>
              <span className="quick-icon q-purple">
                <Plus size={17} />
              </span>
              <span>
                <b>Add a student</b>
                <small>Create a new student record</small>
              </span>
              <span className="quick-arrow">↗</span>
            </button>
            <button onClick={() => navigate("courses")}>
              <span className="quick-icon q-orange">
                <BookOpen size={16} />
              </span>
              <span>
                <b>Manage courses</b>
                <small>Update your course catalog</small>
              </span>
              <span className="quick-arrow">↗</span>
            </button>
            <button onClick={() => navigate("attendance")}>
              <span className="quick-icon q-green">
                <CalendarDays size={16} />
              </span>
              <span>
                <b>Take attendance</b>
                <small>Record a class attendance</small>
              </span>
              <span className="quick-arrow">↗</span>
            </button>
            <button onClick={() => navigate("grades")}>
              <span className="quick-icon q-blue">
                <FileText size={16} />
              </span>
              <span>
                <b>Record a grade</b>
                <small>Enter a student’s score</small>
              </span>
              <span className="quick-arrow">↗</span>
            </button>
          </div>
        </div>
      </div>
      <div className="panel recent-panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">STUDENT DIRECTORY</span>
            <h2>Recently added students</h2>
          </div>
          <button className="text-button" onClick={() => navigate("students")}>
            View all students <span>→</span>
          </button>
        </div>
        {recentStudents.length ? (
          <div className="recent-list">
            {recentStudents.map((student, index) => (
              <div className="recent-row" key={student.id}>
                <div
                  className={`avatar student-avatar avatar-color-${index % 5}`}
                >
                  {`${student.first_name?.[0] ?? ""}${student.last_name?.[0] ?? ""}`.toUpperCase() ||
                    "ST"}
                </div>
                <div className="recent-person">
                  <b>
                    {student.first_name} {student.last_name}
                  </b>
                  <span>Student ID #{student.id}</span>
                </div>
                <div className="recent-department">
                  {findName(departments, student.department_id, "name")}
                </div>
                <span className="active-label">
                  <i /> Active
                </span>
                <span className="recent-date">
                  {formatDate(student.created_at)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your student directory is ready"
            subtitle="Students you add will appear here."
            action="Go to students"
            onAction={() => navigate("students")}
          />
        )}
      </div>
      <div className="dashboard-bottom">
        <div>
          <CircleDollarSign size={15} />
          <span>One place for your whole campus.</span>
        </div>
        <button onClick={() => navigate("enrollments")}>
          <ArrowDownRight size={14} /> Manage enrollments
        </button>
      </div>
    </section>
  );
}

export function EmptyState({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <GraduationCap size={24} />
      </div>
      <b>{title}</b>
      <span>{subtitle}</span>
      {action && (
        <button onClick={onAction}>
          {action} <span>→</span>
        </button>
      )}
    </div>
  );
}
