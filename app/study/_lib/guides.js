import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Lesson files live at: content/guides/<subject>/<course>/<lesson>.md
// Example: content/guides/bdt/bdt-152/suppositories-and-pessaries.md
const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

// Folder names must be lowercase letters, numbers and hyphens only.
const SEGMENT = /^[a-z0-9-]+$/;

export const SUBJECT_NAMES = {
  bdt: "Basic Dispensing Theory",
  aum: "Action and Uses of Medicines",
  ana: "Anatomy and Physiology",
  phc: "Primary Health Care",
  ptp: "Principles of Pharmacy Technician Practice",
};

const SUBJECT_ORDER = Object.keys(SUBJECT_NAMES);

function listDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

// Lessons write large numbers with a space as the thousands separator (1 000).
// Swap that space for a non-breaking space so a number never splits across two
// lines on a small screen. Authors keep writing normal spaces in the files.
function keepNumbersTogether(value) {
  if (typeof value === "string") {
    return value.replace(/(\d) (?=\d{3}(?!\d))/g, "$1 ");
  }
  if (Array.isArray(value)) return value.map(keepNumbersTogether);
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, keepNumbersTogether(v)])
    );
  }
  return value;
}

function readGuide(subject, courseSlug, slug) {
  if (![subject, courseSlug, slug].every((s) => SEGMENT.test(s))) return null;

  const file = path.join(GUIDES_DIR, subject, courseSlug, `${slug}.md`);
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }

  const parsed = matter(raw);
  const data = keepNumbersTogether(parsed.data);
  const content = keepNumbersTogether(parsed.content);

  // Add `draft: true` to a lesson's frontmatter to hide it from the live site.
  // Drafts still show up while you run `npm run dev`, marked as "Draft".
  const isDraft = data.draft === true;
  if (isDraft && process.env.NODE_ENV === "production") return null;

  const keyPoints = toArray(data.keyPoints);

  return {
    id: `${subject}/${courseSlug}/${slug}`,
    href: `/study/${subject}/${courseSlug}/${slug}`,
    subject,
    courseSlug,
    slug,
    draft: isDraft,
    title: data.title || slug,
    courseCode: data.course || courseSlug.toUpperCase().replace("-", " "),
    courseTitle: data.courseTitle || "",
    order: Number(data.order) || 0,
    readingTime: Number(data.readingTime) || null,
    description: data.description || keyPoints[0] || "",
    objectives: toArray(data.objectives),
    keyPoints,
    examFocus: toArray(data.examFocus),
    quickCheck: toArray(data.quickCheck),
    content,
  };
}

export function getGuide(subject, courseSlug, slug) {
  return readGuide(subject, courseSlug, slug);
}

export function getAllGuides() {
  const guides = [];

  for (const subjectDir of listDir(GUIDES_DIR)) {
    if (!subjectDir.isDirectory()) continue;
    const subjectPath = path.join(GUIDES_DIR, subjectDir.name);

    for (const courseDir of listDir(subjectPath)) {
      if (!courseDir.isDirectory()) continue;
      const coursePath = path.join(subjectPath, courseDir.name);

      for (const file of listDir(coursePath)) {
        if (!file.isFile() || !file.name.endsWith(".md")) continue;
        const guide = readGuide(
          subjectDir.name,
          courseDir.name,
          file.name.slice(0, -3)
        );
        if (guide) guides.push(guide);
      }
    }
  }

  return guides.sort(
    (a, b) =>
      a.subject.localeCompare(b.subject) ||
      a.courseSlug.localeCompare(b.courseSlug) ||
      a.order - b.order ||
      a.title.localeCompare(b.title)
  );
}

// Groups every lesson as subject -> course -> lessons, for the index page.
export function getCatalog() {
  const bySubject = new Map();

  for (const guide of getAllGuides()) {
    if (!bySubject.has(guide.subject)) bySubject.set(guide.subject, new Map());
    const courses = bySubject.get(guide.subject);

    if (!courses.has(guide.courseSlug)) {
      courses.set(guide.courseSlug, {
        courseSlug: guide.courseSlug,
        courseCode: guide.courseCode,
        courseTitle: guide.courseTitle,
        guides: [],
      });
    }

    const course = courses.get(guide.courseSlug);
    if (!course.courseTitle && guide.courseTitle) {
      course.courseTitle = guide.courseTitle;
    }
    course.guides.push(guide);
  }

  const rank = (code) => {
    const i = SUBJECT_ORDER.indexOf(code);
    return i === -1 ? SUBJECT_ORDER.length : i;
  };

  return [...bySubject.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([subject, courses]) => ({
      subject,
      subjectCode: subject.toUpperCase(),
      subjectName: SUBJECT_NAMES[subject] || subject.toUpperCase(),
      courses: [...courses.values()],
    }));
}

// Previous and next lesson inside the same course, ordered by `order`.
export function getAdjacentGuides(guide) {
  const siblings = getAllGuides().filter(
    (g) => g.subject === guide.subject && g.courseSlug === guide.courseSlug
  );
  const index = siblings.findIndex((g) => g.id === guide.id);
  return {
    previous: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}
