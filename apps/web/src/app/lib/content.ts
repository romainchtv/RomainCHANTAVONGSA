import "server-only";
import { getDb } from "@/app/lib/db";

export type Experience = {
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

export type Project = {
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

export type Skill = {
  id: number;
  name: string;
  level: string | null;
  category: string | null;
  sort_order: number;
};

export type Education = {
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

export async function fetchAbout(locale: string) {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT content FROM about WHERE locale = ? ORDER BY updated_at DESC, id DESC LIMIT 1",
      [locale]
    );
    const list = rows as { content: string }[];
    return list[0]?.content ?? null;
  } catch {
    return null;
  }
}

export async function fetchExperiences(locale: string) {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, role, company, location, start_date, end_date, is_current, description, sort_order FROM experiences WHERE locale = ? ORDER BY sort_order ASC, start_date DESC, id DESC",
      [locale]
    );
    return rows as Experience[];
  } catch {
    return [] as Experience[];
  }
}

export async function fetchProjects(locale: string) {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, title, subtitle, description, stack, url, image_url, start_date, end_date, sort_order FROM projects WHERE locale = ? ORDER BY sort_order ASC, start_date DESC, id DESC",
      [locale]
    );
    return rows as Project[];
  } catch {
    return [] as Project[];
  }
}

export async function fetchSkills(locale: string) {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, name, level, category, sort_order FROM skills WHERE locale = ? ORDER BY sort_order ASC, id ASC",
      [locale]
    );
    return rows as Skill[];
  } catch {
    return [] as Skill[];
  }
}

export async function fetchEducation(locale: string) {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, school, degree, field, location, start_date, end_date, description, sort_order FROM education WHERE locale = ? ORDER BY sort_order ASC, start_date DESC, id DESC",
      [locale]
    );
    return rows as Education[];
  } catch {
    return [] as Education[];
  }
}
