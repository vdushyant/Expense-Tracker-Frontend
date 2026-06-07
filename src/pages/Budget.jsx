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

  function extractAmount(text, label) {
    const regex = new RegExp(`${label}\\s*:\\s*₹?\\s*([0-9]+(?:\\.[0-9]+)?)`, "i");
    const match = String(text).match(regex);
    return match ? match[1] : "0";
  }

  function normalizeBudgetStatus(data) {
    const responseText =
      typeof data === "string" ? data : data?.message || data?.statusMessage || "";

    const budgetAmount =
      data?.budgetAmount ??
      data?.monthlyBudget ??
      data?.amount ??
      data?.budget ??
      extractAmount(responseText, "Budget");

    const totalExpense =
      data?.totalExpense ??
      data?.monthlyExpense ??
      data?.totalSpent ??
      data?.expense ??
      data?.spent ??
      extractAmount(responseText, "Expense");

    const remainingAmount =
      data?.remainingAmount ??
      data?.remainingBudget ??
      data?.balance ??
      data?.remaining ??
      extractAmount(responseText, "Remaining");

    const statusText =
      data?.status ??
      (responseText.toLowerCase().includes("exceeded")
        ? "Budget Exceeded"
        : responseText.toLowerCase().includes("safe")
        ? "Budget is safe"
        : responseText.toLowerCase().includes("within")
        ? "Within Budget"
        : Number(remainingAmount) < 0
        ? "Budget Exceeded"
        : "Within Budget");

    return {
      budgetAmount,
      totalExpense,
      remainingAmount,
      status: statusText,
      rawMessage: responseText,
    };
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
      const normalizedStatus = normalizeBudgetStatus(response.data);
      setBudgetStatus(normalizedStatus);
    } catch (err) {
      console.error("Budget status error:", err);

      const errorMessage =
        err.response?.data?.message ||
        Object.values(err.response?.data?.messages || {}).join(", ") ||
        "Failed to fetch budget status.";

      setError(errorMessage);
    }
  }

  const isBudgetExceeded =
    budgetStatus?.status?.toLowerCase().includes("exceed") ||
    Number(budgetStatus?.remainingAmount) < 0;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h2>Budget</h2>
          <p>Set monthly limits and monitor your spending status.</p>
        </div>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-card">
        <div className="section-header">
          <div>
            <h3>Set Monthly Budget</h3>
            <p>Choose a month and define how much you want to spend.</p>
          </div>
        </div>

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
        <div className="section-header">
          <div>
            <h3>Check Budget Status</h3>
            <p>Compare your monthly budget with actual expenses.</p>
          </div>
        </div>

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
        <div className="budget-status-card">
          <div className="section-header">
            <div>
              <h3>Budget Status</h3>
              <p>Your spending summary for month {statusMonth}.</p>
            </div>
          </div>

          <div className="budget-status-grid">
            <div>
              <span>Budget</span>
              <strong>₹{budgetStatus.budgetAmount}</strong>
            </div>

            <div>
              <span>Spent</span>
              <strong>₹{budgetStatus.totalExpense}</strong>
            </div>

            <div>
              <span>Remaining</span>
              <strong>₹{budgetStatus.remainingAmount}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className={isBudgetExceeded ? "status-danger" : "status-safe"}>
                {budgetStatus.status}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;
