class Card {
    constructor(word, translation, example) {
        this.word = word;
        this.translation = translation;
        this.example = example;
    }
}

class StudyMode {
    constructor(cards) {
        this.cards = cards;
        this.currentIndex = 0;
        this.setupEventListeners();
        this.renderCard();
        this.showStudyMode();
    }
    
    setupEventListeners() {
        document.querySelector('#next').addEventListener('click', () => this.nextCard());
        document.querySelector('#back').addEventListener('click', () => this.previousCard());
        document.querySelector('#exam').addEventListener('click', () => this.startExam());
        
        const flipCard = document.querySelector('#flip-card');
        flipCard.addEventListener('click', () => this.flipCard(flipCard));
    }
    
    renderCard() {
        const cardFront = document.querySelector('.flip-card-front h1');
        const cardBackTitle = document.querySelector('.flip-card-back h1');
        const example = document.querySelector('.flip-card-back p span');
        
        const currentCard = this.cards[this.currentIndex];
        cardFront.textContent = currentCard.word;
        cardBackTitle.textContent = currentCard.translation;
        example.textContent = currentCard.example;
        
        document.querySelector('#current-word').textContent = this.currentIndex + 1;
        document.querySelector('#total-word').textContent = this.cards.length;
        
        this.updateNavigationButtons();
        this.resetFlipCard();
    }
    
    flipCard(card) {
        card.classList.toggle('flip-card-active');
    }
    
    nextCard() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.renderCard();
        }
    }
    
    previousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCard();
        }        
    }
    
    updateNavigationButtons() {
        const backButton = document.querySelector('#back');
        const nextButton = document.querySelector('#next');
        
        backButton.disabled = this.currentIndex === 0;
        nextButton.disabled = this.currentIndex === this.cards.length - 1;
    }
    
    resetFlipCard() {
        const flipCard = document.querySelector('#flip-card');
        flipCard.classList.remove('flip-card-active');
    }
    
    startExam() {
        this.hideStudyMode();
        this.examMode = new ExamMode(this.cards, () => this.showStudyMode());
    }

    showStudyMode() {
        document.querySelector('#study-mode').style.display = 'block';
        document.querySelector('#exam-mode').style.display = 'none';
    }

    hideStudyMode() {
        document.querySelector('#study-mode').style.display = 'none';
        document.querySelector('#exam-mode').style.display = 'block';
    }
}

class ExamMode {
    constructor(cards, onFinishCallback) {
        this.cards = cards;
        this.onFinish = onFinishCallback;
        this.selectedCards = [];
        this.correctPairs = 0;

        this.words = this.cards.map(card => ({type: 'word', text: card.word, translation: card.translation}));
        this.translations = this.cards.map(card => ({type: 'translation', text: card.translation, word: card.word}));

        this.allExamCards = [...this.words, ...this.translations];
        this.shuffle(this.allExamCards);

        this.renderExamCards();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    renderExamCards() {
        const examCardsContainer = document.querySelector('#exam-cards');
        examCardsContainer.innerHTML = '';
        
        this.allExamCards.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.className = 'exam-card';
            cardElement.textContent = item.text;
            
            cardElement._type = item.type;
            if (item.type === 'word') {
                cardElement._match = item.translation;
            } else {
                cardElement._match = item.word;
            }
            cardElement.addEventListener('click', () => this.selectCard(cardElement));
            
            examCardsContainer.append(cardElement);
        });
    }
    
    selectCard(card) {
        if (this.selectedCards.length < 2 && !card.classList.contains('fade-out') && !card.classList.contains('selected')) {
            card.classList.add('selected');
            this.selectedCards.push(card);

            if (this.selectedCards.length === 1) {
                card.classList.add('correct');
            }

            if (this.selectedCards.length === 2) {
                this.checkPairs();
            }
        }
    }
    
    checkPairs() {
        const [firstCard, secondCard] = this.selectedCards;
        
        if (firstCard._match === secondCard.textContent && firstCard._type !== secondCard._type) {
            firstCard.classList.add('fade-out');
            secondCard.classList.add('fade-out');
            this.correctPairs++;

            this.selectedCards = [];

            if (this.correctPairs === this.cards.length) {
                setTimeout(() => {
                    alert('Тестирование завершено!');
                    this.onFinish();
                }, 100);
            }
        } else {
            secondCard.classList.add('wrong');

            setTimeout(() => {
                firstCard.classList.remove('correct', 'selected');
                secondCard.classList.remove('wrong', 'selected');
                this.selectedCards = [];
                this.isChecking = false;
            }, 500);  
        }   
    }
}  

const cards = [
    new Card('Hello', 'Привет', 'Hello, how are you?'),
    new Card('Book', 'Книга', 'I am reading an interesting book.'),
    new Card('Car', 'Машина', 'My car is parked outside.'),
    new Card('House', 'Дом', 'Their house is very big.'),
    new Card('Dog', 'Собака', 'The dog is barking loudly.'),
    new Card('Friend', 'Друг', 'She is my best friend.'),
    new Card('Tree', 'Дерево', 'The tree is very tall.'),
    new Card('City', 'Город', 'This city is beautiful.'),
    new Card('Laptop', 'Ноутбук', 'I need to fix my laptop.'),
    new Card('Phone', 'Телефон', 'My phone battery is low.'),
    new Card('Table', 'Стол', 'The table is made of wood.'),
    new Card('Chair', 'Стул', 'Please take a seat on the chair.'),
    new Card('Window', 'Окно', 'The window is open.'),
    new Card('Flower', 'Цветок', 'The flower smells lovely.'),
    new Card('Thank you', 'Спасибо', 'Thank you for your help!'),
];

function initializeStudyMode() {
    new StudyMode(cards);
}

document.addEventListener('DOMContentLoaded', initializeStudyMode);


