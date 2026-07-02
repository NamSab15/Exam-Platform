import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users – Xebia Exam Platform",
  description: "Manage platform users and bulk-import via CSV",
};

/* ── Shared style constants ─────────────────────────────────────
   Keeps JSX clean while staying token-driven.
   Every colour / radius / spacing references the design-project
   tokens defined in globals.css. */

const btnPrimary = [
  "bg-primary text-primary-foreground rounded-md py-2 px-4",
  "font-medium text-[14px] leading-[20px]",
  "transition-colors hover:bg-primary/80",
  "border-none outline-none cursor-pointer",
].join(" ");

const btnSecondary = [
  "bg-background text-foreground border border-border rounded-md py-2 px-4",
  "font-medium text-[14px] leading-[20px]",
  "transition-colors hover:bg-muted hover:border-primary",
  "cursor-pointer",
].join(" ");

const inputBase = [
  "border border-border rounded-md py-2 px-3",
  "text-[14px] outline-none bg-background text-foreground",
  "transition-all focus:border-primary",
  "focus-visible:ring-2 focus-visible:ring-primary/20",
].join(" ");

/* ── Sample data (static for now) ───────────────────────────── */

const users = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@northbridge.edu",
    role: "Exam Creator",
    status: "Active" as const,
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@northbridge.edu",
    role: "Candidate",
    status: "Active" as const,
  },
  {
    name: "Lena Fischer",
    email: "lena.fischer@northbridge.edu",
    role: "Proctor",
    status: "Deactivated" as const,
  },
];

const csvPreviewRows = [
  { line: 1, name: "David Chen", email: "david.c@northbridge.edu", role: "Candidate", error: null },
  { line: 2, name: "Sarah Jones", email: "sarah.jones", role: "Proctor", error: "invalid email format" },
  { line: 3, name: "Mike Smith", email: "m.smith@northbridge.edu", role: "Admin", error: "invalid role (use Exam Creator, Candidate, or Proctor)" },
];

/* ── Page component ─────────────────────────────────────────── */

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-background p-8 flex justify-center text-foreground">
      <div className="w-full max-w-[1280px] flex flex-col gap-5">

        {/* ── Header ───────────────────────────────────────── */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-foreground font-semibold text-[32px] leading-[40px] tracking-[-0.02em]">
              Users
            </h1>
            <p className="text-muted-foreground text-[14px] leading-[20px] mt-1">
              northbridge-university · 247 users
            </p>
          </div>
          <div className="flex gap-3">
            <button className={`${btnSecondary} flex items-center gap-2`}>
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add user
            </button>
            <button className={`${btnPrimary} flex items-center gap-2`}>
              Bulk import (CSV)
            </button>
          </div>
        </section>

        {/* ── Filter row ───────────────────────────────────── */}
        <section className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">
              search
            </span>
            <input
              className={`${inputBase} w-full pl-10`}
              placeholder="Search by name / email"
              type="text"
            />
          </div>

          <select className={`${inputBase} text-foreground min-w-[150px] cursor-pointer`}>
            <option>Role: All</option>
            <option>Exam Creator</option>
            <option>Candidate</option>
            <option>Proctor</option>
          </select>

          <select className={`${inputBase} text-foreground min-w-[150px] cursor-pointer`}>
            <option>Status: All</option>
            <option>Active</option>
            <option>Deactivated</option>
          </select>
        </section>

        {/* ── Data table ───────────────────────────────────── */}
        <section className="border border-border rounded-lg overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-[12px] leading-[16px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-border accent-primary"
                    />
                  </th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-[14px] leading-[20px] text-foreground">
                {users.map((user) => {
                  const isActive = user.status === "Active";
                  return (
                    <tr
                      key={user.email}
                      className={[
                        "border-b border-border border-l-2 border-l-transparent",
                        "transition-colors hover:bg-muted hover:border-l-primary",
                        !isActive && "bg-muted/30",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-border accent-primary"
                        />
                      </td>
                      <td className={`p-4 font-medium ${!isActive ? "text-muted-foreground" : ""}`}>
                        {user.name}
                      </td>
                      <td className={`p-4 text-muted-foreground ${!isActive ? "opacity-70" : ""}`}>
                        {user.email}
                      </td>
                      <td className={`p-4 ${!isActive ? "text-muted-foreground opacity-70" : ""}`}>
                        {user.role}
                      </td>
                      <td className="p-4">
                        <span
                          className={`flex items-center gap-1 ${
                            isActive ? "text-green-700 font-semibold" : "text-destructive"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isActive ? "bg-green-700" : "bg-destructive"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-muted-foreground hover:text-primary transition-colors text-[12px] font-medium">
                          Edit
                        </button>
                        <span className="text-border mx-1">·</span>
                        {isActive ? (
                          <button className="text-muted-foreground hover:text-destructive transition-colors text-[12px] font-medium">
                            Deactivate
                          </button>
                        ) : (
                          <button className="text-muted-foreground hover:text-green-700 transition-colors text-[12px] font-medium">
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Ellipsis row */}
                <tr className="border-t border-border">
                  <td colSpan={6} className="p-4 text-center">
                    <span className="text-border font-bold tracking-[0.2em]">
                      ···
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-muted-foreground text-xs px-1">
          Deactivated users keep their data &amp; audit history — never deleted.
        </p>

        {/* ── Bulk import panel ────────────────────────────── */}
        <section className="mt-4 mb-8">
          <h2 className="text-foreground text-lg font-medium mb-4">
            Bulk import panel
          </h2>

          <div className="border border-dashed border-border rounded-md p-6 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Dropzone */}
              <div className="border border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center bg-muted/50 hover:bg-muted transition-colors cursor-pointer min-h-[160px]">
                <span className="material-symbols-outlined text-border text-4xl mb-2">
                  upload_file
                </span>
                <p className="text-foreground font-medium text-md">
                  Drag CSV file here
                </p>
                <p className="text-muted-foreground text-[14px] mt-1">or click to browse</p>
              </div>

              {/* Instructions */}
              <div className="flex flex-col justify-center">
                <h3 className="text-foreground text-[14px] font-medium mb-2">
                  Required columns
                </h3>
                <div className="flex gap-2 flex-wrap mb-4">
                  {["name", "email", "role"].map((col) => (
                    <span
                      key={col}
                      className="bg-muted border border-border rounded px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {col}
                    </span>
                  ))}
                </div>
                <a
                  className="text-primary hover:underline text-[14px] font-medium flex items-center gap-1 w-fit"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    download
                  </span>
                  Download template
                </a>
              </div>
            </div>

            {/* CSV preview */}
            <div className="bg-muted border border-border rounded-lg overflow-hidden mb-6">
              <div className="p-3 border-b border-border bg-background text-[14px] font-medium text-foreground">
                Preview before confirming
              </div>
              <div className="p-4 font-mono text-xs flex flex-col gap-2 overflow-x-auto whitespace-nowrap">
                {csvPreviewRows.map((row) =>
                  row.error ? (
                    <div
                      key={row.line}
                      className="flex gap-4 text-destructive bg-destructive/10 p-2 rounded border border-destructive/20"
                    >
                      <span className="w-6 text-center opacity-50">
                        {row.line}
                      </span>
                      <span className="w-32 truncate">{row.name}</span>
                      <span className="w-48 truncate">{row.email}</span>
                      <span className="w-24">{row.role}</span>
                      <span className="font-medium">— {row.error}</span>
                    </div>
                  ) : (
                    <div
                      key={row.line}
                      className="flex gap-4 text-muted-foreground p-2 rounded hover:bg-background transition-colors"
                    >
                      <span className="w-6 text-center text-border">
                        {row.line}
                      </span>
                      <span className="w-32 truncate">{row.name}</span>
                      <span className="w-48 truncate">{row.email}</span>
                      <span className="w-24">{row.role}</span>
                      <span className="text-green-700">
                        <span className="material-symbols-outlined text-[14px] align-middle">
                          check_circle
                        </span>
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border pt-6">
              <p className="text-destructive text-[14px] leading-[20px] font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                2 of 247 rows have errors — fix in file and re-upload, or skip
                them.
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className={`${btnSecondary} flex-1 sm:flex-none`}>
                  Cancel
                </button>
                <button className={`${btnPrimary} flex-1 sm:flex-none`}>
                  Import valid rows
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
