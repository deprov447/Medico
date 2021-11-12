var members = new Map();
jsonData.forEach(({ RACE }) => {
    members.set(RACE, (isNaN(members.get(RACE)) ? 1 : 1 + members.get(RACE)));
})

var nonAdheringRace = new Map([...members]);
jsonData.forEach(({ RACE, HEALTHCARE_EXPENSES, SUM_PROCEDURES, SUM_MEDICATIONS }) => {
    if (HEALTHCARE_EXPENSES < SUM_PROCEDURES + SUM_MEDICATIONS)
        nonAdheringRace.set(RACE, nonAdheringRace.get(RACE) - 1);
})

var percentage = new Map([...nonAdheringRace])
percentage.forEach((value, key) => {
    percentage.set(key, Math.ceil(value * 100 / members.get(key)))
})

console.log(members, nonAdheringRace, percentage);

const data = {
    labels: Array.from(percentage.keys()).map(str => str.toUpperCase()),
    datasets: [
        {
            label: "People not adhering to medication (Out of 100)",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            barPercentage: 0.5,
            data: Array.from(percentage.values())
        },
    ],
};
const config = {
    type: "bar",
    data: data,
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                suggestedMax: 100
            }
        },
    },
};
const myChart = new Chart(document.getElementById("raceChart"), config);