import { useState } from "react";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isExpenseReportOpen, setIsExpenseReportOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    { name: "Snacks", date: "2025-05-01", amount: "Rs.100" },
    { name: "Electricity Bill", date: "2025-05-05", amount: "Rs.120" },
    { name: "Tution Fee", date: "2025-05-10", amount: "Rs.5000" },
    { name: "Fuel", date: "2025-05-15", amount: "Rs.2500" },
    { name: "Internet Bill", date: "2025-05-25", amount: "Rs.1000" },
  ]);

  const [expenseName, setExpenseName] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const [isEditing, setIsEditing] = useState(false);    // Track if we are editing
  const [editIndex, setEditIndex] = useState(null);      // Track which expense is being edited

  const handleAddExpenseClick = () => {
    setIsAddExpenseOpen(true);
    setIsEditing(false);        // Reset edit mode
    clearForm();
  };

  const handleCloseAddExpense = () => {
    setIsAddExpenseOpen(false);
    clearForm();
  };

  const handleSaveExpense = () => {
    if (expenseName && expenseDate && expenseAmount) {
      if (isEditing) {
        // Update existing expense
        const updatedExpenses = [...expenses];
        updatedExpenses[editIndex] = {
          name: expenseName,
          date: expenseDate,
          amount: `Rs.${expenseAmount}`,
        };
        setExpenses(updatedExpenses);
      } else {
        // Add new expense
        const newExpense = {
          name: expenseName,
          date: expenseDate,
          amount: `Rs.${expenseAmount}`,
        };
        setExpenses([...expenses, newExpense]);
      }
      setIsAddExpenseOpen(false);
      clearForm();
    } else {
      alert("Please fill all fields!");
    }
  };

  const handleEditExpense = (index) => {
    const expenseToEdit = expenses[index];
    setExpenseName(expenseToEdit.name);
    setExpenseDate(expenseToEdit.date);
    setExpenseAmount(expenseToEdit.amount.replace("Rs.", ""));
    setIsEditing(true);
    setEditIndex(index);
    setIsAddExpenseOpen(true);
  };

  const handleDeleteExpense = (indexToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (confirmDelete) {
      const updatedExpenses = expenses.filter((_, idx) => idx !== indexToDelete);
      setExpenses(updatedExpenses);
    }
  };
  
  const clearForm = () => {
    setExpenseName("");
    setExpenseDate("");
    setExpenseAmount("");
    setEditIndex(null);
  };

  const expenseData = {
    labels: expenses.map((exp) => exp.name),
    datasets: [
      {
        label: "Expense Amount",
        data: expenses.map((exp) => parseFloat(exp.amount.replace("Rs.", ""))),
        backgroundColor: "rgba(74, 144, 226, 0.6)",
        borderColor: "rgba(74, 144, 226, 1)",
        borderWidth: 1,
      },
    ],
  };

  const reportOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expense Report",
      },
    },
  };

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>

      <div className="top-bar">
        <div className="buttons">
          <button className="add-expense" onClick={handleAddExpenseClick}>
            Add Expense
          </button>
          <button className="expense-report" onClick={() => setIsExpenseReportOpen(true)}>
            Expense Report
          </button>
        </div>
        <input className="search-bar" type="text" placeholder="Search" />
      </div>

      {/* Add/Edit Expense Modal */}
      {isAddExpenseOpen && (
        <div className="add-expense-modal">
          <div className="modal-header">
            <FaWindowClose onClick={handleCloseAddExpense} />
          </div>
          <div className="add-expense-form">
            <div>
              <label>Expense Name</label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>
            <div>
              <label>Expense Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <button onClick={handleSaveExpense}>
              {isEditing ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </div>
      )}

      {/* Expense Report Modal */}
      {isExpenseReportOpen && (
        <div className="add-expense-modal">
          <div className="modal-header">
            <FaWindowClose onClick={() => setIsExpenseReportOpen(false)} />
          </div>
          <div
            className="expense-report-content"
            style={{
              width: "90%",
              maxWidth: "800px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Bar data={expenseData} options={reportOptions} />
            <div
              style={{
                marginTop: "20px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Total Expenses: ₹
              {expenses.reduce(
                (total, exp) => total + parseFloat(exp.amount.replace("Rs.", "")),
                0
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="expense-card">
        {expenses.map((expense, index) => (
          <div key={index} className="expense-item">
            <span>{expense.name}</span>
            <span>{expense.date}</span>
            <span>{expense.amount}</span>
            <div className="icons">
              <FaTrash onClick={() => handleDeleteExpense(index)} />
              <FaEdit onClick={() => handleEditExpense(index)} style={{ cursor: "pointer" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
