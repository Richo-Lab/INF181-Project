

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

menuButton.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute("aria-label",
        isOpen ? "Close navigation" : "Open navigation");
});

mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


const retailData = [
    { month: "Jan", category: "Groceries", sales: 18000, profit: 4500, units: 600 },
    { month: "Jan", category: "Household", sales: 9000, profit: 2700, units: 180 },
    { month: "Jan", category: "Personal Care", sales: 7000, profit: 2100, units: 140 },

    { month: "Feb", category: "Groceries", sales: 20000, profit: 5000, units: 650 },
    { month: "Feb", category: "Household", sales: 8500, profit: 2550, units: 170 },
    { month: "Feb", category: "Personal Care", sales: 7500, profit: 2250, units: 150 },

    { month: "Mar", category: "Groceries", sales: 22000, profit: 5500, units: 700 },
    { month: "Mar", category: "Household", sales: 10000, profit: 3000, units: 200 },
    { month: "Mar", category: "Personal Care", sales: 8000, profit: 2400, units: 160 },

    { month: "Apr", category: "Groceries", sales: 19000, profit: 4750, units: 620 },
    { month: "Apr", category: "Household", sales: 11000, profit: 3300, units: 220 },
    { month: "Apr", category: "Personal Care", sales: 8500, profit: 2550, units: 170 },

    { month: "May", category: "Groceries", sales: 24000, profit: 6000, units: 760 },
    { month: "May", category: "Household", sales: 12000, profit: 3600, units: 240 },
    { month: "May", category: "Personal Care", sales: 9000, profit: 2700, units: 180 },

    { month: "Jun", category: "Groceries", sales: 26000, profit: 6500, units: 820 },
    { month: "Jun", category: "Household", sales: 13000, profit: 3900, units: 260 },
    { month: "Jun", category: "Personal Care", sales: 10000, profit: 3000, units: 200 }
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const periodFilter = document.getElementById("periodFilter");
const categoryFilter = document.getElementById("categoryFilter");

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    }).format(amount);
}

function getFilteredData() {
    const selectedPeriod = periodFilter.value;
    const selectedCategory = categoryFilter.value;

    return retailData.filter(function (item, index) {
        const periodMatches =
            selectedPeriod === "all" ||
            months.indexOf(item.month) === Number(selectedPeriod);

        const categoryMatches =
            selectedCategory === "all" ||
            item.category === selectedCategory;

        return periodMatches && categoryMatches;
    });
}

function updateKpis(data) {
    let totalSales = 0;
    let totalProfit = 0;
    let totalUnits = 0;

    data.forEach(function (item) {
        totalSales += item.sales;
        totalProfit += item.profit;
        totalUnits += item.units;
    });

    const margin = totalSales > 0
        ? (totalProfit / totalSales) * 100
        : 0;

    document.getElementById("salesKpi").textContent =
        formatCurrency(totalSales);

    document.getElementById("profitKpi").textContent =
        formatCurrency(totalProfit);

    document.getElementById("marginKpi").textContent =
        margin.toFixed(1) + "%";

    document.getElementById("unitsKpi").textContent =
        totalUnits.toLocaleString("en-ZA");
}


function updateSalesChart() {
    const selectedCategory = categoryFilter.value;
    const selectedPeriod = periodFilter.value;
    const chart = document.getElementById("salesBars");

    const monthlySales = months.map(function (month, index) {
        const monthMatches =
            selectedPeriod === "all" ||
            index === Number(selectedPeriod);

        const total = retailData
            .filter(function (item) {
                const categoryMatches =
                    selectedCategory === "all" ||
                    item.category === selectedCategory;

                return item.month === month &&
                    categoryMatches &&
                    monthMatches;
            })
            .reduce(function (sum, item) {
                return sum + item.sales;
            }, 0);

        return { month: month, sales: total };
    });

    const maxSales = Math.max(
        ...monthlySales.map(function (item) {
            return item.sales;
        }),
        1
    );

    chart.innerHTML = "";

    monthlySales.forEach(function (item) {
        const barItem = document.createElement("div");
        barItem.className = "bar-item";

        const value = document.createElement("span");
        value.className = "bar-value";
        value.textContent = item.sales > 0
            ? "R" + Math.round(item.sales / 1000) + "k"
            : "R0";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = (item.sales / maxSales * 100) + "%";
        bar.setAttribute("role", "img");
        bar.setAttribute(
            "aria-label",
            item.month + " sales: " + formatCurrency(item.sales)
        );
        bar.title = item.month + ": " + formatCurrency(item.sales);

        const label = document.createElement("span");
        label.className = "bar-label";
        label.textContent = item.month;

        barItem.appendChild(value);
        barItem.appendChild(bar);
        barItem.appendChild(label);
        chart.appendChild(barItem);
    });
}

function updateCategoryChart(data) {
    const categories = ["Groceries", "Household", "Personal Care"];
    const chart = document.getElementById("categoryMix");

    const categorySales = categories.map(function (category) {
        const total = data
            .filter(function (item) {
                return item.category === category;
            })
            .reduce(function (sum, item) {
                return sum + item.sales;
            }, 0);

        return { category: category, sales: total };
    });

    const maxSales = Math.max(
        ...categorySales.map(function (item) {
            return item.sales;
        }),
        1
    );

    chart.innerHTML = "";

    categorySales.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "category-row";

        const label = document.createElement("span");
        label.textContent = item.category;

        const track = document.createElement("div");
        track.className = "category-track";

        const fill = document.createElement("div");
        fill.className = "category-fill";
        fill.style.width = (item.sales / maxSales * 100) + "%";
        fill.title = formatCurrency(item.sales);

        const value = document.createElement("strong");
        value.textContent = item.sales > 0
            ? "R" + Math.round(item.sales / 1000) + "k"
            : "R0";

        track.appendChild(fill);
        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(value);
        chart.appendChild(row);
    });
}


function updateInsight(data) {
    const insight = document.getElementById("dashboardInsight");

    if (data.length === 0) {
        insight.textContent =
            "There is no data for this selection. Try another filter.";
        return;
    }

    const totalSales = data.reduce(function (sum, item) {
        return sum + item.sales;
    }, 0);

    const bestCategory = ["Groceries", "Household", "Personal Care"]
        .map(function (category) {
            return {
                category: category,
                sales: data
                    .filter(function (item) {
                        return item.category === category;
                    })
                    .reduce(function (sum, item) {
                        return sum + item.sales;
                    }, 0)
            };
        })
        .sort(function (a, b) {
            return b.sales - a.sales;
        })[0];

    insight.textContent =
        bestCategory.category + " has the highest sales in this selection, " +
        "at " + formatCurrency(bestCategory.sales) +
        ". Total sales are " + formatCurrency(totalSales) +
        ". The manager should compare sales with stock levels and costs " +
        "before making ordering decisions.";
}

function updateDashboard() {
    const filteredData = getFilteredData();

    updateKpis(filteredData);
    updateSalesChart();
    updateCategoryChart(filteredData);
    updateInsight(filteredData);
}

periodFilter.addEventListener("change", updateDashboard);
categoryFilter.addEventListener("change", updateDashboard);

updateDashboard();


const privacyChecks = document.querySelectorAll(".privacy-check");
const privacyProgress = document.getElementById("privacyProgress");
const privacyProgressText = document.getElementById("privacyProgressText");

function updatePrivacyProgress() {
    let completed = 0;

    privacyChecks.forEach(function (checkbox) {
        if (checkbox.checked) {
            completed++;
        }
    });

    const percentage = (completed / privacyChecks.length) * 100;

    privacyProgress.style.width = percentage + "%";
    privacyProgressText.textContent =
        completed + " of " + privacyChecks.length +
        " practices reviewed";
}

privacyChecks.forEach(function (checkbox) {
    checkbox.addEventListener("change", updatePrivacyProgress);
});

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
});

backToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

const quizQuestions = [
    {
        question: "1. What is the main difference between data and information?",
        options: [
            "They mean exactly the same thing.",
            "Data is raw facts; information is data organised to be useful.",
            "Information is always stored on paper.",
            "Data can only be used by computers."
        ],
        answer: 1,
        explanation: "Correct. Information gives raw data context and meaning."
    },
    {
        question: "2. Why should a retailer check information quality?",
        options: [
            "To make the website look more colourful.",
            "To avoid training staff.",
            "To reduce errors and make decisions using reliable information.",
            "To remove all business records."
        ],
        answer: 2,
        explanation: "Reliable data helps prevent incorrect stock and misleading reports."
    },
    {
        question: "3. What is an important POPIA practice?",
        options: [
            "Collect as much customer information as possible.",
            "Allow every employee to see all customer records.",
            "Keep customer data forever without reviewing it.",
            "Collect and use personal information responsibly for a justified purpose."
        ],
        answer: 3,
        explanation: "Personal information should be handled responsibly and in accordance with applicable legal requirements."
    },
    {
        question: "4. What is a benefit of integrating retail and accounting systems?",
        options: [
            "Relevant transaction information can be shared, reducing repeated data entry.",
            "The business never needs to check its records.",
            "All cybersecurity risks disappear.",
            "Staff never need training."
        ],
        answer: 0,
        explanation: "Integration can reduce duplicate entry, but systems still need testing and oversight."
    },
    {
        question: "5. How should a small retailer introduce an AI tool?",
        options: [
            "Trust every prediction without checking it.",
            "Replace every employee immediately.",
            "Test a clear business problem, check results and keep human oversight.",
            "Use it without considering customer privacy."
        ],
        answer: 2,
        explanation: "AI should be tested against a real need, with people checking the results."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const quizCounter = document.getElementById("quizCounter");
const quizScore = document.getElementById("quizScore");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");
const restartQuiz = document.getElementById("restartQuiz");

function showQuestion() {
    answered = false;

    const question = quizQuestions[currentQuestion];

    quizCounter.textContent =
        "Question " + (currentQuestion + 1) +
        " of " + quizQuestions.length;

    quizScore.textContent = "Score: " + score;
    quizQuestion.textContent = question.question;
    quizOptions.innerHTML = "";
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback";

    nextQuestion.disabled = true;
    nextQuestion.classList.remove("hidden");
    nextQuestion.textContent =
        currentQuestion === quizQuestions.length - 1
            ? "See results"
            : "Next question";

    restartQuiz.classList.add("hidden");

    question.options.forEach(function (option, index) {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", function () {
            selectAnswer(index);
        });

        quizOptions.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    if (answered) {
        return;
    }

    answered = true;

    const question = quizQuestions[currentQuestion];
    const optionButtons = quizOptions.querySelectorAll(".quiz-option");
    const isCorrect = selectedIndex === question.answer;

    if (isCorrect) {
        score++;
        quizFeedback.classList.add("correct-text");
    } else {
        quizFeedback.classList.add("incorrect-text");
    }

    optionButtons.forEach(function (button, index) {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("incorrect");
        }
    });

    quizFeedback.textContent = isCorrect
        ? question.explanation
        : "Not quite. " + question.explanation;

    quizScore.textContent = "Score: " + score;
    nextQuestion.disabled = false;
}

nextQuestion.addEventListener("click", function () {
    if (!answered) {
        return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showQuizResults();
    }
});

function showQuizResults() {
    quizCounter.textContent = "Quiz complete";
    quizQuestion.textContent =
        "You scored " + score + " out of " + quizQuestions.length + ".";

    quizOptions.innerHTML = "";
    quizFeedback.className = "quiz-feedback";

    const percentage = (score / quizQuestions.length) * 100;

    if (percentage === 100) {
        quizFeedback.textContent =
            "Excellent! You have a strong understanding of the key concepts.";
    } else if (percentage >= 60) {
        quizFeedback.textContent =
            "Good work! Review the topics where you were unsure.";
    } else {
        quizFeedback.textContent =
            "Keep learning. Review the guide and try the quiz again.";
    }

    nextQuestion.classList.add("hidden");
    nextQuestion.disabled = true;
    restartQuiz.classList.remove("hidden");
}

restartQuiz.addEventListener("click", function () {
    currentQuestion = 0;
    score = 0;
    showQuestion();
});


showQuestion();
