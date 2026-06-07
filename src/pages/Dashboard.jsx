import { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  exportExpensesCsv,
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

  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData(page = 0) {
    setError("");

    try {
      const expensesResponse = await getExpenses(page, pageInfo.pageSize);
      const summaryResponse = await getTotalSummary();

      const expensesData = expensesResponse.data;

      setExpenses(expensesData.content || []);

      setPageInfo({
        pageNumber: expensesData.pageNumber,
        pageSize: expensesData.pageSize,
        totalElements: expensesData.totalElements,
        totalPages: expensesData.totalPages,
        last: expensesData.last,
      });

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

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

  async function handleExportCsv() {
    setMessage("");
    setError("");

    try {
      const response = await exportExpensesCsv();

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "expenses.csv";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("CSV exported successfully.");
    } catch (err) {
      console.error("CSV export error:", err);

      const errorMessage =
        err.response?.data?.message || "Failed to export CSV.";

      setError(errorMessage);
    }
  }

  function handlePreviousPage() {
    if (pageInfo.pageNumber > 0) {
      fetchDashboardData(pageInfo.pageNumber - 1);
    }
  }

  function handleNextPage() {
    if (!pageInfo.last) {
      fetchDashboardData(pageInfo.pageNumber + 1);
    }
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Track, manage, and analyze your daily expenses.</p>
        </div>

        <button className="header-action-btn" onClick={handleExportCsv}>
          Export CSV
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="stats-grid">
        <div className="summary-card">
          <span className="summary-label">Total Expense</span>
          <p>₹{summary}</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Total Records</span>
          <p>{pageInfo.totalElements}</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Current Page</span>
          <p>{pageInfo.pageNumber + 1}</p>
        </div>
      </div>

      <div className="form-card">
        <div className="section-header">
          <div>
            <h3>{editingExpenseId ? "Update Expense" : "Add Expense"}</h3>
            <p>
              {editingExpenseId
                ? "Modify the selected expense details."
                : "Record a new expense with category and date."}
            </p>
          </div>
        </div>

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

          <button
            type="button"
            className="danger-btn"
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="section-header">
          <div>
            <h3>Recent Expenses</h3>
            <p>View, edit, delete, and filter your expense records.</p>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <h4>No expenses found</h4>
            <p>Add your first expense or clear the current filter.</p>
          </div>
        ) : (
          <>
            <div className="pagination">
              <button
                className="secondary-btn"
                onClick={handlePreviousPage}
                disabled={pageInfo.pageNumber === 0}
              >
                Previous
              </button>

              <span>
                Page {pageInfo.pageNumber + 1} of {pageInfo.totalPages}
              </span>

              <button
                className="secondary-btn"
                onClick={handleNextPage}
                disabled={pageInfo.last}
              >
                Next
              </button>
            </div>

            <table className="expense-table">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{pageInfo.pageNumber * pageInfo.pageSize + index + 1}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>₹{expense.amount}</td>
                    <td>{expense.expenseDate}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
