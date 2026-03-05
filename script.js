// ================= LOAD DONORS FROM LOCAL STORAGE =================
let storedDonors = localStorage.getItem("donors");

let donors = storedDonors ? JSON.parse(storedDonors) : [
    {name: "Anjali", blood: "B+", city: "Hyderabad", phone: "9876543210", lastDonation: "2025-10-01"},
    {name: "Rahul", blood: "B+", city: "Hyderabad", phone: "9123456780", lastDonation: "2025-05-01"},
    {name: "Sneha", blood: "O+", city: "Chennai", phone: "9988776655", lastDonation: "2025-06-15"},
    {name: "Kiran", blood: "A+", city: "Mumbai", phone: "9000011111", lastDonation: "2025-01-01"}
];

// ================= SAVE DONORS =================
function saveDonors() {
    localStorage.setItem("donors", JSON.stringify(donors));
}

// ================= REGISTER AS DONOR (NEW FUNCTION) =================
function registerAsDonor() {

    let name = document.getElementById("donorName").value.trim();
    let blood = document.getElementById("donorBloodGroup").value;
    let city = document.getElementById("donorCity").value.trim();
    let phone = document.getElementById("donorPhone").value.trim();

    if(name === "" || city === "" || phone === ""){
        alert("Please fill all donor details.");
        return;
    }

    let newDonor = {
        name: name,
        blood: blood,
        city: city,
        phone: phone,
        lastDonation: new Date().toISOString().split("T")[0]
    };

    donors.push(newDonor);
    saveDonors();

    alert("✅ Donor Registered Successfully!");

    document.getElementById("donorName").value = "";
    document.getElementById("donorCity").value = "";
    document.getElementById("donorPhone").value = "";
}

// ================= YOUR EXISTING FUNCTIONS BELOW (UNCHANGED) =================

// LOGIN
function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if(email === "" || password === ""){
        alert("Please enter both email and password.");
        return;
    }

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "none";
   
}

// REGISTER
function register() {
    let email = document.getElementById("registerEmail").value;
    let password = document.getElementById("registerPassword").value;

    if(email === "" || password === ""){
        alert("Please enter both email and password.");
        return;
    }

    alert("Registration successful! Please login now.");
    showLogin();
}

function showRegister() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "block";
}

function showLogin() {
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
}

function logout() {
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("loginSection").style.display = "block";
}

// ================= REMOVE DONOR =================
function removeDonor(index) {

    if(confirm("Are you sure you want to remove this donor?")){

        donors.splice(index, 1);   // Remove from array
        saveDonors();              // Update localStorage
        searchDonors();            // Refresh donor list

        alert("❌ Donor Removed Successfully!");
    }
}
// SEARCH DONORS (UNCHANGED)
function searchDonors() {

    let group = document.getElementById("bloodGroup").value;
    let city = document.getElementById("userCity").value.trim().toLowerCase();
    let list = document.getElementById("donorList");

    list.innerHTML = "";

    let compatible = compatibleGroups(group);

    document.getElementById("compatibility").innerText =
        "💡 Compatible Groups: " + compatible.join(", ");

    let filtered = donors.filter(donor => compatible.includes(donor.blood));

    filtered.sort((a, b) => {
        if (a.city.toLowerCase() === city) return -1;
        if (b.city.toLowerCase() === city) return 1;
        return 0;
    });

    if(filtered.length === 0){
        list.innerHTML = "<p>No donors found.</p>";
        return;
    }

filtered.forEach((donor) => {

    let priorityClass = "";
    let priorityText = "";

    if (city !== "" && donor.city.toLowerCase() === city) {
        priorityClass = "high";
        priorityText = "🔥 Nearby Priority";
    }

    // Get original index from donors array
    let donorIndex = donors.indexOf(donor);

    list.innerHTML += `
        <div class="donor ${priorityClass}">
            <h3>${donor.name}</h3>
            <p>Blood: ${donor.blood}</p>
            <p>City: ${donor.city}</p>
            <p>${priorityText}</p>

            <button onclick="generateMessage('${donor.name}','${donor.blood}','${donor.phone}')">
                📩 Contact
            </button>

            <button onclick="removeDonor(${donorIndex})" 
                    style="background-color:gray;">
                🗑 Remove
            </button>
        </div>
    `;
});
        
}

// EMERGENCY
function activateEmergency() {
    alert("🚨 Emergency Mode Activated!");
    searchDonors();
    document.getElementById("donorList").scrollIntoView({ behavior: "smooth" });
}

// WHATSAPP MESSAGE
function generateMessage(name, blood, phone) {
    let city = document.getElementById("userCity").value;
    let message =
        `Hello ${name},\n\n🚨 Emergency! ${blood} blood is urgently needed in ${city}.\nPlease respond immediately.\n\nThank you.`;

    window.open(
        "https://wa.me/91" + phone + "?text=" + encodeURIComponent(message)
    );
}

// ELIGIBILITY
function checkEligibility() {
    let age = parseInt(document.getElementById("age").value);
    let weight = parseInt(document.getElementById("weight").value);
    let lastDonationValue = document.getElementById("lastDonation").value;
    let result = document.getElementById("eligibilityResult");

    if(!lastDonationValue){
        result.innerText = "Please select last donation date.";
        return;
    }

    let lastDate = new Date(lastDonationValue);
    let today = new Date();
    let diffDays = Math.floor((today - lastDate) / (1000*60*60*24));

    if(age < 18 || age > 60){
        result.innerText = "❌ Not Eligible: Age must be between 18 and 60.";
    }
    else if(weight < 50){
        result.innerText = "❌ Not Eligible: Minimum weight is 50kg.";
    }
    else if(diffDays < 90){
        result.innerText = "⚠️ You can donate after " + (90 - diffDays) + " days.";
    }
    else{
        result.innerText = "✅ You are Eligible to Donate!";
    }
}

// BLOOD COMPATIBILITY
function compatibleGroups(blood){
    let map = {
        "A+": ["A+", "A-", "O+", "O-"],
        "A-": ["A-", "O-"],
        "B+": ["B+", "B-", "O+", "O-"],
        "B-": ["B-", "O-"],
        "AB+": ["A+","A-","B+","B-","AB+","AB-","O+","O-"],
        "AB-": ["A-","B-","AB-","O-"],
        "O+": ["O+","O-"],
        "O-": ["O-"]
    };
    return map[blood];
}