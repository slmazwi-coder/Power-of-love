export const SCHOOL_INFO = {
  name: "Power of Love Primary School",
  motto: "Moving you higher",
  tagline: "Moving you higher",
  location: "Kokstad, South Africa",
  address: "24 Main Street, Kokstad, 4700, South Africa",
  phone: "+27 (0) 39 727 1234",
  email: "admin@powerofloveprimary.co.za",
  bankDetails: {
    accountName: "Power of Love Trust",
    bank: "FNB",
    branch: "Kokstad",
    branchCode: "220122",
    accountNumber: "62059195480",
    reference: "Learner Name & Surname",
  },
};

export const GRADES = [
  "Grade 1A", "Grade 1B", 
  "Grade 2A", "Grade 2B", 
  "Grade 3A", "Grade 3B", 
  "Grade 4A", "Grade 4B", 
  "Grade 5A", "Grade 5B", 
  "Grade 6A", "Grade 6B", 
  "Grade 7A", "Grade 7B"
];

export const FEES_BY_GRADE: Record<string, { monthly: number; quarterly: number; stationery: string[] }> = {
  "Grade 1A": {
    monthly: 1200,
    quarterly: 3500,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "1x A4 Hardcover Book (192 pages)"],
  },
  "Grade 1B": {
    monthly: 1200,
    quarterly: 3500,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "1x A4 Hardcover Book (192 pages)"],
  },
  "Grade 2A": {
    monthly: 1250,
    quarterly: 3650,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "2x A4 Hardcover Books (192 pages)"],
  },
  "Grade 2B": {
    monthly: 1250,
    quarterly: 3650,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "2x A4 Hardcover Books (192 pages)"],
  },
  "Grade 3A": {
    monthly: 1300,
    quarterly: 3800,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "3x A4 Hardcover Books (192 pages)"],
  },
  "Grade 3B": {
    monthly: 1300,
    quarterly: 3800,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "3x A4 Hardcover Books (192 pages)"],
  },
  "Grade 4A": {
    monthly: 1400,
    quarterly: 4100,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "4x A4 Hardcover Books (192 pages)", "1x Mathematical Set"],
  },
  "Grade 4B": {
    monthly: 1400,
    quarterly: 4100,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "4x A4 Hardcover Books (192 pages)", "1x Mathematical Set"],
  },
  "Grade 5A": {
    monthly: 1450,
    quarterly: 4250,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "5x A4 Hardcover Books (192 pages)", "1x Mathematical Set"],
  },
  "Grade 5B": {
    monthly: 1450,
    quarterly: 4250,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "5x A4 Hardcover Books (192 pages)", "1x Mathematical Set"],
  },
  "Grade 6A": {
    monthly: 1500,
    quarterly: 4400,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "6x A4 Hardcover Books (192 pages)", "1x Mathematical Set"],
  },
  "Grade 6B": {
    monthly: 1500,
    quarterly: 4400,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "6x A4 Hardcover Books (192 pages)", "1x Mathematical Set"],
  },
  "Grade 7A": {
    monthly: 1600,
    quarterly: 4700,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "7x A4 Hardcover Books (192 pages)", "1x Mathematical Set", "1x Scientific Calculator"],
  },
  "Grade 7B": {
    monthly: 1600,
    quarterly: 4700,
    stationery: ["12x HB Pencils", "2x Erasers", "1x 30cm Ruler", "1x Pencil Sharpener", "4x Glue Sticks", "1x Box of Crayons", "1x Scissors", "7x A4 Hardcover Books (192 pages)", "1x Mathematical Set", "1x Scientific Calculator"],
  },
};

export const SPORTS = [
  { name: "Rugby", description: "Building strength and teamwork on the field.", kit: "Navy shorts, school rugby jersey, long navy socks." },
  { name: "Soccer", description: "Developing agility and coordination.", kit: "Navy shorts, school soccer jersey, long navy socks." },
  { name: "Cricket", description: "Precision and patience in every match.", kit: "White cricket trousers/shorts, school cricket shirt." },
  { name: "Netball", description: "Fast-paced teamwork and strategy.", kit: "School netball skirt/dress, navy socks." },
  { name: "Athletics", description: "Speed, endurance, and individual excellence.", kit: "Navy athletic shorts, school vest." },
];

export const ACADEMICS = [
  { name: "Spelling Bee", description: "Enhancing vocabulary and confidence.", participation: "Open to all grades. Annual competition held in Term 2." },
  { name: "Chess", description: "Strategic thinking and mental discipline.", participation: "Weekly club meetings. Inter-school tournaments in Term 3." },
  { name: "Maths Olympiad", description: "Challenging mathematical problem-solving skills.", participation: "Selected students from Grades 4-7 based on Term 1 results." },
];

export const UNIFORM_PRODUCTS = [
  {
    id: "u1",
    name: "School Blazer",
    price: 450,
    category: "Formal",
    description: "Navy blue blazer with school crest.",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "u2",
    name: "White Shirt (Short Sleeve)",
    price: 120,
    category: "Formal",
    description: "Crisp white short-sleeve shirt for daily wear.",
    sizes: ["6-7", "8-9", "10-11", "12-13", "S", "M"],
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "u3",
    name: "Grey Trousers",
    price: 180,
    category: "Formal",
    description: "Durable grey school trousers.",
    sizes: ["24", "26", "28", "30", "32", "34"],
    image: "https://images.unsplash.com/photo-1624371414361-e670edd4898d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "u4",
    name: "School Tie",
    price: 65,
    category: "Accessories",
    description: "Official school tie with navy and gold stripes.",
    sizes: ["Standard"],
    image: "https://images.unsplash.com/photo-1589756823253-173073663a4c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "u5",
    name: "Sports Polo",
    price: 150,
    category: "Sports",
    description: "Breathable navy polo shirt for physical education.",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "u6",
    name: "School Backpack",
    price: 280,
    category: "Accessories",
    description: "Heavy-duty backpack with school logo.",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=800"
  }
];
