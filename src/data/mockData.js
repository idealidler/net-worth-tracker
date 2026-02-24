// src/data/mockData.js
export const mockData = [
  {
    date: "2026-02-24",
    categories: [
      {
        id: "cat_1", name: "Investments", type: "asset",
        subcategories: [
          { id: "sub_1", name: "Vanguard S&P 500", value: 45200 },
          { id: "sub_2", name: "Company 401k", value: 82500 },
        ],
      },
      {
        id: "cat_2", name: "Bank Accounts", type: "asset",
        subcategories: [
          { id: "sub_3", name: "Chase Checking", value: 4100 },
          { id: "sub_4", name: "Ally High Yield Savings", value: 15000 },
        ],
      },
      {
        id: "cat_3", name: "Credit Cards", type: "liability",
        subcategories: [
          { id: "sub_5", name: "Amex Gold", value: -1250 },
          { id: "sub_6", name: "Chase Sapphire", value: -800 },
        ],
      },
    ],
  },
  {
    date: "2026-01-24", // One month ago
    categories: [
      {
        id: "cat_1", name: "Investments", type: "asset",
        subcategories: [
          { id: "sub_1", name: "Vanguard S&P 500", value: 42000 },
          { id: "sub_2", name: "Company 401k", value: 80000 },
        ],
      },
      {
        id: "cat_2", name: "Bank Accounts", type: "asset",
        subcategories: [
          { id: "sub_3", name: "Chase Checking", value: 3800 },
          { id: "sub_4", name: "Ally High Yield Savings", value: 14000 },
        ],
      },
      {
        id: "cat_3", name: "Credit Cards", type: "liability",
        subcategories: [
          { id: "sub_5", name: "Amex Gold", value: -1500 },
          { id: "sub_6", name: "Chase Sapphire", value: -1100 },
        ],
      },
    ],
  }
];