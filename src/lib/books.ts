// Catalogue data for MRV BookHub: the shared book records, the seeded community
// listings and the Central Library copy counts.

const coverModules = import.meta.glob<{ default: { url: string } }>(
  "../assets/covers/*.asset.json",
  { eager: true },
);

const covers: Record<string, string> = {};
for (const [path, mod] of Object.entries(coverModules)) {
  const key = path.split("/").pop()?.replace(".webp.asset.json", "");
  if (key) covers[key] = mod.default.url;
}

export function coverFor(key: string): string | undefined {
  return covers[key];
}

export const DEPARTMENTS = [
  "CSE",
  "AI & ML",
  "IT",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "Mathematics",
  "Physics",
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const CONDITIONS = ["Like New", "Good", "Fair"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const OFFERS = {
  free: "Free to borrow",
  "borrow-or-buy": "Borrow or buy",
  sale: "For sale",
} as const;
export type Offer = keyof typeof OFFERS;

export type Book = {
  id: string;
  code: string;
  title: string;
  author: string;
  edition: string;
  department: Department;
  publisher: string;
  year: number;
  pages: number;
  cover?: string;
  description: string;
};

type BookSeed = Omit<Book, "cover">;

const BOOK_SEEDS: BookSeed[] = [
  { id: "os", code: "CS301", title: "Operating System Concepts", author: "Abraham Silberschatz & Galvin", edition: "10th", department: "CSE", publisher: "Wiley", year: 2018, pages: 976, description: "The classic \"dinosaur book\" — processes, threads, CPU scheduling, memory management, file systems and protection." },
  { id: "clrs", code: "CS302", title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", edition: "4th", department: "CSE", publisher: "MIT Press", year: 2022, pages: 1312, description: "The definitive reference for sorting, graph algorithms, dynamic programming and complexity — known everywhere as CLRS." },
  { id: "dbms", code: "CS303", title: "Database System Concepts", author: "Abraham Silberschatz & Korth", edition: "7th", department: "CSE", publisher: "McGraw Hill", year: 2019, pages: 1376, description: "Relational model, SQL, normalisation, transactions, indexing and query processing for the DBMS course." },
  { id: "cn", code: "CS304", title: "Computer Networks", author: "Andrew S. Tanenbaum", edition: "6th", department: "CSE", publisher: "Pearson", year: 2021, pages: 944, description: "A layer-by-layer tour of networking — from the physical layer up to application protocols and network security." },
  { id: "se", code: "CS305", title: "Software Engineering: A Practitioner's Approach", author: "Roger S. Pressman", edition: "8th", department: "CSE", publisher: "McGraw Hill", year: 2014, pages: 976, description: "Process models, requirements, design, testing and project management for real-world software teams." },
  { id: "python", code: "CS306", title: "Learning Python", author: "Mark Lutz", edition: "6th", department: "CSE", publisher: "O'Reilly", year: 2025, pages: 1600, description: "A thorough, hands-on introduction to the Python language — syntax, types, functions, modules and OOP." },
  { id: "compilers", code: "CS307", title: "Compilers: Principles, Techniques, and Tools", author: "Alfred V. Aho et al.", edition: "2nd", department: "CSE", publisher: "Pearson", year: 2006, pages: 1040, description: "The Dragon Book — lexical analysis, parsing, syntax-directed translation, code generation and optimisation." },
  { id: "coa", code: "CS308", title: "Computer Organization and Design", author: "David A. Patterson & John L. Hennessy", edition: "5th", department: "CSE", publisher: "Morgan Kaufmann", year: 2013, pages: 800, description: "How computers work underneath: instruction sets, arithmetic, the processor, pipelining and memory hierarchy." },
  { id: "dsa", code: "CS309", title: "Data Structures and Algorithms in Java", author: "Michael T. Goodrich & Roberto Tamassia", edition: "6th", department: "CSE", publisher: "Wiley", year: 2014, pages: 736, description: "Lists, trees, heaps, hash tables and graphs implemented clearly in Java, with analysis throughout." },
  { id: "cleancode", code: "CS310", title: "Clean Code", author: "Robert C. Martin", edition: "1st", department: "CSE", publisher: "Prentice Hall", year: 2008, pages: 464, description: "A handbook of agile software craftsmanship — naming, functions, error handling and refactoring." },
  { id: "gof", code: "CS311", title: "Design Patterns", author: "Erich Gamma et al.", edition: "1st", department: "CSE", publisher: "Addison-Wesley", year: 1994, pages: 395, description: "The Gang of Four catalogue of 23 reusable object-oriented design patterns." },
  { id: "ml", code: "AI401", title: "Machine Learning", author: "Tom M. Mitchell", edition: "1st", department: "AI & ML", publisher: "McGraw Hill", year: 1997, pages: 432, description: "Concept learning, decision trees, neural networks, Bayesian learning and reinforcement learning fundamentals." },
  { id: "aima", code: "AI402", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", edition: "4th", department: "AI & ML", publisher: "Pearson", year: 2020, pages: 1136, description: "The standard AI textbook — search, logic, planning, probabilistic reasoning, learning and robotics." },
  { id: "dl", code: "AI403", title: "Deep Learning", author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville", edition: "1st", department: "AI & ML", publisher: "MIT Press", year: 2016, pages: 800, description: "Mathematical foundations and modern practice of deep networks, CNNs, RNNs and generative models." },
  { id: "bishop", code: "AI404", title: "Pattern Recognition and Machine Learning", author: "Christopher M. Bishop", edition: "1st", department: "AI & ML", publisher: "Springer", year: 2006, pages: 738, description: "A Bayesian take on machine learning: graphical models, kernel methods, mixture models and inference." },
  { id: "geron", code: "AI405", title: "Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow", author: "Aurélien Géron", edition: "3rd", department: "AI & ML", publisher: "O'Reilly", year: 2022, pages: 864, description: "Practical, project-driven ML — from linear models to deep learning in production." },
  { id: "java", code: "IT301", title: "Head First Java", author: "Kathy Sierra & Bert Bates", edition: "3rd", department: "IT", publisher: "O'Reilly", year: 2022, pages: 752, description: "A visually rich, brain-friendly introduction to Java and object-oriented programming." },
  { id: "cloud", code: "IT302", title: "Mastering Cloud Computing", author: "Rajkumar Buyya et al.", edition: "1st", department: "IT", publisher: "McGraw Hill", year: 2013, pages: 468, description: "Virtualisation, cloud architectures, Aneka, and data-intensive computing on the cloud." },
  { id: "crypto", code: "IT303", title: "Cryptography and Network Security", author: "William Stallings", edition: "7th", department: "IT", publisher: "Pearson", year: 2017, pages: 768, description: "Symmetric and public-key cryptography, hashing, authentication and network security protocols." },
  { id: "signals", code: "EC301", title: "Signals and Systems", author: "Alan V. Oppenheim & Alan S. Willsky", edition: "2nd", department: "ECE", publisher: "Pearson", year: 1996, pages: 957, description: "Continuous and discrete-time signals, Fourier and Laplace transforms, sampling and the z-transform." },
  { id: "digital", code: "EC302", title: "Digital Design", author: "M. Morris Mano", edition: "5th", department: "ECE", publisher: "Pearson", year: 2012, pages: 576, description: "Boolean algebra, combinational and sequential logic, registers, memory and HDL basics." },
  { id: "sedra", code: "EC303", title: "Microelectronic Circuits", author: "Adel S. Sedra & Kenneth C. Smith", edition: "7th", department: "ECE", publisher: "Oxford", year: 2014, pages: 1488, description: "Diodes, BJTs, MOSFETs, amplifiers, op-amps and frequency response — the analog electronics staple." },
  { id: "circuits", code: "EE301", title: "Fundamentals of Electric Circuits", author: "Charles Alexander & Matthew Sadiku", edition: "7th", department: "EEE", publisher: "McGraw Hill", year: 2020, pages: 992, description: "DC and AC circuit analysis, network theorems, transients and two-port networks." },
  { id: "thermo", code: "ME301", title: "Thermodynamics: An Engineering Approach", author: "Yunus A. Cengel", edition: "10th", department: "Mechanical", publisher: "McGraw Hill", year: 2023, pages: 1056, description: "Energy, entropy, power and refrigeration cycles explained with countless engineering examples." },
  { id: "mechanics", code: "ME302", title: "Vector Mechanics for Engineers", author: "Ferdinand P. Beer & E. Russell Johnston", edition: "12th", department: "Mechanical", publisher: "McGraw Hill", year: 2018, pages: 1408, description: "Statics and dynamics — equilibrium, friction, kinematics and kinetics of particles and rigid bodies." },
  { id: "fluid", code: "ME303", title: "Fluid Mechanics", author: "Frank M. White", edition: "8th", department: "Mechanical", publisher: "McGraw Hill", year: 2015, pages: 864, description: "Fluid statics, Bernoulli, dimensional analysis, viscous and compressible flow." },
  { id: "strength", code: "ME304", title: "Mechanics of Materials", author: "R. C. Hibbeler", edition: "10th", department: "Mechanical", publisher: "Pearson", year: 2016, pages: 896, description: "Stress, strain, torsion, bending and deflection of beams and shafts." },
  { id: "concrete", code: "CE301", title: "Concrete Technology", author: "M. S. Shetty", edition: "Revised", department: "Civil", publisher: "S. Chand", year: 2019, pages: 728, description: "Cement, aggregates, admixtures, mix design and testing of concrete — theory and practice." },
  { id: "structural", code: "CE302", title: "Structural Analysis", author: "R. C. Hibbeler", edition: "10th", department: "Civil", publisher: "Pearson", year: 2017, pages: 720, description: "Trusses, beams, frames, influence lines and the stiffness method for structures." },
  { id: "grewal", code: "MA201", title: "Higher Engineering Mathematics", author: "B. S. Grewal", edition: "44th", department: "Mathematics", publisher: "Khanna Publishers", year: 2017, pages: 1238, description: "Calculus, differential equations, linear algebra, complex variables and numerical methods." },
  { id: "kreyszig", code: "MA202", title: "Advanced Engineering Mathematics", author: "Erwin Kreyszig", edition: "10th", department: "Mathematics", publisher: "Wiley", year: 2011, pages: 1280, description: "ODEs, PDEs, linear algebra, vector calculus, Fourier analysis and probability." },
  { id: "halliday", code: "PH101", title: "Fundamentals of Physics", author: "Halliday, Resnick & Walker", edition: "10th", department: "Physics", publisher: "Wiley", year: 2013, pages: 1448, description: "Mechanics, waves, thermodynamics, electromagnetism and modern physics for first-year engineers." },
];

export const BOOKS: Book[] = BOOK_SEEDS.map((b) => {
  const cover = coverFor(b.id);
  return cover ? { ...b, cover } : b;
});

export const BOOKS_BY_ID: Record<string, Book> = Object.fromEntries(BOOKS.map((b) => [b.id, b]));

export function getBook(id: string): Book | undefined {
  return BOOKS_BY_ID[id];
}

/** Finds a catalogue book whose title or course code matches what a user typed. */
export function matchCatalogue(query: string): Book | undefined {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return undefined;
  return BOOKS.find((b) => b.title.toLowerCase() === q || b.code.toLowerCase() === q);
}

/* ---------------- Community listings ---------------- */

export type Listing = {
  id: string;
  bookId?: string;
  title: string;
  author: string;
  code: string;
  department: Department;
  edition: string;
  condition: Condition;
  offer: Offer;
  price?: number;
  cover?: string;
  ownerId: string;
  ownerName: string;
  ownerInfo: string;
  available: boolean;
  createdAt: string;
  notes?: string;
};

type ListingSeed = {
  id: string;
  bookId: string;
  condition: Condition;
  offer: Offer;
  price?: number;
  ownerName: string;
  ownerInfo: string;
  available?: boolean;
  createdAt: string;
  notes?: string;
};

const LISTING_SEEDS: ListingSeed[] = [
  { id: "l-os", bookId: "os", condition: "Good", offer: "free", ownerName: "Aarav Reddy", ownerInfo: "CSE · 3rd year", createdAt: "2026-11-19T10:00:00Z", notes: "Light pencil notes in chapters 5–7. Happy to lend for the whole semester." },
  { id: "l-clrs", bookId: "clrs", condition: "Like New", offer: "borrow-or-buy", price: 950, ownerName: "Sneha Kulkarni", ownerInfo: "CSE · 4th year", createdAt: "2026-11-18T14:30:00Z", notes: "Barely used, no highlights." },
  { id: "l-dbms", bookId: "dbms", condition: "Fair", offer: "free", ownerName: "Rahul Varma", ownerInfo: "CSE · 3rd year", available: false, createdAt: "2026-11-17T09:15:00Z", notes: "Currently lent out — back after mid-terms." },
  { id: "l-cn", bookId: "cn", condition: "Good", offer: "free", ownerName: "Priya Sharma", ownerInfo: "CSE · 4th year", createdAt: "2026-11-16T16:45:00Z" },
  { id: "l-ml", bookId: "ml", condition: "Good", offer: "free", ownerName: "Karthik Rao", ownerInfo: "AI & ML · 4th year", createdAt: "2026-11-15T11:00:00Z" },
  { id: "l-aima", bookId: "aima", condition: "Good", offer: "free", ownerName: "Ananya Iyer", ownerInfo: "AI & ML · 3rd year", createdAt: "2026-11-14T13:20:00Z", notes: "Some highlighting in the search and planning chapters." },
  { id: "l-thermo", bookId: "thermo", condition: "Good", offer: "free", ownerName: "Vikram Naidu", ownerInfo: "Mechanical · 4th year", createdAt: "2026-11-13T08:40:00Z" },
  { id: "l-circuits", bookId: "circuits", condition: "Fair", offer: "free", ownerName: "Meghana Gupta", ownerInfo: "EEE · 3rd year", createdAt: "2026-11-12T17:10:00Z", notes: "Cover is worn but every page is intact." },
  { id: "l-python", bookId: "python", condition: "Like New", offer: "borrow-or-buy", price: 700, ownerName: "Rohan Mehta", ownerInfo: "CSE · 2nd year", createdAt: "2026-11-11T12:00:00Z" },
  { id: "l-dl", bookId: "dl", condition: "Like New", offer: "sale", price: 650, ownerName: "Campus Book Store", ownerInfo: "Verified vendor", createdAt: "2026-11-10T10:30:00Z" },
  { id: "l-grewal", bookId: "grewal", condition: "Good", offer: "free", ownerName: "Divya Reddy", ownerInfo: "ECE · 2nd year", createdAt: "2026-11-09T15:00:00Z" },
  { id: "l-java", bookId: "java", condition: "Good", offer: "borrow-or-buy", price: 300, ownerName: "Sai Teja", ownerInfo: "IT · 3rd year", createdAt: "2026-11-08T09:00:00Z" },
  { id: "l-digital", bookId: "digital", condition: "Good", offer: "free", ownerName: "Harika Patel", ownerInfo: "ECE · 3rd year", createdAt: "2026-11-07T14:00:00Z" },
  { id: "l-kreyszig", bookId: "kreyszig", condition: "Fair", offer: "sale", price: 400, ownerName: "Nikhil Joshi", ownerInfo: "Mechanical · 4th year", createdAt: "2026-11-06T11:30:00Z" },
  { id: "l-signals", bookId: "signals", condition: "Good", offer: "free", ownerName: "Lakshmi Prasad", ownerInfo: "ECE · 4th year", createdAt: "2026-11-05T10:00:00Z" },
  { id: "l-cleancode", bookId: "cleancode", condition: "Like New", offer: "borrow-or-buy", price: 350, ownerName: "Arjun Desai", ownerInfo: "IT · 4th year", createdAt: "2026-11-04T16:00:00Z" },
];

export const SEED_LISTINGS: Listing[] = LISTING_SEEDS.map((s) => {
  const book = BOOKS_BY_ID[s.bookId];
  if (!book) throw new Error(`Unknown book ${s.bookId}`);
  const listing: Listing = {
    id: s.id,
    bookId: book.id,
    title: book.title,
    author: book.author,
    code: book.code,
    department: book.department,
    edition: book.edition,
    condition: s.condition,
    offer: s.offer,
    ownerId: `seed-${s.id}`,
    ownerName: s.ownerName,
    ownerInfo: s.ownerInfo,
    available: s.available ?? true,
    createdAt: s.createdAt,
  };
  if (book.cover) listing.cover = book.cover;
  if (s.price !== undefined) listing.price = s.price;
  if (s.notes) listing.notes = s.notes;
  return listing;
});

export const FEATURED_LISTING_IDS = [
  "l-os",
  "l-cn",
  "l-ml",
  "l-aima",
  "l-thermo",
  "l-circuits",
  "l-clrs",
  "l-python",
];

/* ---------------- Central Library ---------------- */

export type LibraryEntry = {
  bookId: string;
  total: number;
  reserved: number;
  issued: number;
  shelf: string;
};

const LIBRARY_COUNTS: Record<string, [number, number, number]> = {
  os: [8, 1, 4], clrs: [10, 2, 6], dbms: [6, 0, 6], cn: [7, 1, 3], se: [5, 0, 2],
  python: [4, 0, 1], compilers: [4, 1, 2], coa: [6, 0, 3], dsa: [5, 1, 2], cleancode: [3, 0, 1],
  gof: [3, 0, 3], ml: [5, 1, 2], aima: [6, 2, 3], dl: [4, 1, 3], bishop: [3, 0, 1],
  geron: [5, 1, 2], java: [6, 0, 2], cloud: [4, 0, 1], crypto: [5, 1, 3], signals: [7, 0, 4],
  digital: [8, 1, 3], sedra: [5, 0, 2], circuits: [8, 2, 4], thermo: [9, 1, 5], mechanics: [7, 0, 3],
  fluid: [5, 0, 2], strength: [6, 1, 3], concrete: [6, 0, 2], structural: [5, 0, 2],
  grewal: [12, 2, 7], kreyszig: [8, 1, 4], halliday: [10, 1, 5],
};

const SHELF_PREFIX: Record<Department, string> = {
  CSE: "A",
  "AI & ML": "B",
  IT: "C",
  ECE: "D",
  EEE: "E",
  Mechanical: "F",
  Civil: "G",
  Mathematics: "H",
  Physics: "J",
};

export const LIBRARY: LibraryEntry[] = BOOKS.map((b, i) => {
  const [total, reserved, issued] = LIBRARY_COUNTS[b.id] ?? [4, 0, 1];
  return {
    bookId: b.id,
    total,
    reserved,
    issued,
    shelf: `${SHELF_PREFIX[b.department]}-${String((i % 9) + 1).padStart(2, "0")}`,
  };
});

export const LIBRARY_BY_ID: Record<string, LibraryEntry> = Object.fromEntries(
  LIBRARY.map((e) => [e.bookId, e]),
);

export const ROLES = ["Student", "Faculty", "Librarian", "Vendor", "Admin"] as const;
export type Role = (typeof ROLES)[number];
