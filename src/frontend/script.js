const API_URL = 'http://localhost:3000';

let employees = [];

async function loadEmployees() {
    const response = await fetch(`${API_URL}/employees`);
        employees = await response.json();
        displayEmployees(employees);
}

function displayEmployees(employees) {
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.full_name}</td>
            <td>${employee.birth_date}</td>
            <td>${employee.pass_data}</td>
            <td>${employee.phone_number}</td>
            <td>${employee.address}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${employee.hire_date}</td>
            <td>${employee.is_fired ? 'Уволен' : 'Работает'}</td>
        `;
        tbody.appendChild(row);
    });
}

loadEmployees();