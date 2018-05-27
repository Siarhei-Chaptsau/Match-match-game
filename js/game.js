'use strict';

const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
let rules = document.querySelector('.rules');
let form = document.querySelector('.form');
let btn = document.querySelector('.form__btn');
let formListShirt = document.querySelector('.form__list--shirt');
let formImage = document.querySelectorAll('.form__image');
let formListLevel = document.querySelector('.form__list--level');
let formItemLevel = document.querySelectorAll('.form__text--level');

let cards = document.querySelector('.cards');
let cardsBtn = document.querySelector('.cards__btn');
let cardsItems = document.querySelector('.cards__items');
let timeInSeconds = document.getElementById('sec');
let timeInMinutes = document.getElementById('min');
let countTime;

let popupGame = document.querySelector('.popup--game');
let popupBtnExit = document.querySelector('.popup__btn--exit');
let failure = document.querySelector('.popup--failure');
let popupBtnFailure = document.querySelector('.popup__btn--failure');
let popupTime = document.querySelector('.popup__title--time'); // поле вывода результата игроку
let popupBtnGame = document.querySelector('.popup__btn--game');

let firstTurnedCardIndex; // дефолтное значение индекса первой карты
let firstTurnedCardId; // дефолтное значение data-id первой карты
let obj = { // объект с инфой игрока
  name: null,
  surname: null,
  email: null,
  score: null
};
let memoryObj = {}; // запоминает какую выбрали рубашку и сложность для игры
let newArrCardsRandomAndSelected = []; // массив рандомных карт согласно опций
let arr = [
{'dataId':1, 'backgroundImage':"Barney_Gumble.png"},
{'dataId':2, 'backgroundImage':"Clancy_Wiggum.png"},
{'dataId':3, 'backgroundImage':"Bart_Simpson.png"},
{'dataId':4, 'backgroundImage':"Eleanor_Abernathy.png"},
{'dataId':5, 'backgroundImage':"Groundskeeper_Willie.png"},
{'dataId':6, 'backgroundImage':"Homer_Simpson.png"},
{'dataId':7, 'backgroundImage':"Horatio_McCallister.png"},
{'dataId':8, 'backgroundImage':"Fat_Tony.png"},
{'dataId':9, 'backgroundImage':"Mr_Burns.png"},
{'dataId':10, 'backgroundImage':"Moe_Szyslak.png"},
{'dataId':11, 'backgroundImage':"Abraham_Simpson.png"},
{'dataId':12, 'backgroundImage':"Seymour_Skinner.png"}
];

// функция рандомного перемешивания
Array.prototype.shuffle = function() {
  let that = this;
  for (let i = that.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = that[randomIndex];
    that[randomIndex] = that[i];
    that[i] = itemAtIndex;
  }
  return that;
}

// функция создания рандомного массива согласно выбранного уровня
function randomMixArrays(start, end) {
  let arrCut = arr.slice(start, end);
  let arrCopy = arrCut.slice();
  newArrCardsRandomAndSelected = arrCut.concat(arrCopy);
  newArrCardsRandomAndSelected.shuffle();
  return newArrCardsRandomAndSelected;
}

var fragment = document.createDocumentFragment();
let cardsItem = document.createElement('img');
fragment.appendChild(cardsItem);
cardsItem.classList.add('cards__item');

// функция начала игры
function init(obj) {
  // рандомное перемешивание первонач массива
  arr.shuffle();
  // поменять рубашку карт согласно наличию класса form__active
  for (let i = 0; i < formImage.length; i++) {
    if (formImage[i].classList.contains('form__active')) {
      obj.style.backgroundImage = "url('./img/" + i + ".png')";
      obj.classList.remove('cards__item--turned'); // у всех карт убрать классы переворачивания
      memoryObj.shirt = obj.style.backgroundImage;  // сохраняем в св-во объекта инфу о выбраной рубашке
    }
  }
  // выложить карты (+новый класс) согласно наличию класса form__active
  if (formItemLevel[1].classList.contains('form__active')) {
    randomMixArrays(0, 9); // добавить 18 карт
    addCards(); // добавление карт на поле
  } else if (formItemLevel[2].classList.contains('form__active')) {
    randomMixArrays(); // добавить 24 карты
    addCards();
  } else {
    randomMixArrays(0, 5); // добавить 10 карт
    addCards();
  }
  return memoryObj; // возврат объекта с инфой о выбранной рубашке и уровне сложности
}

// функция отрисовки каждой карты
let renderCard = function (card, index) {
  let newCard = document.createElement('img');
  newCard.dataset.id = newArrCardsRandomAndSelected[index].dataId; // каждой карте даём id
  newCard.dataset.bg = newArrCardsRandomAndSelected[index].backgroundImage; // сохряняем картинку в атрибут data-bg
  newCard.style.backgroundImage = memoryObj.shirt;
  newCard.src = 'img/transparent.png';
  return newCard;
};

// функция добавления карт на поле
let addCards = function () {
  for (let i = 0; i < newArrCardsRandomAndSelected.length; i++) {
    let elem = renderCard(newArrCardsRandomAndSelected[i], i);
    elem.className = "cards__item  cards__item--medium-difficulty";
    if (newArrCardsRandomAndSelected.length < 18) {
      elem.className = "cards__item  cards__item--low-difficulty";
    }
    if (newArrCardsRandomAndSelected.length > 18) {
      elem.className = "cards__item  cards__item--hard-difficulty";
    }
    cardsItems.appendChild(elem); // добавляем карты на поле
  }
};

// таймер
function calcTime(sec, min, zeroing) { // при наличии 3-го парам-ра обнуляется таймер
  sec = Number(timeInSeconds.textContent);
  min = Number(timeInMinutes.textContent);
  sec++;
  if (zeroing) { sec = 0; min = 0; }
  if (sec >= 60) { sec = 0; min++; }
  if (sec < 10) { sec = '0' + sec; }
  if (min < 10) { min = '0' + min; }
  timeInSeconds.textContent = sec;
  timeInMinutes.textContent = min;
}

// функция выхода из игрового поля
function closeCardsField() {
  cards.style.display = 'none';
  rules.style.display = 'block';
  form.style.display = 'block';
  cardsItems.innerHTML = ''; // удаление карт
}

// функция вывода поздравлений
function outputResult() {
  clearInterval(countTime); // остановка таймера
  popupTime.textContent = min.textContent + ' : ' + sec.textContent; // вывод результата таймера
  if (!popupGame.classList.contains('popup--show') ) {
    popupGame.classList.add('popup--show');
  }
  // заполняем профиль игрока в объект и добавляем в массив
  obj.name = document.getElementsByName('name')[0].value;
  obj.surname = document.getElementsByName('surname')[0].value;
  obj.email = document.getElementsByName('email')[0].value;
  obj.score = +timeInMinutes.textContent * 60 + +timeInSeconds.textContent; // перевод в секунды
  let nam = obj.name;
  let resultsnam = obj.score;
  localStorage.setItem(nam, resultsnam);
}

// обработчик поворота карты
cardsItems.addEventListener('click', function(e) {
  if (e.target.classList.contains('cards__item--turned') && !e.target.classList.contains('cards__items')) {
    e.target.style.backgroundImage = memoryObj.shirt; // смена картинки на рубашку
    e.target.classList.toggle('cards__item--turned');
    firstTurnedCardId = null; // удаляем id первой карты из глобальной области видимости
    firstTurnedCardIndex = null; // удаляем индекс первой карты из глобальной области видимости

  } else if (!e.target.classList.contains('cards__items')) {
    e.target.classList.toggle('cards__item--turned');
    setTimeout(function() {
      e.target.style.backgroundImage =  "url('./img/" + e.target.getAttribute('data-bg') + "'), url('./img/white.png')";
    }, 300);
    let arrOfCards = document.querySelectorAll('.cards__item'); // массив карт
    let count = 0; // счётчик для кол-ва открытых карт

    for (let i = 0; i < arrOfCards.length; i++) {
      if (arrOfCards[i].classList.contains('cards__item--turned')) {
        count++;
      }
      if (count == 1 && arrOfCards[i].classList.contains('cards__item--turned')) { // находим первую открытую карту и сохраняем её id
        if (!firstTurnedCardId) { // если индекса первой карты не задан, то задаём id первой карты
          firstTurnedCardId = arrOfCards[i].getAttribute('data-id');
        }
        if (!firstTurnedCardIndex) { // если индекса первой карты не задан, то задаём
          firstTurnedCardIndex = i;
        }
      }
      if (count == 2) { // если уже есть 2 открытые карты

        if (e.target.getAttribute('data-id') == firstTurnedCardId) { // сравниваем id активной карты и открытой, если они равны
          setTimeout(function() {
            e.target.style.visibility = 'hidden'; // скрываем вторую карту
            e.target.classList.remove('cards__item--turned');
            e.target.classList.remove('cards__item'); // убираем из массива
            arrOfCards[firstTurnedCardIndex].style.visibility = 'hidden'; // скрываем первую карту
            arrOfCards[firstTurnedCardIndex].classList.remove('cards__item--turned');
            arrOfCards[firstTurnedCardIndex].classList.remove('cards__item'); // убираем из массива
            firstTurnedCardId = null; // удаляем id первой карты
            firstTurnedCardIndex = null; // удаляем индекс первой карты из глобальной области видимости
          }, 500);
          if (arrOfCards.length < 4) { // вывод поздравлений игроку
            setTimeout(function() {
              outputResult();
            }, 700);
          }
        } else { // если id не совпали
          setTimeout(function() {
            e.target.style.backgroundImage = memoryObj.shirt; // закрываем вторую карту
            e.target.classList.toggle('cards__item--turned');
            arrOfCards[firstTurnedCardIndex].style.backgroundImage = memoryObj.shirt; // закрываем первую карту
            arrOfCards[firstTurnedCardIndex].classList.toggle('cards__item--turned');
            firstTurnedCardId = null; // удаляем id первой карты из глобальной области видимости
<<<<<<< HEAD
            firstTurnedCardIndex = null; // удаляем индекс первой карты из глобальной области видимости
=======
            firstTurnedCardIndex = null; // удаляем индекс первой карты из глобальной области видимости            
>>>>>>> 2685b78d0c3d4fdae50e00ada93b8f3c7dd01fc0
          }, 900);
        }
        break;
      }
    }
  }
});

// обработчики выделения выбранной опции
formListShirt.addEventListener('click', function(e) {
  for (let i = 0; i < formImage.length; i++) {
    formImage[i].classList.remove('form__active');
  }
  e.target.classList.toggle('form__active');
  formListShirt.classList.remove('form__active');
});

formListLevel.addEventListener('click', function(e) {
  for (let i = 0; i < formItemLevel.length; i++) {
    formItemLevel[i].classList.remove('form__active');
  }
  e.target.classList.add('form__active');
  formListLevel.classList.remove('form__active');
});

// валидация на вход в игру
btn.addEventListener('click', function(event) {
  event.preventDefault();
  if (document.getElementsByName('name')[0].value
  && document.getElementsByName('surname')[0].value
  && document.getElementsByName('email')[0].value) {
    rules.style.display = 'none';
    form.style.display = 'none';
    cards.style.display = 'block';
    init(cardsItem); // инициализация игры
    countTime = setInterval(calcTime, 1000); // запуск таймера
  } else {
    failure.classList.add('popup--show');
  }
});

// обработчики досрочного выхода из игрового поля
let cardsBtnClickHandler = function () {
  clearInterval(countTime); // остановка таймера
  calcTime(0, 0, 1); // обнуление таймера
  closeCardsField(); // выход из игрового поля
  cards.removeEventListener('click', cardsBtnClickHandler);
}

let enterPressHandler = function(event) {
  clearInterval(countTime);
  if (event.keyCode === ENTER_KEYCODE) {
    closeCardsField();
    cards.removeEventListener('keydown', enterPressHandler);
  }
}

cardsBtn.addEventListener('click', cardsBtnClickHandler);
cardsBtn.addEventListener('keydown', enterPressHandler);

// обработчик закрытия попапа
popupBtnFailure.addEventListener('click', function() {
if (failure.classList.contains('popup--show')) {
  failure.classList.remove('popup--show');
}
});

// обработчик закрытия попапов ESC
window.addEventListener('keydown', function(event) {
  if (event.keyCode === ESC_KEYCODE) {
    if (popupGame.classList.contains('popup--show')) {
      popupGame.classList.remove('popup--show');
      clearInterval(countTime); // остановка таймера
      closeCardsField(); // выход из игрового поля
    }
    if (failure.classList.contains('popup--show')) {
      failure.classList.remove('popup--show');
    }
  }
});

// обработчик для новой игры
popupBtnGame.addEventListener('click', function(event) {
  if (popupGame.classList.contains('popup--show')) {
    popupGame.classList.remove('popup--show');
  }
  cardsItems.innerHTML = ''; // удаление карт
  calcTime(0, 0, 1); // обнуление таймера
  init(cardsItem); // инициализация игры
  countTime = setInterval(calcTime, 1000);
});

// обработчик для выхода из игры
popupBtnExit.addEventListener('click', function() {
  if (popupGame.classList.contains('popup--show')) {
    popupGame.classList.remove('popup--show');
  }
  calcTime(0, 0, 1); // обнуление таймера
  closeCardsField(); // выход из игрового поля
});
