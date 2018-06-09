'use strict';

const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
const rules = document.querySelector('.rules');
const form = document.querySelector('.form');
const btn = document.querySelector('.form__btn');
const formListShirt = document.querySelector('.form__list--shirt');
const formImage = document.querySelectorAll('.form__image');
const formListLevel = document.querySelector('.form__list--level');
const formItemLevel = document.querySelectorAll('.form__text--level');

const cards = document.querySelector('.cards');
const cardsBtn = document.querySelector('.cards__btn');
const cardsItems = document.querySelector('.cards__items');
const timeInSeconds = document.getElementById('sec');
const timeInMinutes = document.getElementById('min');
let countTime;

const popupGame = document.querySelector('.popup--game');
const popupBtnExit = document.querySelector('.popup__btn--exit');
const failure = document.querySelector('.popup--failure');
const popupBtnFailure = document.querySelector('.popup__btn--failure');
const popupTime = document.querySelector('.popup__title--time'); // поле вывода результата игроку
const popupBtnGame = document.querySelector('.popup__btn--game');
const popupTable = document.querySelector('.popup__table');

let firstTurnedCardIndex; // дефолтное значение индекса первой карты
let firstTurnedCardId; // дефолтное значение data-id первой карты

const player = { // объект с инфой игрока
  name: null,
  surname: null,
  email: null,
  score: null
};
let ratingList = []; // массив всех результатов
let ratingItem = []; // массив куда запишем имя и время

let memoryObj = {}; // запоминает какую выбрали рубашку и сложность для игры
let newArrCardsRandomAndSelected = []; // массив рандомных карт согласно опций
const dataOfCards = [
  {dataId: 1, backgroundImage: 'Barney_Gumble.jpg'},
  {dataId: 2, backgroundImage: 'Clancy_Wiggum.jpg'},
  {dataId: 3, backgroundImage: 'Bart_Simpson.jpg'},
  {dataId: 4, backgroundImage: 'Eleanor_Abernathy.jpg'},
  {dataId: 5, backgroundImage: 'Groundskeeper_Willie.jpg'},
  {dataId: 6, backgroundImage: 'Homer_Simpson.jpg'},
  {dataId: 7, backgroundImage: 'Horatio_McCallister.jpg'},
  {dataId: 8, backgroundImage: 'Fat_Tony.jpg'},
  {dataId: 9, backgroundImage: 'Mr_Burns.jpg'},
  {dataId: 10, backgroundImage: 'Moe_Szyslak.jpg'},
  {dataId: 11, backgroundImage: 'Abraham_Simpson.jpg'},
  {dataId: 12, backgroundImage: 'Seymour_Skinner.jpg'}
];

// функция рандомного перемешивания
Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = this[randomIndex];
    this[randomIndex] = this[i];
    this[i] = itemAtIndex;
  }
  return this;
}

// функция создания рандомного массива согласно выбранного уровня
function randomMixArrays(start, end) {
  let arrCut = dataOfCards.slice(start, end);
  let arrCopy = arrCut.slice();
  newArrCardsRandomAndSelected = arrCut.concat(arrCopy);
  newArrCardsRandomAndSelected.shuffle();
  return newArrCardsRandomAndSelected;
}

const fragment = document.createDocumentFragment();
const cardsItem = document.createElement('img');
fragment.appendChild(cardsItem);
cardsItem.classList.add('cards__item');

// функция начала игры
function init(obj) {
  // рандомное перемешивание первонач массива
  dataOfCards.shuffle();
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
  const newCard = document.createElement('img');
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
    elem.className = 'cards__item  cards__item--medium-difficulty';
    if (newArrCardsRandomAndSelected.length < 18) {
      elem.className = 'cards__item  cards__item--low-difficulty';
    }
    if (newArrCardsRandomAndSelected.length > 18) {
      elem.className = 'cards__item  cards__item--hard-difficulty';
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

  // заполняем профиль игрока в объект и добавляем в хранилище
  player.name = document.getElementsByName('name')[0].value;
  player.surname = document.getElementsByName('surname')[0].value;
  player.email = document.getElementsByName('email')[0].value;
  player.score = +timeInMinutes.textContent * 60 + +timeInSeconds.textContent; // перевод в секунды
  window.localStorage.setItem('player', JSON.stringify(player)); // в хранилище будет добавлено значение

  // добавляем время игрока в массив и сохраняем таблицу 10-ти лучших в хранилище
  ratingList = JSON.parse(window.localStorage.getItem('ratingList')); // вернёт массив значений лежащих в хранилище
  if (!ratingList) {
    ratingList = [];
  }
  if (ratingList.length == 10) {
    ratingList.sort(function(a, b) {
      return a[1] - b[1];
    });
    ratingList = ratingList.slice(0, 9);
  }

  const nameUser = document.getElementsByName('name')[0].value;
  let scoreUser = +timeInMinutes.textContent * 60 + +timeInSeconds.textContent; // перевод в секунды
  ratingItem[0] = nameUser;
  ratingItem[1] = scoreUser;
  ratingList.push(ratingItem);

  if ((ratingList.length > 0) && ratingList[ratingList.length - 1][1] > scoreUser) {
    ratingList[ratingList.length - 1][0] = nameUser;
    ratingList[ratingList.length - 1][1] = scoreUser;
  }
  if (ratingList.length > 1) {
    ratingList.sort(function(a, b) {
      return a[1] - b[1];
    });
  }
  window.localStorage.setItem('ratingList', JSON.stringify(ratingList)); // в хранилище будет добавлено значение

  // отрисовываем таблицу результатов
  const ratingTable = document.createElement('table');
  const headRow = document.createElement('tr');
  ratingTable.appendChild(headRow);
  ratingTable.classList.add('popup__table-tag');

  // отрисовываем шапку
  for (let i = 0; i < 3; i++) {
    const headCell = document.createElement('th');
    headCell.classList.add('popup__cell');
    if (i == 0) headCell.innerHTML = '№';
    if (i == 1) headCell.innerHTML = 'Name';
    if (i == 2) headCell.innerHTML = 'Time';
    headRow.appendChild(headCell);
  }

  for (let i = 0; i < 10; i++) {
    const tableRow = document.createElement('tr');
    ratingTable.appendChild(tableRow);
    for (let j = 0; j < 3; j++) {
      const tableCell = document.createElement('td');
      if (j == 0) tableCell.innerHTML = `${i + 1}`; // внести номер позиции
      if (ratingList[i]) {
        if (j == 1) tableCell.innerHTML = `${ratingList[i][0]}`; // внести имя
        if (j == 2) tableCell.innerHTML = `${ratingList[i][1]}`; // внести время
      }
      tableCell.classList.add('popup__cell');
      tableRow.appendChild(tableCell);
    }
  }
  popupTable.appendChild(ratingTable);
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
    const arrOfCards = document.querySelectorAll('.cards__item'); // массив карт
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
            firstTurnedCardIndex = null; // удаляем индекс первой карты из глобальной области видимости
          }, 700);
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
