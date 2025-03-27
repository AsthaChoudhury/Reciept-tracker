export const defaultCategories = [
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#16a34a", // Green-600
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#0284c7", // Blue-600
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "INCOME",
    color: "#8b5cf6", // Violet-500
    icon: "TrendingUp",
    subcategories: ["Stocks", "Mutual Funds", "Real Estate", "Crypto"],
  },
  {
    id: "business",
    name: "Business",
    type: "INCOME",
    color: "#eab308", // Yellow-500
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental Income",
    type: "INCOME",
    color: "#d97706", // Amber-600
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "INCOME",
    color: "#64748b", // Slate-500
    icon: "Plus",
  },

  // Expense Categories
  {
    id: "housing",
    name: "Housing",
    type: "EXPENSE",
    color: "#b91c1c", // Red-700
    icon: "Home",
    subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "EXPENSE",
    color: "#ea580c", // Orange-600
    icon: "Car",
    subcategories: ["Fuel", "Public Transport", "Repairs", "Parking"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#65a30d", // Lime-600
    icon: "ShoppingCart",
    subcategories: ["Vegetables", "Dairy", "Meat", "Snacks"],
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#0891b2", // Cyan-600
    icon: "Zap",
    subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#9333ea", // Purple-600
    icon: "Film",
    subcategories: ["Movies", "Games", "Streaming", "Concerts"],
  },
  {
    id: "food",
    name: "Food & Dining",
    type: "EXPENSE",
    color: "#e11d48", // Rose-600
    icon: "Utensils",
    subcategories: ["Restaurants", "Takeout", "Coffee", "Desserts"],
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "EXPENSE",
    color: "#db2777", // Pink-600
    icon: "ShoppingBag",
    subcategories: ["Clothing", "Electronics", "Home Goods", "Accessories"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "EXPENSE",
    color: "#0d9488", // Teal-600
    icon: "HeartPulse",
    subcategories: ["Doctor", "Dental", "Pharmacy", "Insurance"],
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#4338ca", // Indigo-600
    icon: "GraduationCap",
    subcategories: ["Tuition", "Books", "Online Courses"],
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "EXPENSE",
    color: "#be185d", // Fuchsia-700
    icon: "Smile",
    subcategories: ["Haircut", "Gym", "Spa", "Skincare"],
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#0369a1", // Sky-700
    icon: "Plane",
    subcategories: ["Flights", "Hotels", "Transport", "Tours"],
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "EXPENSE",
    color: "#475569", // Slate-600
    icon: "Shield",
    subcategories: ["Life", "Home", "Vehicle", "Health"],
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "EXPENSE",
    color: "#e11d48", // Rose-600
    icon: "Gift",
    subcategories: ["Birthday", "Wedding", "Charity"],
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "EXPENSE",
    color: "#7f1d1d", // Red-800
    icon: "Receipt",
    subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    type: "EXPENSE",
    color: "#6366f1", // Indigo-500
    icon: "Clipboard",
    subcategories: ["Netflix", "Spotify", "Amazon Prime"],
  },
  {
    id: "loans",
    name: "Loans",
    type: "EXPENSE",
    color: "#b45309", // Amber-700
    icon: "Bank",
    subcategories: ["Car Loan", "Home Loan", "Student Loan"],
  },
  {
    id: "pets",
    name: "Pets",
    type: "EXPENSE",
    color: "#a21caf", // Fuchsia-700
    icon: "Paw",
    subcategories: ["Vet", "Food", "Accessories"],
  },
  {
    id: "family",
    name: "Family & Kids",
    type: "EXPENSE",
    color: "#c2410c", // Orange-700
    icon: "Users",
    subcategories: ["Daycare", "School Fees", "Toys"],
  },
  {
    id: "investments-expense",
    name: "Investment Expenses",
    type: "EXPENSE",
    color: "#16a34a", // Green-600
    icon: "ChartBar",
    subcategories: ["Stock Fees", "Advisory"],
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    type: "EXPENSE",
    color: "#475569", // Slate-600
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});
