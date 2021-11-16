
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

const findPatIndex = () => {
    const searchRes = document.querySelector(".fuzzName").innerText
    var res;
    allPatientData.forEach(({ name }, index) => {
        if (name === searchRes) {
            res = index;
        }
    })
    return res;
}

document.querySelector(".findButton").addEventListener("click", () => {
    const index = findPatIndex()
    console.log(index, allPatientData[index])
    updateFunction(allPatientData[index])
})

function addMedicine() {
    var medicine = {
        med: $("#addMedicine input:nth-child(1)").val(),
        quantity: $("#addMedicine input:nth-child(2)").val(),
        period: $("#addMedicine input:nth-child(3)").val(),
        patientId: allPatientData[findPatIndex()]._id.toString()
    };
    $.ajax({
        url: "/addMedicine",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${window.localStorage.getItem('accessToken')}`);
        },
        success: function (data) {
            console.log("added Med")
        },
        data: JSON.stringify(medicine),
    });
}


function addAppointment() {
    var appointment = {
        appointmentDate: $("#addAppointment input:nth-child(1)").val(),
        patientId: allPatientData[findPatIndex()]._id.toString()
    };
    $.ajax({
        url: "/addAppointment",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${window.localStorage.getItem('accessToken')}`);
        },
        success: function (data) {
            console.log("added appointment")
        },
        data: JSON.stringify(appointment),
    });
}

