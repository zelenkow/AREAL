const API_URL = 'http://localhost:3000';

let employees = [];
let currentEditingId = null;

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingId = null;
}

async function updateEmployee(id, employeeData) {
    const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
    });
    return await response.json();
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);

    if (employee.is_fired) {
        return;
    }
    
    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editFullName').value = employee.full_name;
    document.getElementById('editBirthDate').value = employee.birth_date;
    document.getElementById('editPassData').value = employee.pass_data;
    document.getElementById('ContactInf').value = employee.phone_number;
    document.getElementById('Adress').value = employee.address;
    document.getElementById('editDepartment').value = employee.department;
    document.getElementById('editPosition').value = employee.position;
    document.getElementById('editSalary').value = employee.salary;
    document.getElementById('HireDate').value = employee.hire_date;

    currentEditingId = id;
    document.getElementById('editModal').style.display = 'block';
}

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
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" ${employee.is_fired ? 'disabled' : ''} onclick="editEmployee(${employee.id})">
                        Редактировать
                    </button>
                    <button class="btn-fire" ${employee.is_fired ? 'disabled' : ''} onclick="fireEmployee(${employee.id})">
                        Уволить
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function fireEmployee(id) {
    await fetch(`${API_URL}/employees/${id}/fire`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
    
    loadEmployees();
}

document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        full_name: document.getElementById('editFullName').value,
        birth_date: document.getElementById('editBirthDate').value,
        pass_data: document.getElementById('editPassData').value,
        phone_number: document.getElementById('ContactInf').value,
        address: document.getElementById('Adress').value,
        department: document.getElementById('editDepartment').value,
        position: document.getElementById('editPosition').value,
        salary: parseInt(document.getElementById('editSalary').value),
        hire_date: document.getElementById('HireDate').value
    };

    await updateEmployee(currentEditingId, formData);
    
    closeModal();
    loadEmployees();
});

document.getElementById('cancelEdit').addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
});