// --- REGISTRATION LOGIC ---
function register() {
    const name = document.getElementById("name").value;
    const roll = document.getElementById("roll").value;
    const course = document.getElementById("course").value;
    const exam = document.getElementById("exam").value;

    if (!name || !roll || !course || !exam) {
        alert("Please fill all details!");
        return;
    }

    const student = { name, roll, course, exam };
    localStorage.setItem(roll, JSON.stringify(student));
    
    // Requirement 2: Success popup without automatic home redirection
    alert("✅ Your details are submitted successfully!");
    
    // Clear fields so user knows it's done
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("course").value = "";
    document.getElementById("exam").value = "";
}

// --- ADMIN SECURITY & UI ---
function togglePass() {
    const p = document.getElementById("pass");
    const icon = document.getElementById("eye-icon");
    if (p.type === "password") {
        p.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        p.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

function login() {
    const pass = document.getElementById("pass").value;
    if (pass === "admin123") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard").style.display = "flex";
        loadData();
    } else {
        alert("Wrong Password!");
    }
}

function loadData() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const s = JSON.parse(localStorage.getItem(key));
        if (s && s.roll) {
            table.innerHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.roll}</td>
                    <td>${s.exam}</td>
                    <td><button class="download-btn" onclick="downloadTicket('${s.roll}')">Download PDF</button></td>
                </tr>`;
        }
    }
}

// --- SEARCH & DATABASE MGMT ---
function searchTable() {
    let input = document.getElementById("searchInput").value.toUpperCase();
    let tr = document.getElementById("studentTable").getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        let txt = tr[i].innerText.toUpperCase();
        tr[i].style.display = txt.indexOf(input) > -1 ? "" : "none";
    }
}

function clearDB() {
    if(confirm("Are you sure? This deletes ALL student records.")) {
        localStorage.clear();
        loadData();
    }
}

function logout() { window.location.href = "index.html"; }

// --- PDF HALL TICKET (FIXED RIGHT-SIDE CUTTING) ---
function downloadTicket(roll) {
    const s = JSON.parse(localStorage.getItem(roll));
    const template = document.getElementById("ticket-template");
    
    document.getElementById("issue-date").innerText = new Date().toLocaleDateString();
    document.getElementById("ticket-info").innerHTML = `
        <p><b>NAME:</b> ${s.name.toUpperCase()}</p>
        <p><b>ROLL NO:</b> ${s.roll}</p>
        <p><b>COURSE:</b> ${s.course.toUpperCase()}</p>
        <p><b>EXAM:</b> ${s.exam}</p>
    `;

    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: roll, width: 100, height: 100 });

    // The width: 750 and margin ensure the right border is NOT cut off
    const opt = {
        margin: 0.5,
        filename: `HallTicket_${s.roll}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, width: 750 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(template).save();
}