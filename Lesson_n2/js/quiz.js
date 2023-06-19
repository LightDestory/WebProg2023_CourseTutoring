// questions resource
const questions_endpoint = "https://raw.githubusercontent.com/LightDestory/WebProg2023_CourseTutoring/master/Lesson_n2/json/questions.json"
const form = document.querySelector('#questions_form');
var is_submitted = false;
form.addEventListener('submit', (event) => {
    event.preventDefault();
    check_answers();
});

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
    const response = await fetch(questions_endpoint, {
        method: 'GET',
    });
    const data = await response.json();
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

load_questions()