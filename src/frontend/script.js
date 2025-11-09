const API_URL = 'http://localhost:3000';

let employees = [];
let currentEditingId = null;

function applyPassportMask(input) {

    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        value = value.substring(0, 10);
        
        let formatted = '';
        if (value.length > 0) {
            formatted += value.substring(0, 2);
        }
        if (value.length > 2) {
            formatted += ' ' + value.substring(2, 4);
        }
        if (value.length > 4) {
            formatted += ' ' + value.substring(4, 10);
        }
        
        input.value = formatted;
    }
}

function applyPhoneMask(input) {
    let value = input.value;
    let hasPlus = value.startsWith('+');
    
    let digits = value.replace(/\D/g, '');
    
    if (hasPlus && digits.length > 0) {
        digits = '+' + digits;
    }
    
    let formatted = '';
    let i = 0;
    
    if (digits.startsWith('+')) {
        formatted += '+';
        i = 1;
        if (digits.length > i) {
            formatted += digits.substring(i, i + 1);
            i += 1;
        }
    } else if (digits.length > 0) {
        formatted += '+7';
        if (digits.length > 0) {
            formatted += digits.substring(0, 1);
            i = 1;
        }
    }
    
    if (digits.length > i) {
        formatted += ' (' + digits.substring(i, i + 3);
        i += 3;
    }
    if (digits.length > i) {
        formatted += ') ' + digits.substring(i, i + 3);
        i += 3;
    }
    if (digits.length > i) {
        formatted += '-' + digits.substring(i, i + 2);
        i += 2;
    }
    if (digits.length > i) {
        formatted += '-' + digits.substring(i, i + 2);
    }
    
    input.value = formatted;
}

function openEditModal(id) {
    const employee = employees.find(emp => emp.id === id);

    if (employee.is_fired) {
        return;
    }

    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editFullName').value = employee.full_name;
    document.getElementById('editBirthDate').value = employee.birth_date;
    document.getElementById('editPassData').value = employee.pass_data;
    document.getElementById('editContactInf').value = employee.phone_number;
    document.getElementById('editAdress').value = employee.address;
    document.getElementById('editDepartment').value = employee.department;
    document.getElementById('editPosition').value = employee.position;
    document.getElementById('editSalary').value = employee.salary;
    document.getElementById('editHireDate').value = employee.hire_date;

    currentEditingId = id;
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingId = null;
}

function openAddModal() {

    document.getElementById('addFullName').value = '';
    document.getElementById('addBirthDate').value = '';
    document.getElementById('addPassData').value = '';
    document.getElementById('addContactInf').value = '';
    document.getElementById('addAdress').value = '';
    document.getElementById('addDepartment').value = '';
    document.getElementById('addPosition').value = '';
    document.getElementById('addSalary').value = '';
    document.getElementById('addHireDate').value = '';

    document.getElementById('addModal').style.display = 'block';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

async function addEmployee(employeeData) {
    const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
    });
    return await response.json();
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

async function loadEmployees() {
    const response = await fetch(`${API_URL}/employees`);
    employees = await response.json();
    displayEmployees(employees);
}

async function fireEmployee(id) {
    await fetch(`${API_URL}/employees/${id}/fire`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });

    loadEmployees();
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
                    <button class="btn-edit" ${employee.is_fired ? 'disabled' : ''} onclick="openEditModal(${employee.id})">
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

function getEmployeeFormData(prefix) {
    return {
        full_name: document.getElementById(`${prefix}FullName`).value,
        birth_date: document.getElementById(`${prefix}BirthDate`).value,
        pass_data: document.getElementById(`${prefix}PassData`).value,
        phone_number: document.getElementById(`${prefix}ContactInf`).value,
        address: document.getElementById(`${prefix}Adress`).value,
        department: document.getElementById(`${prefix}Department`).value,
        position: document.getElementById(`${prefix}Position`).value,
        salary: parseInt(document.getElementById(`${prefix}Salary`).value),
        hire_date: document.getElementById(`${prefix}HireDate`).value
    };
}

document.getElementById('addForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = getEmployeeFormData('add');
    await addEmployee(formData);

    closeAddModal();
    loadEmployees();
});

document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = getEmployeeFormData('edit');
    await updateEmployee(currentEditingId, formData);

    closeEditModal();
    loadEmployees();
});

document.getElementById('cancelAdd').addEventListener('click', closeAddModal);

document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

document.getElementById('addEmployeeBtn').addEventListener('click', openAddModal);

document.addEventListener('DOMContentLoaded', function() {
    const addPassDataInput = document.getElementById('addPassData');
    const editPassDataInput = document.getElementById('editPassData');
    const addContactInput = document.getElementById('addContactInf');
    const editContactInput = document.getElementById('editContactInf');
    
    if (addPassDataInput) {
        addPassDataInput.addEventListener('input', function() {
            applyPassportMask(this);
        });
    }
    
    if (editPassDataInput) {
        editPassDataInput.addEventListener('input', function() {
            applyPassportMask(this);
        });
    }

    if (addContactInput) {
        addContactInput.addEventListener('input', function() {
            applyPhoneMask(this);
        });
    }
    
    if (editContactInput) {
        editContactInput.addEventListener('input', function() {
            applyPhoneMask(this);
        });
    }
    
    loadEmployees();
});
