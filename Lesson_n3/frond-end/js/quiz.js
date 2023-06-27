// questions resource
const questions_endpoint = "http://localhost:3000/questions"
const secret_key_input = document.getElementById('secret_key');
const load_questions_button = document.getElementById('load_questions_btn');
const form = document.querySelector('#questions_form');
var is_submitted = false;

load_questions_button.onclick = load_questions;

// Override the default form submit event to check the answers
form.addEventListener('submit', (event) => {
    event.preventDefault();
    check_answers();
});
// Override the default form reset event to reset inputs' style and state
form.addEventListener('reset', (event) => {
    is_submitted = false;
    const questions = document.querySelectorAll('#questions_container > div');
    questions.forEach(question => {
        let answer_label = question.querySelectorAll('label');
        answer_label.forEach(label => {
            let input = label.querySelector('input');
            input.disabled = false;
            label.style.color = 'black';
        });
    });
});

async function load_questions() {
    secret_key = secret_key_input.value;
    if (secret_key == "") {
        alert("Please insert the secret key to load the questions.");
        return;
    }
    try {
        var response = await fetch(questions_endpoint, {
            method: 'GET',
            headers: {"Authorization": secret_key}
        });
    }
    catch (error) {
        alert("Unable to contactn backend server, please try again later.")
        return;
    }
    let data = await response.text();
    if (response.status != 200) {
        alert(data);
        return;
    }
    data = JSON.parse(data);
    const questions = document.getElementById('questions_container');
    data.forEach(element => {
        let question_div = document.createElement('div');
        question_div.id = `question_${element.id}`;
        let title = document.createElement('p');
        title.innerHTML = `<b>Question ${element.id}</b>: ${element.title}`;
        question_div.appendChild(title);
        element.answers.forEach(answer => {
            let answer_label = document.createElement('label');
            let input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${element.id}`;
            input.value = answer.id;
            input.required = true;
            input.dataset.score = answer.score;
            answer_label.appendChild(input);
            answer_label.innerHTML += answer.text;
            question_div.appendChild(answer_label);
        });
        let correct_answer = document.createElement('input');
        correct_answer.type = 'hidden';
        correct_answer.value = element.correct;
        question_div.appendChild(correct_answer);
        questions.appendChild(question_div);
    });
    document.getElementById("buttons").style.display = "flex";
}

function check_answers() {
    if (is_submitted) {
        alert("You have already submitted the quiz!, please reset the form to try again.");
        return;
    }
    const questions = document.querySelectorAll('#questions_container > div');
    let score = 0;
    questions.forEach(question => {
        let inputs = question.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true;
        });
        let color = 'red';
        let selected_answer = question.querySelector('input[type="radio"]:checked');
        if (selected_answer.value == question.querySelector('input[type="hidden"]').value) {
            color = 'green';
        }
        selected_answer.parentElement.style.color = color;
        score += parseInt(selected_answer.dataset.score);
    });
    is_submitted = true;
    alert(`Your score is ${score}`);
}