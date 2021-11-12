var nonAdheringLocations = new Map();
jsonData.forEach(({ CITY, HEALTHCARE_EXPENSES, SUM_PROCEDURES, SUM_MEDICATIONS }) => {
    if (HEALTHCARE_EXPENSES > SUM_PROCEDURES + SUM_MEDICATIONS)
        nonAdheringLocations.set(CITY, isNaN(nonAdheringLocations.get(CITY)) ? 1 : nonAdheringLocations.get(CITY) + 1);
})

console.log(nonAdheringLocations);

const locationData = {
    labels: Array.from(nonAdheringLocations.keys()),
    datasets: [
        {
            label: "People not adhering to medication (Out of 100)",
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)'
            ],
            // borderColor: "rgb(255, 99, 132)",
            data: Array.from(nonAdheringLocations.values())
        },
    ],
};
const locationConfig = {
    type: "bar",
    data: locationData,
    options: {
        interaction: {
            intersect: false,
            mode: 'index',
        },
    },
};
const locationChart = new Chart(document.getElementById("cityChart"), locationConfig);