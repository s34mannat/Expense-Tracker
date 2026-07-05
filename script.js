const categoryDropdown =
document.getElementById("category");

const deleteCategorySelect =
document.getElementById("delete-category-select");

const addCategoryBtn =
document.getElementById("add-category-btn");

const newCategoryInput =
document.getElementById("new-category");

let selectedCategory = "All";
let searchText = "";
let editIndex = null;

const addBtn = 
 document.getElementById("add-btn");

const expenseList =
 document.getElementById("expense-items");



const exportBtn =
 document.getElementById("export-btn");

const filterDropdown =
document.getElementById("filter-category");
const searchInput =
document.getElementById("search-input");

const searchBtn =
document.getElementById("search-btn");

if(searchBtn){

    searchBtn.addEventListener(
    "click",
    function(){

        searchText =
        searchInput.value.toLowerCase();

        renderExpenses();

    });

}
if(searchInput){

    searchInput.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){

            searchText =
            searchInput.value.toLowerCase();

            renderExpenses();

        }

    });

}

if(filterDropdown){

    filterDropdown.addEventListener(
    "change",
    function(){

        selectedCategory =
        this.value;

        renderExpenses();

    });

}
let categories =
JSON.parse(
    localStorage.getItem("categories")
) || [
    "Groceries",
    "Food",
    "Transportation"
];
function renderCategories() {

    if(!categoryDropdown){
    return;
}


    categoryDropdown.innerHTML =
    `<option value="Select">
        Select Category
     </option>`;

    categories.forEach(function(category){

        const option =
        document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryDropdown.appendChild(option);

    });

}

if(filterDropdown){

    filterDropdown.innerHTML =
    `<option value="All">
        All Categories
     </option>`;

    categories.forEach(function(category){

        const option =
        document.createElement("option");

        option.value = category;

        option.textContent = category;

        filterDropdown.appendChild(option);

    });

    if(deleteCategorySelect){

    deleteCategorySelect.innerHTML =
    `<option value="">
        Select Category
    </option>`;

    categories.forEach(function(category){

        const option =
        document.createElement("option");

        option.value = category;

        option.textContent = category;

        deleteCategorySelect.appendChild(option);

    });

}
}





renderCategories();
if(addCategoryBtn){

addCategoryBtn.addEventListener(
"click",
function(){

    const categoryName =
    newCategoryInput.value.trim();

    if(categoryName === ""){
    return;
}

if(categories.includes(categoryName)){
    alert("Category already exists");
    return;
}

categories.push(categoryName);

localStorage.setItem(
    "categories",
    JSON.stringify(categories)
);

renderCategories();

newCategoryInput.value = "";

});
}

const deleteCategoryBtn =
document.getElementById("delete-category-btn");

if(deleteCategoryBtn){

    deleteCategoryBtn.addEventListener(
    "click",
    function(){

        const categoryToDelete =
        deleteCategorySelect.value;

        if(categoryToDelete === ""){
            alert("Please select a category");
            return;
        }

        categories =
        categories.filter(function(category){

            return category !== categoryToDelete;

        });

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );

        renderCategories();

        renderExpenses();

        if(document.getElementById("category-analysis")){
        renderCategoryAnalysis();
    }

    

    });

}

let expenses = 
JSON.parse(
    localStorage.getItem("expenses")
) || [];

if(exportBtn){

exportBtn.addEventListener(
"click",
function(){

    let csv =
    "Name,Category,Amount,Date\n";

    expenses.forEach(function(expense){

        csv +=
        `${expense.name},
${expense.category},
${expense.amount},
${expense.date}\n`;

    });
    const blob =
new Blob([csv], {
    type: "text/csv"
});

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"money-trail-expenses.csv";

a.click();

URL.revokeObjectURL(url);

});

}

if(addBtn){

addBtn.addEventListener("click", function () {

    const name = document.getElementById("expense-name").value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("expense-amount").value;
    const date = document.getElementById("expense-date").value;

    if(name === "" || amount === ""){
        alert("Please fill all fill all fields");
        return;
    }
    const expense = {
    name,
    category,
    amount,
    date
};

if(editIndex !== null){

    expenses[editIndex] = expense;

    editIndex = null;

}else{

    expenses.push(expense);

}

localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
);

renderExpenses();
updateSummary();
if(document.getElementById("category-analysis")){
    renderCategoryAnalysis();
}
generateInsight();
renderChart();

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
});


}
function renderExpenses() {

    expenseList.innerHTML = "";

    expenses.forEach(function(expense, index){
        if(
    !expense.name
    .toLowerCase()
    .includes(searchText)
){
    return;
}

    if(
        selectedCategory !== "All" &&
        expense.category !== selectedCategory
    ){
        return;
    }

        const li =
        document.createElement("li");

        li.innerHTML = `
    <div>
        <strong>${expense.name}</strong><br>
        ${expense.category}<br>
        ${expense.date}
    </div>

    <div class="expense-actions">

    <div>₹${expense.amount}</div>

    <div class="action-buttons">
        <button class="delete-btn">Delete</button>
        <button class="edit-btn">Edit</button>
    </div>

</div>
`;

        expenseList.appendChild(li);
        const deleteBtn =
          li.querySelector(".delete-btn");

deleteBtn.addEventListener(
"click",
function(){

    expenses.splice(index, 1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();
    updateSummary();
    if(document.getElementById("category-analysis")){
    renderCategoryAnalysis();
}
    generateInsight();
    renderChart();

});
const editBtn =
li.querySelector(".edit-btn");

editBtn.addEventListener(
"click",
function(){

    document.getElementById("expense-name").value =
    expense.name;

    document.getElementById("category").value =
    expense.category;

    document.getElementById("expense-amount").value =
    expense.amount;

    document.getElementById("expense-date").value =
    expense.date;

    editIndex = index;

});

    });

}
function updateSummary() {

    const today =
new Date().toISOString().split("T")[0];
const currentDate = new Date();
const currentWeekStart = new Date(currentDate);

currentWeekStart.setDate(
    currentDate.getDate() - currentDate.getDay()
);

let todayTotal = 0;
let weekTotal = 0;
let monthTotal = 0;
let yearTotal = 0;

expenses.forEach(function(expense){

    const expenseDate =
    new Date(expense.date);

    const expenseMonth =
    expenseDate.getMonth();

    const expenseYear =
    expenseDate.getFullYear();

    const currentMonth =
    currentDate.getMonth();

    const currentYear =
    currentDate.getFullYear();

    if(expense.date === today){
        todayTotal += Number(expense.amount);
    }

    if(expenseDate >= currentWeekStart){
        weekTotal += Number(expense.amount);
    }

    if(
        expenseMonth === currentMonth &&
        expenseYear === currentYear
    ){
        monthTotal += Number(expense.amount);
    }
    if(expenseYear === currentYear){
    yearTotal += Number(expense.amount);
}

});

if(document.getElementById("today-total")){

    document.getElementById("today-total").textContent =
    `₹${todayTotal}`;

    document.getElementById("week-total").textContent =
    `₹${weekTotal}`;

    document.getElementById("month-total").textContent =
    `₹${monthTotal}`;

    document.getElementById("year-total").textContent =
    `₹${yearTotal}`;

}
}

function renderCategoryAnalysis(){

    const analysisList =
    document.getElementById(
        "category-analysis"
    );

     if(!analysisList){
        return;
    }


    analysisList.innerHTML = "";

    const categoryTotals = {};

    expenses.forEach(function(expense){

        if(
            !categoryTotals[
                expense.category
            ]
        ){
            categoryTotals[
                expense.category
            ] = 0;
        }

        categoryTotals[
            expense.category
        ] += Number(expense.amount);

    });

    for(
        let category in categoryTotals
    ){

        const li =
        document.createElement("li");

        li.innerHTML = `
            <strong>${category}</strong>
            <span>
                ₹${categoryTotals[category]}
            </span>
        `;

        analysisList.appendChild(li);

    }

}
function generateInsight(){

    const insightText =
    document.getElementById("insight-text");

     if(!insightText){
        return;
    }


    if(expenses.length === 0){

        insightText.textContent =
        "No expenses added yet.";

        return;
    }

    const categoryTotals = {};

    expenses.forEach(function(expense){

        if(!categoryTotals[expense.category]){
            categoryTotals[expense.category] = 0;
        }

        categoryTotals[expense.category] +=
        Number(expense.amount);

    });

    let highestCategory = "";
    let highestAmount = 0;

    for(let category in categoryTotals){

        if(categoryTotals[category] > highestAmount){

            highestAmount =
            categoryTotals[category];

            highestCategory =
            category;

        }

    }

    insightText.textContent =
    `You spend the most on ${highestCategory} (₹${highestAmount}).`;

}

function renderChart(){

    const chartCanvas =
    document.getElementById("expense-chart");

    if(!chartCanvas){
        return;
    }

    const categoryTotals = {};

    expenses.forEach(function(expense){

        if(!categoryTotals[expense.category]){
            categoryTotals[expense.category] = 0;
        }

        categoryTotals[expense.category] +=
        Number(expense.amount);

    });

    const labels =
    Object.keys(categoryTotals);

    const data =
    Object.values(categoryTotals);

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

}

renderCategories();
renderExpenses();
updateSummary();
if(document.getElementById("category-analysis")){
    renderCategoryAnalysis();
}
generateInsight();
renderChart();

const expenseDateInput =
document.getElementById("expense-date");

if(expenseDateInput){

    expenseDateInput.value =
    new Date().toISOString().split("T")[0];

}

if(
    localStorage.getItem("theme")
    === "true"
){
    document.body.classList.add(
        "dark-mode"
    );
} 



const menuBtn =
document.getElementById("menu-btn");

const sideMenu =
document.getElementById("side-menu");

const overlay =
document.getElementById("overlay");

if(menuBtn){

    menuBtn.addEventListener(
    "click",
    function(){

        sideMenu.classList.add(
            "show"
        );

        if(overlay){
    overlay.classList.add("show");
}

    });

}

if(overlay){

    overlay.addEventListener(
    "click",
    function(){

        sideMenu.classList.remove(
            "show"
        );

        if(overlay){
    overlay.classList.remove("show");
}

    });

}

const dashboardLink =
document.getElementById(
    "dashboard-link"
);

if(dashboardLink){

    dashboardLink.addEventListener(
    "click",
    function(){
    

        sideMenu.classList.remove(
            "show"
        );

        if(overlay){
    overlay.classList.remove("show");
}

        window.location.href =
        "dashboard.html";

    });

}

const homeLink =
document.getElementById(
    "home-link"
);

if(homeLink){

    homeLink.addEventListener(
    "click",
    function(){
        

        sideMenu.classList.remove(
            "show"
        );

        if(overlay){
    overlay.classList.remove("show");
}

        window.location.href =
        "index.html";

    });

}

const darkModeOption =
document.getElementById(
    "theme-toggle"
);

if(darkModeOption){

    darkModeOption.addEventListener(
    "click",
    function(){

        document.body.classList.toggle(
            "dark-mode"
        );

        localStorage.setItem(
            "theme",
            document.body.classList.contains(
                "dark-mode"
            )
        );

        sideMenu.classList.remove(
            "show"
        );

        if(overlay){
    overlay.classList.remove("show");
}

    });

}