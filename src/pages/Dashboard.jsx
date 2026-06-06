import { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpensesByCategory,
  getTotalSummary,
  updateExpense,
} from "../api/expenseApi";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "",
    expenseDate: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setError("");

    try {
      const expensesResponse = await getExpenses();
      const summaryResponse = await getTotalSummary();

      setExpenses(expensesResponse.data.content || []);
      setSummary(summaryResponse.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      const errorMessage =
        err.response?.data?.message || "Failed to load dashboard data.";

      setError(errorMessage);
    }
  }

  function handleExpenseChange(event) {
    const { name, value } = event.target;

    setExpenseForm({
      ...expenseForm,
      [name]: value,
    });
  }

  async function handleExpenseSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const expenseData = {
        ...expenseForm,
        amount: Number(expenseForm.amount),
      };

      if (editingExpenseId) {
        await updateExpense(editingExpenseId, expenseData);
        setMessage("Expense updated successfully.");
        setEditingExpenseId(null);
      } else {
        await createExpense(expenseData);
        setMessage("Expense added successfully.");
      }

      setExpenseForm({
        description: "",
        amount: "",
        category: "",
        expenseDate: "",
      });

      fetchDashboardData();
    } catch (err) {
      console.error("Create expense error:", err);

      const errorMessage =
        err.response?.data?.message || "Failed to add expense.";

      setError(errorMessage);
    }
  }

    async function handleDeleteExpense(id) {
      const confirmDelete = window.confirm("Are you sure you want to delete this expense?");

      if (!confirmDelete) {
        return;
      }

      setMessage("");
      setError("");

      try {
        await deleteExpense(id);

        setMessage("Expense deleted successfully.");
        fetchDashboardData();
      } catch (err) {
        console.error("Delete expense error:", err);

        const errorMessage =
          err.response?.data?.message || "Failed to delete expense.";

        setError(errorMessage);
      }
    }

    function handleEditExpense(expense) {
      setEditingExpenseId(expense.id);

      setExpenseForm({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        expenseDate: expense.expenseDate,
      });

      setMessage("");
      setError("");
    }

    async function handleCategoryFilter(event) {
  event.preventDefault();

  if (!categoryFilter.trim()) {
    fetchDashboardData();
    return;
  }

  setMessage("");
  setError("");

  try {
    const response = await getExpensesByCategory(categoryFilter.trim());
    setExpenses(response.data || []);
  } catch (err) {
    console.error("Category filter error:", err);

    const errorMessage =
      err.response?.data?.message || "Failed to filter expenses by category.";

    setError(errorMessage);
  }
}

function handleClearFilter() {
  setCategoryFilter("");
  fetchDashboardData();
}

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="summary-card">
        <h3>Total Expense</h3>
        <p>₹{summary}</p>
      </div>

      <div className="form-card">
        <h3>Add Expense</h3>

        <form onSubmit={handleExpenseSubmit} className="expense-form">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={expenseForm.description}
              onChange={handleExpenseChange}
              placeholder="Example: Chicken, petrol, gym"
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={expenseForm.amount}
              onChange={handleExpenseChange}
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={expenseForm.category}
              onChange={handleExpenseChange}
              placeholder="Example: Food, Travel, Fitness"
            />
          </div>

          <div className="form-group">
            <label>Expense Date</label>
            <input
              type="date"
              name="expenseDate"
              value={expenseForm.expenseDate}
              onChange={handleExpenseChange}
            />
          </div>

          <button type="submit" className="primary-btn">
            {editingExpenseId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="filter-card">
  <h3>Filter Expenses</h3>

  <form onSubmit={handleCategoryFilter} className="filter-form">
    <input
      type="text"
      value={categoryFilter}
      onChange={(event) => setCategoryFilter(event.target.value)}
      placeholder="Enter category, e.g. Food"
    />

    <button type="submit" className="secondary-btn">
      Filter
    </button>

    <button type="button" className="danger-btn" onClick={handleClearFilter}>
      Clear
    </button>
  </form>
</div>

      <div className="table-card">
        <h3>Recent Expenses</h3>

        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>₹{expense.amount}</td>
                  <td>{expense.expenseDate}</td>
                  <td>
                    <td>
  <button
    className="secondary-btn"
    onClick={() => handleEditExpense(expense)}
  >
    Edit
  </button>

  <button
    className="danger-btn"
    onClick={() => handleDeleteExpense(expense.id)}
  >
    Delete
  </button>
</td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;