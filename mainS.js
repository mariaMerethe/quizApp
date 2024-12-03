fetch('quiz.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); //parsar json-filen till ett js-objekt
    })
    .then(data => {
        console.log('Questions:', data.questions); //frågorna från json-filen
        renderQuiz(data.questions); //anropa en funktion för att rendera quizet
    })
    .catch(error => {
        console.error('Failed to fetch the JSON file.', error);
    });

//funktion för att rendera quizet
function renderQuiz(questions) {
    const quizContainer = document.getElementById('quiz');
    const nextButton = document.createElement('button');
    const retryButton = document.createElement('button');

    nextButton.textContent = 'Nästa fråga';
    retryButton.textContent = 'Gör om quiz';
    let currentQuestionIndex = 0;

    quizContainer.appendChild(nextButton);

    nextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector(
            `input[name="question-${currentQuestionIndex}"]:checked`
        );

        if (!selectedOption) {
            alert('Vänligen välj ett alternativ för att fortsätta!');
            return;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            quizContainer.innerHTML = '<p>Quiz färdigt!</p>'; // visa poäng
            quizContainer.appendChild(retryButton);
        }
    });

    retryButton.addEventListener('click', () => {
        location.reload(); // TODO: hitta något bättre sätt
    });

    // visa första frågan
    showQuestion(questions[currentQuestionIndex]);

    function showQuestion(question) {
        quizContainer.innerHTML = ''; // rensa föregående fråga
        quizContainer.appendChild(nextButton);

        // skapa fråga
        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        quizContainer.appendChild(questionText);

        // skapa alternativ
        question.options.forEach((option, i) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');

            radio.type = 'radio';
            radio.name = `question-${currentQuestionIndex}`;
            radio.value = i;

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));

            quizContainer.appendChild(label);
            quizContainer.appendChild(document.createElement('br'));
        });
    }
}
