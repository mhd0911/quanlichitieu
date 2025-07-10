// script.js
function switchToRegister() {
  document.getElementById("registerBox").style.display = "block";
}

// document.getElementById("transactionForm")?.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const amount = document.getElementById("amount").value;
//   const type = document.getElementById("type").value;
//   const category = document.getElementById("category").value;
//   const date = document.getElementById("date").value;
//   const note = document.getElementById("note").value;

//   const row = `<tr>
//     <td>${date}</td>
//     <td>${type}</td>
//     <td>${category}</td>
//     <td>${amount}</td>
//     <td>${note}</td>
//   </tr>`;

//   document.querySelector("#transactionTable tbody").innerHTML += row;

//   // Reset form
//   e.target.reset();
// });
document.getElementById("loginBtn")?.addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(result => {
      if (result.token) {
        // ✅ Lưu token và user ID vào localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user_id", result.user_id);

        // ✅ Chuyển sang dashboard
        window.location.href = "dashboard.html";
      } else {
        alert(result.message || "Đăng nhập thất bại");
      }
    })
    .catch(err => {
      console.error("Lỗi kết nối:", err);
      alert("Không thể kết nối đến server.");
    });
});
let totalIncome = 0;
let totalExpense = 0;

data.forEach(tran => {
  if (tran.type === 'income') {
    totalIncome += parseFloat(tran.amount);
  } else {
    totalExpense += parseFloat(tran.amount);
  }


});
document.getElementById("totalIncome").textContent = totalIncome.toLocaleString();
document.getElementById("totalExpense").textContent = totalExpense.toLocaleString();

// Hiển thị tháng hiện tại
const month = new Date().getMonth() + 1;
document.getElementById("currentMonth").textContent = month;
const ctx = document.getElementById('pieChart').getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Thu nhập', 'Chi tiêu'],
    datasets: [{
      data: [totalIncome, totalExpense],
      backgroundColor: ['#4caf50', '#f44336']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Phân bổ thu vs chi' }
    }
  }
});
function filterByDate() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const userId = localStorage.getItem("user_id");

  if (!start || !end) {
    alert("Vui lòng chọn cả hai ngày");
    return;
  }

  fetch(`http://localhost:3000/api/transactions?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#transactionTable tbody");
      tbody.innerHTML = "";

      let totalIncome = 0;
      let totalExpense = 0;

      data.forEach(tran => {
        if (tran.date >= start && tran.date <= end) {
          const row = `<tr>
            <td>${tran.date}</td>
            <td>${tran.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}</td>
            <td>${tran.category}</td>
            <td>${parseFloat(tran.amount).toLocaleString()}</td>
            <td>${tran.note}</td>
            <td>
              <button onclick="editTransaction(${tran.id}, '${tran.type}', '${tran.category}', ${tran.amount}, \`${tran.note}\`, '${tran.date}')">📝</button>
              <button onclick="deleteTransaction(${tran.id})">🗑️</button>
            </td>
          </tr>`;
          tbody.innerHTML += row;

          // Cộng dồn
          if (tran.type === 'income') totalIncome += parseFloat(tran.amount);
          else totalExpense += parseFloat(tran.amount);
        }
      });

      document.getElementById("totalIncome").textContent = totalIncome.toLocaleString();
      document.getElementById("totalExpense").textContent = totalExpense.toLocaleString();
    });
}
const express = require('express');
const cors = require('cors'); // Thêm dòng này
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500/chi-tieu-app/login.html' // Chỉ cho phép truy cập từ địa chỉ frontend của bạn
}));
app.use(express.json()); // Rất quan trọng để backend đọc được JSON từ request body
// ... các route API của bạn ...