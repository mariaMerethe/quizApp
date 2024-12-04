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

    //skapa nytt quiz
    const quizContainer = document.getElementById('quiz'); //div från html
    const nextButton = document.createElement('button');
    const retryButton = document.createElement('button');

    nextButton.textContent = 'Nästa fråga';
    retryButton.textContent = 'Spela quiz igen';
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
            quizContainer.innerHTML = '<p>Quiz färdigt!</p>'; //visa poäng
            quizContainer.appendChild(retryButton);
        }
    });

    //visa första frågan
    showQuestion(questions[currentQuestionIndex]);

    function showQuestion(question) {
        quizContainer.innerHTML = ''; //rensa föregående fråga
        quizContainer.appendChild(nextButton); //lägger till knapp för att gå till nästa fråga

        //skapa en frågatext
        const questionText = document.createElement('p'); //skapar ett <p>-element
        questionText.textContent = question.question; //lägger in frågetexten
        quizContainer.appendChild(questionText); //lägger till det i quizContainer

        //skapa alternativ
        question.options.forEach((option, i) => {
            const label = document.createElement('label'); //skapar en <label> - HTML-tagg som kopplas till ett formulärfält (här ett radioknapp-alternativ), används för att beskriva fältet så användaren förstår vad alternativet innebär
            const radio = document.createElement('input'); //skapar en <input> av typen 'radio' - HTML-element av typen <input>, men med attributet type='radio', radioknapp används när användaren ska välja endast ett alternativ

            radio.type = 'radio'; //sätter input till radioknapp
            radio.name = `question-${currentQuestionIndex}`; //namn för att gruppera kanppar för en fråga
            radio.value = i; //värdet på radioknappen (index för alternativet)

            label.appendChild(radio); //lägger till radioknappen i label (hela labeln blir klickbar)
            label.appendChild(document.createTextNode(option)); //lägg till text för alternativet (tex: brun, lila, turkost), bredvid radioknappen

            radio.addEventListener('click', (event) => {
                const userAnswer = parseInt(event.target.value); //hämtar valt alternativ
                const correctAnswer = question.correctAnswer; //från min JSON-fil
                
                //iterera genom alla alternativ för att markera rätt/fel
                question.options.forEach((option, i) => {
                    const labels = document.querySelectorAll(`label`); //alla labels
                    if (userAnswer === correctAnswer) {
                        labels[i].style.backgroundColor = 'lightgreen'; //markera rätt svar som grönt
                    } else {
                        labels[i].style.backgroundColor = 'lightcoral'; //markera fel svar som rött
                    }
                });

                //inaktivera alla radioknappar efter valet
                const radios = document.querySelectorAll(`input[name='question-${currentQuestionIndex}']`);
                radios.forEach((radio) => {
                    radio.disabled = true;
                });
            });

            quizContainer.appendChild(label); //lägger till label (med radioknappen och texten) i quizContainer
            quizContainer.appendChild(document.createElement('br')); //radbrytning för att separera alternativen 
        });
    }

    //knapp för att starta om quizet
    retryButton.addEventListener('click', function() {
        currentQuestionIndex = 0; //återställer index
        showQuestion(questions[currentQuestionIndex]); //visa första frågan igen
    });
}