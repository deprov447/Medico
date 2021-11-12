var nonAdheringAges = new Array(0);
jsonData.forEach(({ BIRTHDATE, DEATHDATE, HEALTHCARE_EXPENSES, SUM_PROCEDURES, SUM_MEDICATIONS }) => {
    if (HEALTHCARE_EXPENSES > SUM_PROCEDURES + SUM_MEDICATIONS) {
        const birthYear = parseInt(BIRTHDATE.substring(0, 4));
        const deathYear = DEATHDATE.length === 0 ? new Date().getFullYear() : parseInt(DEATHDATE.substring(0, 4));
        // console.log(birthYear, deathYear)
        nonAdheringAges[deathYear - birthYear] = isNaN(nonAdheringAges[deathYear - birthYear]) ? 1 : nonAdheringAges[deathYear - birthYear] + 1;
    }
})

for (var i = 0; i < nonAdheringAges.length; i++) {
    if (nonAdheringAges[i] === undefined) {
        nonAdheringAges[i] = 0;
    }
}

console.log(nonAdheringAges);

const ageData = {
    labels: Array.from(nonAdheringAges.keys()),
    datasets: [
        {
            label: "Ages not adhering to medication",
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)'
            ],
            // borderColor: "rgb(255, 99, 132)",
            data: Array.from(nonAdheringAges.values())
        },
    ],
};
const ageConfig = {
    type: "line",
    data: ageData,
    options: {
        interaction: {
            intersect: false,
            mode: 'index',
        },
        tension: 0.4,
        fill: true,
        pointBorderWidth: 12,
    },
};
const ageChart = new Chart(document.getElementById("ageChart"), ageConfig);