/*
This site is created for IE course mid-term exam
author: Mohammadreza Dorudian    ID: 9731018
Teacher: Mr. Parham Alvani
JS Section
*/

// Elements that we are working with them later
let form = document.querySelector(".main-form");
// The regex pattern for the username input
const pattern = /^[a-zA-Z ]{1,255}$/;
const notif = document.querySelector(".notif");
const predict = document.querySelector(".predict");
const male = document.querySelector("#male");
const female = document.querySelector("#female");
const getGender = document.querySelector(".get-gender");
const reset = document.querySelector(".reset");
const save = document.querySelector(".save");
const submit = document.querySelector(".submit")

// Fill the element with result of our search for a person's gender
const setName = (name) => {
    if (name.gender) {
        predict.innerText = `${name.probability * 100}% ${name.gender}`;
    } else {
        predict.innerText = "I don't know";
    }
};

// Show the given name in the storage rectangle if we have that name saved
const showStorage = (name) => {
    let stored = localStorage.getItem(name);
    if (stored) {
        getGender.innerText = `${name} is ${stored}`;
    }
};

// Delete saved name in the local storage
const resetStorage = (name) => {
    localStorage.removeItem(name)
    getGender.innerText = "";
};

// Add an event listener to the reset button, it will delete the name from the local storage
reset.addEventListener("click", () => {
    resetStorage(form.name.value);
    getGender.innerText = "removed";
});

// Fetch the data from the API (using async/await) and show the result, the return the data in the callback function
const getName = async () => {
    const response = await fetch(
        `https://api.genderize.io/?name=${form.name.value}`
    ).catch(err => {
        predict.innerText = "Network Error";
    });
    const data = await response.json();
    if (data.gender === "male") {
        male.checked = true;
    } else if (data.gender === "female") {
        female.checked = true;
    } else {
        female.checked = false;
        male.checked = false;
    }
    setName(data);
    showStorage(data.name);
    return data;
};

// Add an event listener to the submit button, it will start sending the request to the API, also check the format
submit.addEventListener("click", (e) => {
    e.preventDefault();
    let result = pattern.test(form.name.value);
    if (!result) {
        notif.classList.remove("invalid");
    } else {
        notif.classList.add("invalid");
        getName();
    }
});

// Add an event listener to the save button, it will save the name, if it is already saved
// with the same gender it will show the user that the name has already been saved
save.addEventListener("click", (e) => {
    e.preventDefault();
    let result = pattern.test(form.name.value);
    if (!result) {
        notif.classList.remove("invalid");
    } else {
        notif.classList.add("invalid");
        let gender = localStorage.getItem(form.name.value);
        if (male.checked) {
            if (gender && gender === "male") {
                getGender.innerText = "Already saved";
            } else {
                localStorage.setItem(form.name.value, male.value);
                showStorage(form.name.value)
                form.reset();
            }
        } else if (female.checked) {
            if (gender && gender === "female") {
                getGender.innerText = "Already saved";
            } else {
                localStorage.setItem(form.name.value, female.value);
                showStorage(form.name.value)
                form.reset();
            }
        }
    }

});