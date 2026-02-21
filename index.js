const tbody = document.querySelector('tbody');
let allUsers = []; 
let editUserId = null;
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));

const getUsers = async () => {

    const localData = localStorage.getItem('myUsers');
    
    if (localData) {

        allUsers = JSON.parse(localData);
        renderTable();
    } else {
        try {
            const res = await axios.get('https://jsonplaceholder.typicode.com/users');
            allUsers = res.data;
            saveToLocal(); 
            renderTable();
        } catch (error) { 
            console.error("Xatolik:", error); 
        }
    }
}

const saveToLocal = () => {
    localStorage.setItem('myUsers', JSON.stringify(allUsers));
}


const renderTable = () => {
    tbody.innerHTML = "";
    allUsers.forEach((user, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td class="fw-bold">${user.name}</td>
                <td>${user.email || (user.username + '@gmail.com')}</td>
                <td>${user.address?.city || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.website || 'N/A'}</td>
                <td>${user.company?.name || 'N/A'}</td>
                <td>
                    <div class="d-flex">
                        <button class="btn btn-sm btn-outline-dark me-2" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
}

function openAddModal() {
    editUserId = null;
    document.getElementById('userForm').reset();
    document.getElementById('exampleModalLabel').innerText = "Add New User";
    const btn = document.getElementById('modalSubmitBtn');
    btn.innerText = "Add User";
    btn.onclick = postUser;
    myModal.show();
}

const postUser = () => {
    const name = document.getElementById('fullName').value;
    if(!name) return alert("Ismni kiriting!");

    const newUser = {
        id: Date.now(), 
        name: name,
        username: document.getElementById('userName').value,
        website: document.getElementById('webUrl').value,
        address: { city: document.getElementById('userCity').value },
        phone: document.getElementById('phone').value,
        company: { name: document.getElementById('company').value }
    };

    allUsers.push(newUser);
    saveToLocal(); 
    renderTable();
    myModal.hide();
}

const deleteUser = (id) => {
    if (confirm("O'chirishga ruxsat berasizmi?")) {
        allUsers = allUsers.filter(u => u.id !== id);
        saveToLocal(); 
        renderTable();
    }
}

const editUser = (id) => {
    editUserId = id;
    const user = allUsers.find(u => u.id === id);
    
    if (user) {
        document.getElementById('fullName').value = user.name;
        document.getElementById('userName').value = user.username || "";
        document.getElementById('webUrl').value = user.website || "";
        document.getElementById('userCity').value = user.address?.city || "";
        document.getElementById('phone').value = user.phone || "";
        document.getElementById('company').value = user.company?.name || "";

        document.getElementById('exampleModalLabel').innerText = "Edit User";
        const btn = document.getElementById('modalSubmitBtn');
        btn.innerText = "Update User";
        btn.onclick = updateUser;
        myModal.show();
    }
}

const updateUser = () => {
    allUsers = allUsers.map(u => u.id === editUserId ? {
        ...u,
        name: document.getElementById('fullName').value,
        username: document.getElementById('userName').value,
        website: document.getElementById('webUrl').value,
        phone: document.getElementById('phone').value,
        company: { name: document.getElementById('company').value },
        address: { city: document.getElementById('userCity').value }
    } : u);
    
    saveToLocal(); 
    renderTable();
    myModal.hide();
}

getUsers();