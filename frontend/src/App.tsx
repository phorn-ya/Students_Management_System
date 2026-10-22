import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { request } from "./api";
import { resources } from "./resources";
import { AppFooter, AppHeader } from "./components/AppChrome";
import { Dashboard } from "./components/Dashboard";
import { LoginDialog, RecordDialog } from "./components/Dialogs";
import { ResourcePage } from "./components/ResourcePage";
import { Sidebar } from "./components/Sidebar";
import type { DataStore, PageKey, Resource, Row } from "./types";

function App() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [data, setData] = useState<DataStore>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogResource, setDialogResource] = useState<Resource | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileName, setProfileName] = useState(
    localStorage.getItem("campusly-user") || "",
  );
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const results = await Promise.allSettled(
      resources.map(async (resource) => {
        const rows = await request<Row[]>(resource.endpoint);
        return [resource.key, Array.isArray(rows) ? rows : []] as const;
      }),
    );
    const next: DataStore = {};
    const errors: string[] = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled")
        next[result.value[0]] = result.value[1];
      else
        errors.push(
          `${resources[index].label}: ${result.reason instanceof Error ? result.reason.message : "Could not load"}`,
        );
    });
    setData(next);
    setApiOnline(errors.length === 0);
    if (errors.length) setLoadError(errors.join(" · "));
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload, refreshToken]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeResource = resources.find((resource) => resource.key === page);
  const records = activeResource ? (data[activeResource.key] ?? []) : [];
  const visibleRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return records;
    return records.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(needle),
    );
  }, [records, search]);

  const openCreate = () => {
    setEditing(null);
    setDialogResource(activeResource ?? null);
  };
  const openEdit = (resource: Resource, row: Row) => {
    setEditing(row);
    setDialogResource(resource);
  };

  async function saveRecord(formValues: Row) {
    if (!dialogResource) return;
    setSaving(true);
    let accountCreated = false;
    try {
      const resource = dialogResource;
      const method = editing ? "PUT" : "POST";
      let body = { ...formValues };
      if (
        !editing &&
        (resource.key === "students" || resource.key === "teachers")
      ) {
        const account = await request<Row>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            username: body.username,
            email: body.email,
            password: body.password,
            role: resource.key === "students" ? "student" : "teacher",
          }),
        });
        accountCreated = true;
        body = {
          user_id: account.user?.id ?? account.id,
          first_name: body.first_name,
          last_name: body.last_name,
          department_id: body.department_id ? Number(body.department_id) : null,
        };
      } else {
        for (const key of [
          "department_id",
          "teacher_id",
          "student_id",
          "course_id",
          "credits",
          "score",
        ]) {
          if (body[key] !== "" && body[key] != null)
            body[key] = Number(body[key]);
          else if (body[key] === "") body[key] = null;
        }
      }
      const suffix = editing ? `/${editing.id}` : "";
      await request(`${resource.endpoint}${suffix}`, {
        method,
        body: JSON.stringify(body),
      });
      setDialogResource(null);
      setEditing(null);
      setToast(
        `${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} ${editing ? "updated" : "created"} successfully`,
      );
      setRefreshToken((value) => value + 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save the record";
      setToast(
        accountCreated
          ? `Login account created, but the ${dialogResource.singular} record failed: ${message}`
          : message,
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(resource: Resource, row: Row) {
    if (
      !window.confirm(
        `Delete this ${resource.singular}? This action cannot be undone.`,
      )
    )
      return;
    try {
      await request(`${resource.endpoint}/${row.id}`, { method: "DELETE" });
      setToast(
        `${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} deleted`,
      );
      setRefreshToken((value) => value + 1);
    } catch (error) {
      setToast(
        error instanceof Error ? error.message : "Could not delete the record",
      );
    }
  }

  async function login(values: Row) {
    setSaving(true);
    try {
      const response = await request<{ token: string; user: Row }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            username: values.identifier,
            password: values.password,
          }),
        },
      );
      if (response.token)
        localStorage.setItem("campusly-token", response.token);
      const name = response.user?.username ?? values.identifier;
      localStorage.setItem("campusly-user", name);
      setProfileName(name);
      setLoginOpen(false);
      setToast(`Welcome back, ${name}`);
      setRefreshToken((value) => value + 1);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("campusly-token");
    localStorage.removeItem("campusly-user");
    setProfileName("");
    setToast("Signed out");
  }

  function navigate(next: PageKey) {
    setPage(next);
    setSearch("");
    setMobileNav(false);
  }

  return (
    <div className="app-shell">
      {mobileNav && (
        <button
          className="scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}
      <Sidebar
        page={page}
        data={data}
        profileName={profileName}
        open={mobileNav}
        onNavigate={navigate}
        onSignIn={() => setLoginOpen(true)}
        onSignOut={logout}
        onHelp={() =>
          setToast(
            "Tip: start by adding a department, then create courses and students.",
          )
        }
        onClose={() => setMobileNav(false)}
      />
      <main className="main-area">
        <AppHeader
          page={page}
          apiOnline={apiOnline}
          profileName={profileName}
          onMenu={() => setMobileNav(true)}
          onNotification={() => setToast("You’re all caught up")}
          onUserAction={profileName ? logout : () => setLoginOpen(true)}
        />
        <div className="page-content">
          {loadError && (
            <div className="error-banner">
              <ShieldCheck size={17} />
              <span>Some information could not be loaded: {loadError}</span>
              <button onClick={() => setRefreshToken((value) => value + 1)}>
                Retry
              </button>
            </div>
          )}
          {page === "dashboard" ? (
            <Dashboard data={data} loading={loading} navigate={navigate} />
          ) : activeResource ? (
            <ResourcePage
              resource={activeResource}
              rows={visibleRows}
              total={records.length}
              data={data}
              loading={loading}
              search={search}
              onSearch={setSearch}
              onCreate={openCreate}
              onEdit={(row) => openEdit(activeResource, row)}
              onDelete={(row) => void deleteRecord(activeResource, row)}
            />
          ) : null}
          <AppFooter
            onAbout={() =>
              setToast(
                "Campusly Student Management · API connected via localhost:3000",
              )
            }
          />
        </div>
      </main>
      {dialogResource && (
        <RecordDialog
          resource={dialogResource}
          editing={editing}
          data={data}
          saving={saving}
          onClose={() => {
            if (!saving) {
              setDialogResource(null);
              setEditing(null);
            }
          }}
          onSave={saveRecord}
        />
      )}
      {loginOpen && (
        <LoginDialog
          saving={saving}
          onClose={() => setLoginOpen(false)}
          onLogin={login}
        />
      )}
      {toast && (
        <div className="toast">
          <span className="toast-check">
            <Check size={15} />
          </span>
          {toast}
          <button onClick={() => setToast("")} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
