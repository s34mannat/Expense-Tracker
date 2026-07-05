expenses =
JSON.parse(localStorage.getItem("expenses")) || [];

let totalExpense = 0;

const categoryTotals = {};

expenses.forEach(function(expense){

    totalExpense += Number(expense.amount);

    if(categoryTotals[expense.category]){

        categoryTotals[expense.category] +=
        Number(expense.amount);

    }else{

        categoryTotals[expense.category] =
        Number(expense.amount);

    }

});

let topCategory = "None";
let highestAmount = 0;

for(let category in categoryTotals){

    if(categoryTotals[category] > highestAmount){

        highestAmount =
        categoryTotals[category];

        topCategory =
        category;

    }

}

document.getElementById(
    "dashboard-total"
).textContent =
"₹" + totalExpense;

document.getElementById(
    "dashboard-count"
).textContent =expenses.length;

document.getElementById(
    "dashboard-top-category"
).textContent =topCategory;



const analysisList = document.getElementById(
    "category-analysis"
);

for(let category in categoryTotals){

    const li =
    document.createElement("li");

    li.innerHTML = `
        <strong>${category}</strong>
        <span>₹${categoryTotals[category]}</span>
    `;

    analysisList.appendChild(li);

}



const labels =
Object.keys(categoryTotals);

const data =
Object.values(categoryTotals);

const chartCanvas =
document.getElementById(
    "expense-chart"
);

if(window.expenseChart){
    window.expenseChart.destroy();
}

window.expenseChart =
new Chart(chartCanvas, {

    type: "pie",

    data: {

        labels: labels,

        datasets: [{
            data: data
        }]

    },

    options: {

        responsive: true,
        maintainAspectRatio: false

    }

});
const recentList =
document.getElementById(
    "recent-expenses"
);

const recentExpenses =
expenses.slice(-5).reverse();

recentExpenses.forEach(function(expense){

    const li =
    document.createElement("li");

    li.innerHTML =
    `
    <span>${expense.name}</span>
    <span>₹${expense.amount}</span>
    `;

    recentList.appendChild(li);

});








if(
    localStorage.getItem("theme")
    === "true"
){
    document.body.classList.add(
        "dark-mode"
    );
}

document.addEventListener(
"DOMContentLoaded",
function(){

    renderCategories();

    renderExpenses();

    updateSummary();

    renderCategoryAnalysis();

    generateInsight();

   // renderChart();

});