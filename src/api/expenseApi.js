import api from "./axiosConfig";

export function getExpenses(page = 0, size = 10, sortBy = "id", direction = "asc") {
  return api.get("/expenses", {
    params: {
      page,
      size,
      sortBy,
      direction,
    },
  });
}

export function getExpenseById(id) {
  return api.get(`/expenses/${id}`);
}

export function createExpense(expenseData) {
  return api.post("/expenses", expenseData);
}

export function updateExpense(id, expenseData) {
  return api.put(`/expenses/${id}`, expenseData);
}

export function deleteExpense(id) {
  return api.delete(`/expenses/${id}`);
}

export function getTotalSummary() {
  return api.get("/expenses/summary");
}

export function getMonthlySummary(month) {
  return api.get(`/expenses/summary/month/${month}`);
}

export function getExpensesByCategory(category) {
  return api.get(`/expenses/category/${category}`);
}

export function exportExpensesCsv() {
  return api.get("/expenses/export", {
    responseType: "blob",
  });
}