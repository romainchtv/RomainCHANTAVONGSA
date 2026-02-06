"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en";

type Experience = {
  id: number;
  role: string;
  company: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: number;
  description: string | null;
  sort_order: number;
};

type Project = {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  stack: string | null;
  url: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
};

type Skill = {
  id: number;
  name: string;
  level: string | null;
  category: string | null;
  sort_order: number;
};

type Education = {
  id: number;
  school: string;
  degree: string | null;
  field: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
};

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const emptyExperience = {
  id: 0,
  role: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: 0,
  description: "",
  sort_order: 0
};

const emptyProject = {
  id: 0,
  title: "",
  subtitle: "",
  description: "",
  stack: "",
  url: "",
  image_url: "",
  start_date: "",
  end_date: "",
  sort_order: 0
};

const emptySkill = {
  id: 0,
  name: "",
  level: "",
  category: "",
  sort_order: 0
};

const emptyEducation = {
  id: 0,
  school: "",
  degree: "",
  field: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
  sort_order: 0
};

export default function AdminPanel() {
  const [lang, setLang] = useState<Lang>("fr");
  const [about, setAbout] = useState("");
  const [aboutId, setAboutId] = useState<number | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const langLabel = useMemo(() => (lang === "fr" ? "FR" : "EN"), [lang]);

  async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Fetch failed");
    }
    return res.json();
  }

  async function refresh() {
    const [aboutRes, expRes, projRes, skillRes, eduRes, contactRes] = await Promise.all([
      fetchJson<{ item: { id: number; content: string } | null }>(
        `/api/about?lang=${lang}`
      ),
      fetchJson<{ items: Experience[] }>(`/api/experiences?lang=${lang}`),
      fetchJson<{ items: Project[] }>(`/api/projects?lang=${lang}`),
      fetchJson<{ items: Skill[] }>(`/api/skills?lang=${lang}`),
      fetchJson<{ items: Education[] }>(`/api/education?lang=${lang}`),
      fetchJson<{ items: Contact[] }>("/api/contacts")
    ]);

    setAbout(aboutRes.item?.content ?? "");
    setAboutId(aboutRes.item?.id ?? null);
    setExperiences(expRes.items ?? []);
    setProjects(projRes.items ?? []);
    setSkills(skillRes.items ?? []);
    setEducation(eduRes.items ?? []);
    setContacts(contactRes.items ?? []);
  }

  useEffect(() => {
    refresh();
  }, [lang]);

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  async function saveAbout() {
    const body = { locale: lang, content: about };
    const res = await fetch("/api/about", {
      method: aboutId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aboutId ? { ...body, id: aboutId } : body)
    });
    if (res.ok) {
      await refresh();
    }
  }

  async function saveExperience() {
    const payload = {
      id: experienceForm.id,
      locale: lang,
      role: experienceForm.role,
      company: experienceForm.company,
      location: experienceForm.location || null,
      description: experienceForm.description || null,
      startDate: experienceForm.start_date || null,
      endDate: experienceForm.end_date || null,
      isCurrent: Boolean(experienceForm.is_current),
      sortOrder: Number(experienceForm.sort_order || 0)
    };

    const res = await fetch("/api/experiences", {
      method: experienceForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setExperienceForm(emptyExperience);
      await refresh();
    }
  }

  async function deleteExperience(id: number) {
    const res = await fetch(`/api/experiences?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    }
  }

  async function saveProject() {
    const payload = {
      id: projectForm.id,
      locale: lang,
      title: projectForm.title,
      subtitle: projectForm.subtitle || null,
      description: projectForm.description || null,
      stack: projectForm.stack || null,
      url: projectForm.url || null,
      imageUrl: projectForm.image_url || null,
      startDate: projectForm.start_date || null,
      endDate: projectForm.end_date || null,
      sortOrder: Number(projectForm.sort_order || 0)
    };

    const res = await fetch("/api/projects", {
      method: projectForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setProjectForm(emptyProject);
      await refresh();
    }
  }

  async function deleteProject(id: number) {
    const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Upload failed");
      }
      setProjectForm({ ...projectForm, image_url: data.url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveSkill() {
    const payload = {
      id: skillForm.id,
      locale: lang,
      name: skillForm.name,
      level: skillForm.level || null,
      category: skillForm.category || null,
      sortOrder: Number(skillForm.sort_order || 0)
    };

    const res = await fetch("/api/skills", {
      method: skillForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setSkillForm(emptySkill);
      await refresh();
    }
  }

  async function deleteSkill(id: number) {
    const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    }
  }

  async function saveEducation() {
    const payload = {
      id: educationForm.id,
      locale: lang,
      school: educationForm.school,
      degree: educationForm.degree || null,
      field: educationForm.field || null,
      location: educationForm.location || null,
      description: educationForm.description || null,
      startDate: educationForm.start_date || null,
      endDate: educationForm.end_date || null,
      sortOrder: Number(educationForm.sort_order || 0)
    };

    const res = await fetch("/api/education", {
      method: educationForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setEducationForm(emptyEducation);
      await refresh();
    }
  }

  async function deleteEducation(id: number) {
    const res = await fetch(`/api/education?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    }
  }

  async function deleteContact(id: number) {
    const res = await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await refresh();
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Langue</span>
          <button
            type="button"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.24em]"
          >
            {langLabel}
          </button>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-200"
        >
          Logout
        </button>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6">
        <h2 className="text-lg font-semibold">Messages</h2>
        {contacts.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-400">Aucun message.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {contacts.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">{item.name}</div>
                  <button
                    type="button"
                    onClick={() => deleteContact(item.id)}
                    className="rounded-full border border-red-800 px-3 py-1 text-xs text-red-300"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-zinc-400">{item.email}</div>
                <p className="mt-2 text-zinc-300">{item.message}</p>
                <div className="mt-2 text-xs text-zinc-500">
                  {item.created_at}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6">
        <h2 className="text-lg font-semibold">A propos</h2>
        <textarea
          value={about}
          onChange={(event) => setAbout(event.target.value)}
          className="mt-4 min-h-[140px] w-full rounded-lg border border-zinc-800 bg-black/40 p-3 text-sm text-white"
        />
        <button
          type="button"
          onClick={saveAbout}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900"
        >
          Enregistrer
        </button>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6">
        <h2 className="text-lg font-semibold">Experiences</h2>
        <div className="mt-4 grid gap-3">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm"
            >
              <div>
                <div className="font-medium">{item.role}</div>
                <div className="text-zinc-400">{item.company}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setExperienceForm({
                      id: item.id,
                      role: item.role,
                      company: item.company,
                      location: item.location ?? "",
                      start_date: item.start_date ?? "",
                      end_date: item.end_date ?? "",
                      is_current: item.is_current,
                      description: item.description ?? "",
                      sort_order: item.sort_order
                    })
                  }
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteExperience(item.id)}
                  className="rounded-full border border-red-800 px-3 py-1 text-xs text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Role"
            value={experienceForm.role}
            onChange={(event) =>
              setExperienceForm({ ...experienceForm, role: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Company"
            value={experienceForm.company}
            onChange={(event) =>
              setExperienceForm({
                ...experienceForm,
                company: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Location"
            value={experienceForm.location}
            onChange={(event) =>
              setExperienceForm({
                ...experienceForm,
                location: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={experienceForm.start_date}
            onChange={(event) =>
              setExperienceForm({
                ...experienceForm,
                start_date: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={experienceForm.end_date}
            onChange={(event) =>
              setExperienceForm({
                ...experienceForm,
                end_date: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={Boolean(experienceForm.is_current)}
              onChange={(event) =>
                setExperienceForm({
                  ...experienceForm,
                  is_current: event.target.checked ? 1 : 0
                })
              }
            />
            Current
          </label>
          <textarea
            placeholder="Description"
            value={experienceForm.description}
            onChange={(event) =>
              setExperienceForm({
                ...experienceForm,
                description: event.target.value
              })
            }
            className="sm:col-span-2 min-h-[90px] rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Sort"
            value={experienceForm.sort_order}
            onChange={(event) =>
              setExperienceForm({
                ...experienceForm,
                sort_order: Number(event.target.value)
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={saveExperience}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setExperienceForm(emptyExperience)}
            className="rounded-full border border-zinc-700 px-5 py-2 text-sm"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div className="mt-4 grid gap-3">
          {projects.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm"
            >
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-zinc-400">{item.subtitle}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setProjectForm({
                      id: item.id,
                      title: item.title,
                      subtitle: item.subtitle ?? "",
                      description: item.description ?? "",
                      stack: item.stack ?? "",
                      url: item.url ?? "",
                      image_url: item.image_url ?? "",
                      start_date: item.start_date ?? "",
                      end_date: item.end_date ?? "",
                      sort_order: item.sort_order
                    })
                  }
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteProject(item.id)}
                  className="rounded-full border border-red-800 px-3 py-1 text-xs text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Title"
            value={projectForm.title}
            onChange={(event) =>
              setProjectForm({ ...projectForm, title: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Subtitle"
            value={projectForm.subtitle}
            onChange={(event) =>
              setProjectForm({ ...projectForm, subtitle: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="URL"
            value={projectForm.url}
            onChange={(event) =>
              setProjectForm({ ...projectForm, url: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Stack"
            value={projectForm.stack}
            onChange={(event) =>
              setProjectForm({ ...projectForm, stack: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            value={projectForm.description}
            onChange={(event) =>
              setProjectForm({
                ...projectForm,
                description: event.target.value
              })
            }
            className="sm:col-span-2 min-h-[90px] rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Image URL"
            value={projectForm.image_url}
            onChange={(event) =>
              setProjectForm({ ...projectForm, image_url: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadImage(file);
                }
              }}
              className="text-xs text-zinc-300"
            />
            {uploading ? (
              <span className="text-xs text-zinc-400">Uploading...</span>
            ) : null}
            {uploadError ? (
              <span className="text-xs text-red-300">{uploadError}</span>
            ) : null}
            {projectForm.image_url ? (
              <img
                src={projectForm.image_url}
                alt="Preview"
                className="mt-2 w-24 rounded-lg border border-zinc-800"
              />
            ) : null}
          </div>
          <input
            type="date"
            value={projectForm.start_date}
            onChange={(event) =>
              setProjectForm({
                ...projectForm,
                start_date: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={projectForm.end_date}
            onChange={(event) =>
              setProjectForm({
                ...projectForm,
                end_date: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Sort"
            value={projectForm.sort_order}
            onChange={(event) =>
              setProjectForm({
                ...projectForm,
                sort_order: Number(event.target.value)
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={saveProject}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setProjectForm(emptyProject)}
            className="rounded-full border border-zinc-700 px-5 py-2 text-sm"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setSkillForm({
                  id: item.id,
                  name: item.name,
                  level: item.level ?? "",
                  category: item.category ?? "",
                  sort_order: item.sort_order
                })
              }
              className="rounded-full border border-zinc-800 px-3 py-1 text-xs"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Name"
            value={skillForm.name}
            onChange={(event) =>
              setSkillForm({ ...skillForm, name: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Level"
            value={skillForm.level}
            onChange={(event) =>
              setSkillForm({ ...skillForm, level: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Category"
            value={skillForm.category}
            onChange={(event) =>
              setSkillForm({ ...skillForm, category: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Sort"
            value={skillForm.sort_order}
            onChange={(event) =>
              setSkillForm({
                ...skillForm,
                sort_order: Number(event.target.value)
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={saveSkill}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setSkillForm(emptySkill)}
            className="rounded-full border border-zinc-700 px-5 py-2 text-sm"
          >
            Clear
          </button>
          {skillForm.id ? (
            <button
              type="button"
              onClick={() => deleteSkill(skillForm.id)}
              className="rounded-full border border-red-800 px-5 py-2 text-sm text-red-300"
            >
              Delete
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6">
        <h2 className="text-lg font-semibold">Education</h2>
        <div className="mt-4 grid gap-3">
          {education.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm"
            >
              <div>
                <div className="font-medium">{item.school}</div>
                <div className="text-zinc-400">{item.degree}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEducationForm({
                      id: item.id,
                      school: item.school,
                      degree: item.degree ?? "",
                      field: item.field ?? "",
                      location: item.location ?? "",
                      start_date: item.start_date ?? "",
                      end_date: item.end_date ?? "",
                      description: item.description ?? "",
                      sort_order: item.sort_order
                    })
                  }
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteEducation(item.id)}
                  className="rounded-full border border-red-800 px-3 py-1 text-xs text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="School"
            value={educationForm.school}
            onChange={(event) =>
              setEducationForm({ ...educationForm, school: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Degree"
            value={educationForm.degree}
            onChange={(event) =>
              setEducationForm({ ...educationForm, degree: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Field"
            value={educationForm.field}
            onChange={(event) =>
              setEducationForm({ ...educationForm, field: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            placeholder="Location"
            value={educationForm.location}
            onChange={(event) =>
              setEducationForm({ ...educationForm, location: event.target.value })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={educationForm.start_date}
            onChange={(event) =>
              setEducationForm({
                ...educationForm,
                start_date: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={educationForm.end_date}
            onChange={(event) =>
              setEducationForm({
                ...educationForm,
                end_date: event.target.value
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            value={educationForm.description}
            onChange={(event) =>
              setEducationForm({
                ...educationForm,
                description: event.target.value
              })
            }
            className="sm:col-span-2 min-h-[90px] rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Sort"
            value={educationForm.sort_order}
            onChange={(event) =>
              setEducationForm({
                ...educationForm,
                sort_order: Number(event.target.value)
              })
            }
            className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={saveEducation}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEducationForm(emptyEducation)}
            className="rounded-full border border-zinc-700 px-5 py-2 text-sm"
          >
            Clear
          </button>
        </div>
      </section>
    </div>
  );
}
