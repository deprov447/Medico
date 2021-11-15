
$("#fuzzOptionsList").fuzzyDropdown({
    mainContainer: "#fuzzSearch",
    arrowUpClass: "fuzzArrowUp",
    selectedClass: "selected",
    enableBrowserDefaultScroll: true,
});

const updateFunction = ({ medSchedule }) => {
    var medicineList = document.querySelector('#medicineList')
    medicineList.innerHTML = ""
    medSchedule.forEach(({ med, quantity, period }) => {
        let li = document.createElement("li");
        li.textContent = `${med} (${quantity} capsules) : Every ${period} hours`
        medicineList.appendChild(li)
    })
}

document.querySelector(".findButton").addEventListener("click", () => {
    const searchRes = document.querySelector(".fuzzName").innerText
    allPatientData.forEach(({ name }, index) => {
        if (name === searchRes) {
            updateFunction(allPatientData[index])
        }
    })
})