// src/data/templateData.js
export const templateData = [
  {
    date: "2025-08-28", // This will be replaced by the current date for new users
    categories: [
      {
        id: "cat_template_investments",
        name: "Investments",
        type: "asset",
        subcategories: [
          { id: "sub_template_stocks", name: "e.g., Stocks", value: 10000 },
          { id: "sub_template_401k", name: "e.g., 401k", value: 25000 },
        ],
      },
      {
        id: "cat_template_bank",
        name: "Bank Accounts",
        type: "asset",
        subcategories: [
          { id: "sub_template_checking", name: "e.g., Checking", value: 5000 },
        ],
      },
      {
        id: "cat_template_cc",
        name: "Credit Cards",
        type: "liability",
        subcategories: [
          { id: "sub_template_visa", name: "e.g., Visa Card", value: -1500 },
        ],
      },
    ],
  },
];