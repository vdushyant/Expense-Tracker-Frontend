import api from "./axiosConfig";

export function setBudget(budgetData) {
  return api.post("/budgets", budgetData);
}

export function getBudgetByMonth(month) {
  return api.get(`/budgets/month/${month}`);
}

export function getBudgetStatus(month) {
  return api.get(`/budgets/month/${month}/status`);
}