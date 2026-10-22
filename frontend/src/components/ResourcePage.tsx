import { Activity, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { EmptyState } from "./Dashboard";
import type { DataStore, Resource, Row } from "../types";

type ResourcePageProps = {
  resource: Resource;
  rows: Row[];
  total: number;
  data: DataStore;
  loading: boolean;
  search: string;
  onSearch: (value: string) => void;
  onCreate: () => void;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
};

export function ResourcePage({
  resource,
  rows,
  total,
  data,
  loading,
  search,
  onSearch,
  onCreate,
  onEdit,
  onDelete,
}: ResourcePageProps) {
  const Icon = resource.icon;

  return (
    <section className="resource-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <Activity size={14} /> MANAGEMENT
          </div>
          <h1>{resource.label}</h1>
          <p>
            Keep your {resource.label.toLowerCase()} organized and up to date.
          </p>
        </div>
        <button className="primary-button" onClick={onCreate}>
          <Plus size={17} /> Add {resource.singular}
        </button>
      </div>
      <div className="resource-summary">
        <div className="summary-icon">
          <Icon size={20} />
        </div>
        <div>
          <b>{total}</b>
          <span>Total {resource.label.toLowerCase()}</span>
        </div>
        <span className="summary-note">
          <Activity size={15} /> Live from your database
        </span>
      </div>
      <div className="table-panel">
        <div className="table-toolbar">
          <div>
            <h2>All {resource.label}</h2>
            <span>{rows.length} records</span>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={`Search ${resource.label.toLowerCase()}...`}
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        {loading && !total ? (
          <div className="loading-state">
            <span className="spinner" />
            Loading {resource.label.toLowerCase()}…
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {resource.columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th className="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row.id ?? rowIndex}>
                    {resource.columns.map((column) => {
                      const value = column.render
                        ? column.render(row, data)
                        : row[column.key];
                      return (
                        <td key={column.key}>
                          {column.key === "status" ? (
                            <span
                              className={`status-pill status-${String(value).toLowerCase()}`}
                            >
                              {value}
                            </span>
                          ) : (
                            value || "—"
                          )}
                        </td>
                      );
                    })}
                    <td className="row-actions">
                      {resource.editFields.length > 0 && (
                        <button
                          className="row-action"
                          onClick={() => onEdit(row)}
                          aria-label={`Edit ${resource.singular}`}
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {resource.canDelete && (
                        <button
                          className="row-action danger"
                          onClick={() => onDelete(row)}
                          aria-label={`Delete ${resource.singular}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={resource.columns.length + 1}>
                      <EmptyState
                        title={
                          search
                            ? "No matching records"
                            : `No ${resource.label.toLowerCase()} yet`
                        }
                        subtitle={
                          search
                            ? "Try a different search phrase."
                            : `Create your first ${resource.singular} to get started.`
                        }
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">
          <span>
            Showing{" "}
            <b>
              {rows.length ? 1 : 0}–{rows.length}
            </b>{" "}
            of <b>{total}</b>
          </span>
          <div className="table-pager">
            <button disabled>Previous</button>
            <button className="pager-current">1</button>
            <button disabled>Next</button>
          </div>
        </div>
      </div>
    </section>
  );
}
