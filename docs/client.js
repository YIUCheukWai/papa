// public/app.js

const form = document.getElementById("member-form");
const membersTableBody = document
  .getElementById("members-table")
  .querySelector("tbody");
const searchInput = document.getElementById("search");

// Store all members for searching
let allMembers = [];

// Fetch existing members from the API when the page loads
const fetchMembers = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/members");
    if (!response.ok) throw new Error("Network response was not ok");
    allMembers = await response.json(); // Store all members in the variable

    // Clear the existing members in the table
    membersTableBody.innerHTML = "";

    allMembers.forEach((member) => {
      addMemberToTable(member);
    });
  } catch (error) {
    console.error("Error fetching members:", error);
  }
};

// Add a member to the table
const addMemberToTable = (member) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${member.name}</td>
    <td>${member.phone}</td>
    <td>$${member.balance.toFixed(
      2
    )}</td> <!-- Format balance to two decimal places with dollar sign -->
    <td>
      <input type="number" id="amount-${
        member._id
      }" placeholder="Amount" min="1" />
      <button class="increase-balance" data-id="${
        member._id
      }">Increase Balance</button>
      <button class="decrease-balance" data-id="${
        member._id
      }">Decrease Balance</button>
      <button class="delete-member" data-id="${member._id}">Delete</button>
    </td>
  `;
  membersTableBody.appendChild(row);

  // Attach event listeners to buttons after adding the row to the table
  row
    .querySelector(`button.increase-balance`)
    .addEventListener("click", () => increaseBalance(member._id));
  row
    .querySelector(`button.decrease-balance`)
    .addEventListener("click", () => decreaseBalance(member._id));
  row
    .querySelector(`button.delete-member`)
    .addEventListener("click", () => deleteMember(member._id));
};

// Handle form submission to add a new member
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  let balance = document.getElementById("balance").value;

  // If balance is empty, set it to 300
  if (balance === "") {
    balance = 300; // Auto-fill with 300 if the input is empty
  } else {
    balance = parseFloat(balance); // Convert balance to a number if entered
  }
  try {
    const response = await fetch("http://localhost:3000/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, balance }), // Send the balance along with name and phone
    });

    if (!response.ok) throw new Error("Failed to add member");

    const newMember = await response.json();
    allMembers.push(newMember); // Add the new member to the array
    addMemberToTable(newMember); // Add the new member to the table
    form.reset(); // Reset the form fields
  } catch (error) {
    console.error("Error adding member:", error);
  }
});

// Function to search members by name or phone
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(query) || member.phone.includes(query)
  );

  // Clear the existing members in the table
  membersTableBody.innerHTML = "";

  // Add filtered members to the table
  filteredMembers.forEach((member) => {
    addMemberToTable(member);
  });
});

// Function to increase the balance
const increaseBalance = async (memberId) => {
  const amountInput = document.getElementById(`amount-${memberId}`);
  const amount = parseFloat(amountInput.value); // Use parseFloat for decimal values

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount to increase.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/members/${memberId}/balance`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }), // Sending the amount to increase
      }
    );

    if (!response.ok) throw new Error("Failed to update balance");

    const updatedMember = await response.json();
    fetchMembers(); // Refresh the member list after updating
  } catch (error) {
    console.error("Error increasing balance:", error);
  }
};

// Function to decrease the balance
const decreaseBalance = async (memberId) => {
  const amountInput = document.getElementById(`amount-${memberId}`);
  const amount = parseFloat(amountInput.value); // Use parseFloat for decimal values

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount to decrease.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/members/${memberId}/balance`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: -amount }), // Sending negative amount to decrease
      }
    );

    if (!response.ok) throw new Error("Failed to update balance");

    const updatedMember = await response.json();
    fetchMembers(); // Refresh the member list after updating
  } catch (error) {
    console.error("Error decreasing balance:", error);
  }
};

// Function to delete a member
const deleteMember = async (memberId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/members/${memberId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete member");

    // Refresh the members list after deletion
    fetchMembers();
  } catch (error) {
    console.error("Error deleting member:", error);
  }
};

// Fetch members on page load
window.onload = fetchMembers;
