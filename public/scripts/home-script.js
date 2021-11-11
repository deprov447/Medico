var members = new Map();
jsonData.forEach(({ RACE }) => {
    members.set(RACE, (isNaN(members.get(RACE)) ? 1 : 1 + members.get(RACE)));
})

var nonAdheringMembers = new Map([...members]);
jsonData.forEach(({ RACE, HEALTHCARE_EXPENSES, SUM_PROCEDURES, SUM_MEDICATIONS }) => {
    if (HEALTHCARE_EXPENSES < SUM_PROCEDURES + SUM_MEDICATIONS)
        nonAdheringMembers.set(RACE, nonAdheringMembers.get(RACE) - 1);
})

var percentage = new Map([...nonAdheringMembers])
percentage.forEach((value, key) => {
    percentage.set(key, Math.ceil(value * 100 / members.get(key)))
})

console.log(members, nonAdheringMembers, percentage);

const data = {
    labels: Array.from(percentage.keys()).map(str => str.toUpperCase()),
    datasets: [
        {
            label: "People not adhering to medication (Out of 100)",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            barPercentage: 0.75,
            data: Array.from(percentage.values())
        },
    ],
};
const config = {
    type: "bar",
    data: data,
    options: {
        scales: {
            y: {
                suggestedMax: 100
            }
        }
    },
};
const myChart = new Chart(document.getElementById("myChart"), config);