import { useState } from "react";
import { getBudgetStatus, setBudget } from "../api/budgetApi";

function Budget() {
  const [budgetForm, setBudgetForm] = useState({
    month: "",
    amount: "",
  });

  const [statusMonth, setStatusMonth] = useState("");
  const [budgetStatus, setBudgetStatus] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleBudgetChange(event) {
    const { name, value } = event.target;

    setBudgetForm({
      ...budgetForm,
      [name]: value,
    });
  }

  async function handleSetBudget(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setBudgetStatus(null);

    try {
      await setBudget({
        month: Number(budgetForm.month),
        amount: Number(budgetForm.amount),
      });

      setMessage("Budget saved successfully.");

      setBudgetForm({
        month: "",
        amount: "",
      });
    } catch (err) {
      console.error("Set budget error:", err);

      const errorMessage =
        err.response?.data?.message ||
        Object.values(err.response?.data?.messages || {}).join(", ") ||
        "Failed to save budget.";

      setError(errorMessage);
    }
  }

  async function handleCheckStatus(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setBudgetStatus(null);

    try {
      const response = await getBudgetStatus(Number(statusMonth));
      setBudgetStatus(response.data);
    } catch (err) {
      console.error("Budget status error:", err);

      const errorMessage =
        err.response?.data?.message || "Failed to fetch budget status.";

      setError(errorMessage);
    }
  }

  return (
    <div className="dashboard-container">
      <h2>Budget</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-card">
        <h3>Set Monthly Budget</h3>

        <form onSubmit={handleSetBudget} className="budget-form">
          <div className="form-group">
            <label>Month</label>
            <input
              type="number"
              name="month"
              min="1"
              max="12"
              value={budgetForm.month}
              onChange={handleBudgetChange}
              placeholder="1 to 12"
              required
            />
          </div>

          <div className="form-group">
            <label>Budget Amount</label>
            <input
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              value={budgetForm.amount}
              onChange={handleBudgetChange}
              placeholder="Enter budget amount"
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Save Budget
          </button>
        </form>
      </div>

      <div className="form-card">
        <h3>Check Budget Status</h3>

        <form onSubmit={handleCheckStatus} className="budget-form">
          <div className="form-group">
            <label>Month</label>
            <input
              type="number"
              min="1"
              max="12"
              value={statusMonth}
              onChange={(event) => setStatusMonth(event.target.value)}
              placeholder="1 to 12"
              required
            />
          </div>

          <button type="submit" className="secondary-btn">
            Check Status
          </button>
        </form>
      </div>

      {budgetStatus && (
        <div className="summary-card">
          <h3>Budget Status</h3>

          <p>Budget: ₹{budgetStatus.budgetAmount}</p>
          <p>Spent: ₹{budgetStatus.totalExpense}</p>
          <p>Remaining: ₹{budgetStatus.remainingAmount}</p>
          <p>Status: {budgetStatus.status}</p>
        </div>
      )}
    </div>
  );
}

export default Budget;