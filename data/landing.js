import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

export const statsData = [
  {
    value: "Small Business Owners",
    label:
      "Ditch the spreadsheets! Keep track of your expenses & tax deductions effortlessly.",
  },
  {
    value: "Students",
    label: "Budget like a pro (even if you're surviving on instant noodles).",
  },
  {
    value: "Freelancers",
    label:
      "Lost another receipt? Not anymore. Stay organized and invoice with confidence!",
  },
];

export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-green-600" />,
    title: "Smart Spending Insights",
    description:
      "Ever wondered where all your money goes? Get AI-powered insights that break it down for you—without judgment. 😉",
  },
  {
    icon: <Receipt className="h-8 w-8 text-green-600" />,
    title: "Snap & Store Receipts",
    description:
      "Forget the shoebox full of crumpled receipts. Just snap a pic, and we’ll handle the rest!",
  },
  {
    icon: <PieChart className="h-8 w-8 text-green-600" />,
    title: "Budgeting Made Easy",
    description:
      "Set spending limits (and actually stick to them) with personalized budgeting tools.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-green-600" />,
    title: "All Your Accounts, One Place",
    description:
      "Bank accounts, credit cards, cash—you name it. Keep everything in sync without the headache.",
  },
  {
    icon: <Globe className="h-8 w-8 text-green-600" />,
    title: "Currency Chaos? Not Here.",
    description:
      "Traveling? Freelancing internationally? We auto-convert currencies, so you don’t have to do the math.",
  },
  {
    icon: <Zap className="h-8 w-8 text-green-600" />,
    title: "Personalized Money Hacks",
    description:
      "Get tailored tips to save more, spend smarter, and make your money work for you.",
  },
];
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-green-600" />,
    title: "1. Sign Up & Get Started",
    description:
      "Creating an account is quicker than making a cup of coffee. No complicated forms, no stress!",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-green-600" />,
    title: "2. Link & Track Your Money",
    description:
      "Sync your bank accounts or manually add expenses—either way, we keep tabs on your cash flow in real-time.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-green-600" />,
    title: "3. Get Smarter With Your Money",
    description:
      "Our AI gives you smart recommendations to cut down unnecessary expenses (yes, including that extra latte).",
  },
];
