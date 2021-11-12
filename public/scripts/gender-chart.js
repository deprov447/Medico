var nonAdheringGender = new Map();
jsonData.forEach(({ GENDER, HEALTHCARE_EXPENSES, SUM_PROCEDURES, SUM_MEDICATIONS }) => {
    if (HEALTHCARE_EXPENSES > SUM_PROCEDURES + SUM_MEDICATIONS)
        nonAdheringGender.set(GENDER, isNaN(nonAdheringGender.get(GENDER)) ? 1 : nonAdheringGender.get(GENDER) + 1);
})

console.log(nonAdheringGender);

const genderData = {
    labels: Array.from(nonAdheringGender.keys()).map(str => (str == 'M') ? 'MALE' : 'FEMALE'),
    datasets: [
        {
            label: "People not adhering to medication (Out of 100)",
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)'
            ],
            // borderColor: "rgb(255, 99, 132)",
            data: Array.from(nonAdheringGender.values())
        },
    ],
};
const genderConfig = {
    type: "doughnut",
    data: genderData,
    options: {
        interaction: {
            intersect: false,
            mode: 'index',
        },
    },
};
const genderChart = new Chart(document.getElementById("genderChart"), genderConfig);