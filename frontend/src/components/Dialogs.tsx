import { useState } from "react";
import { Check, Search, ShieldCheck, UsersRound, X } from "lucide-react";
import type { DataStore, Resource, Row } from "../types";

export function ClassStudentsDialog({
  schoolClass,
  students,
  classes,
  saving,
  onClose,
  onSave,
}: {
  schoolClass: Row;
  students: Row[];
  classes: Row[];
  saving: boolean;
  onClose: () => void;
  onSave: (studentIds: number[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    students
      .filter((student) => Number(student.class_id) === Number(schoolClass.id))
      .map((student) => Number(student.id)),
  );
  const [search, setSearch] = useState("");
  const filteredStudents = students.filter((student) =>
    `${student.first_name ?? ""} ${student.last_name ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const selected = new Set(selectedIds);

  function toggleStudent(studentId: number) {
    setSelectedIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon">
            <UsersRound size={20} />
          </div>
          <div>
            <h2>Manage {schoolClass.name} students</h2>
            <p>Select the students who belong to this class.</p>
          </div>
          <button
            className="icon-button modal-close"
            onClick={onClose}
            aria-label="Close"
            disabled={saving}
          >
            <X size={19} />
          </button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div className="table-toolbar" style={{ padding: 0 }}>
            <span>{selectedIds.length} students selected</span>
            <label className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students..."
                aria-label="Search students"
              />
            </label>
          </div>
          <div
            className="table-scroll"
            style={{ maxHeight: "min(48vh, 360px)", marginTop: 12 }}
          >
            {students.length ? (
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Currently in</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const studentId = Number(student.id);
                    const currentClass = classes.find(
                      (item) => Number(item.id) === Number(student.class_id),
                    );
                    return (
                      <tr key={student.id}>
                        <td>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selected.has(studentId)}
                              onChange={() => toggleStudent(studentId)}
                            />
                            {`${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
                              `Student #${student.id}`}
                          </label>
                        </td>
                        <td>{currentClass?.name ?? "Unassigned"}</td>
                      </tr>
                    );
                  })}
                  {!filteredStudents.length && (
                    <tr>
                      <td colSpan={2}>No students match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <p className="form-note">
                Create student records before assigning students to a class.
              </p>
            )}
          </div>
          <div className="form-note">
            Selecting a student already in another class will move them to{" "}
            {schoolClass.name}.
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => onSave(selectedIds)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner" /> Saving…
                </>
              ) : (
                <>
                  <Check size={16} /> Save students
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecordDialog({
  resource,
  editing,
  data,
  saving,
  onClose,
  onSave,
}: {
  resource: Resource;
  editing: Row | null;
  data: DataStore;
  saving: boolean;
  onClose: () => void;
  onSave: (values: Row) => void;
}) {
  const fields = editing ? resource.editFields : resource.createFields;
  const [values, setValues] = useState<Row>(() => {
    const initial: Row = {};
    fields.forEach((field) => {
      initial[field.key] =
        editing?.[field.key] ??
        (field.key === "date" ? editing?.attendance_date : "") ??
        "";
    });
    if (!editing && resource.key === "attendance") initial.status = "present";
    if (!editing && resource.key === "courses") initial.credits = 3;
    return initial;
  });
  const [formError, setFormError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (
      (resource.key === "students" || resource.key === "teachers") &&
      !editing &&
      String(values.password ?? "").length < 8
    ) {
      setFormError("Temporary password must be at least 8 characters.");
      return;
    }
    if (
      resource.key === "grades" &&
      (Number(values.score) < 0 || Number(values.score) > 100)
    ) {
      setFormError("Score must be between 0 and 100.");
      return;
    }
    onSave(values);
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon">
            <resource.icon size={20} />
          </div>
          <div>
            <h2>
              {editing
                ? `Edit ${resource.singular}`
                : `Add ${resource.singular}`}
            </h2>
            <p>
              {editing
                ? "Update the record details below."
                : "Fill in the details to add a new record."}
            </p>
          </div>
          <button
            className="icon-button modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            {fields.map((field) => {
              const fieldId = `${resource.key}-${field.key}`;
              return (
                <label
                  className={`form-field ${field.type === "textarea" ? "field-wide" : ""}`}
                  key={field.key}
                  htmlFor={fieldId}
                >
                  <span>
                    {field.label}
                    {field.required && <i> *</i>}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      id={fieldId}
                      required={field.required}
                      value={values[field.key]}
                      placeholder={
                        field.placeholder ??
                        `Enter ${field.label.toLowerCase()}`
                      }
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [field.key]: event.target.value,
                        })
                      }
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={fieldId}
                      required={field.required}
                      value={values[field.key]}
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [field.key]: event.target.value,
                        })
                      }
                    >
                      <option value="">
                        Select {field.label.toLowerCase()}
                      </option>
                      {getOptions(field.options, data).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={fieldId}
                      type={field.type ?? "text"}
                      min={
                        field.type === "number" && field.key === "score"
                          ? 0
                          : undefined
                      }
                      max={field.key === "score" ? 100 : undefined}
                      required={field.required}
                      value={values[field.key]}
                      placeholder={
                        field.placeholder ??
                        `Enter ${field.label.toLowerCase()}`
                      }
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [field.key]: event.target.value,
                        })
                      }
                    />
                  )}
                </label>
              );
            })}
          </div>
          {resource.key === "students" && !editing && (
            <div className="form-note">
              <ShieldCheck size={15} /> A student login account will be created
              automatically.
            </div>
          )}
          {resource.key === "teachers" && !editing && (
            <div className="form-note">
              <ShieldCheck size={15} /> A teacher login account will be created
              automatically.
            </div>
          )}
          {resource.key === "enrollments" && (
            <div className="form-note">
              <ShieldCheck size={15} /> This student will be registered in the
              selected course.
            </div>
          )}
          {formError && <div className="form-error">{formError}</div>}
          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? (
                <>
                  <span className="button-spinner" /> Saving…
                </>
              ) : (
                <>
                  <Check size={16} />{" "}
                  {editing ? "Save changes" : `Create ${resource.singular}`}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getOptions(
  key: string | undefined,
  data: DataStore,
): { value: number | string; label: string }[] {
  if (key === "attendanceStatus")
    return ["present", "absent", "late"].map((status) => ({
      value: status,
      label: status[0].toUpperCase() + status.slice(1),
    }));
  const rows = data[key ?? ""] ?? [];
  return rows.map((row) => ({
    value: row.id,
    label:
      key === "departments"
        ? row.name
        : key === "classes"
          ? row.name
        : key === "courses"
          ? `${row.code} · ${row.name}`
          : `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() ||
            `#${row.id}`,
  }));
}

export function LoginDialog({
  saving,
  onClose,
  onLogin,
}: {
  saving: boolean;
  onClose: () => void;
  onLogin: (values: Row) => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card login-modal">
        <div className="modal-header">
          <div className="modal-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2>Sign in to Campusly</h2>
            <p>Connect your account to this workspace.</p>
          </div>
          <button
            className="icon-button modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onLogin({ identifier, password });
          }}
        >
          <div className="form-grid one-column">
            <label className="form-field">
              <span>
                Username or email <i>*</i>
              </span>
              <input
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                placeholder="you@school.edu"
              />
            </label>
            <label className="form-field">
              <span>
                Password <i>*</i>
              </span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </label>
          </div>
          <div className="form-note">
            <ShieldCheck size={15} /> Your session token is stored only in this
            browser.
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
