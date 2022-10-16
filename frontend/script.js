let url = 'http://127.0.0.1:3000';

const searchString = document.querySelector('.info-users__search-string');

const infoUsersBlock = document.querySelector('.info-users__users-cards');

const popupBg = document.querySelector('.popup-bg');
const popup = document.querySelector('.popup');
const closePopup = document.querySelector('.popup__btn-close');
const userNamePopup = document.querySelector('.popup__name');
const phoneNumberPopup = document.querySelector('#phone-number');
const emailPopup = document.querySelector('#email');
const hireDatePopup = document.querySelector('#hire-date');
const positionNamePopup = document.querySelector('#position-name');
const departmentPopup = document.querySelector('#department');
const additionalInformationPopup = document.querySelector('.additional-information__text');

function noUserPrint() {
   const notFound = document.createElement('p');
   notFound.innerHTML = 'Сохранённых пользователей нет';
   notFound.classList.add('text');
   infoUsersBlock.appendChild(notFound);
}

function addCardsInfoUsers(dataUsers) {
   dataUsers.forEach(dataUser => {
      const cardInfoUser = document.createElement('div');
      infoUsersBlock.appendChild(cardInfoUser);
      cardInfoUser.classList.add('info-users__user-card');

      const name = document.createElement('p');
      name.innerHTML = dataUser['name'];
      name.classList.add('user-card__name');
      cardInfoUser.appendChild(name);

      const phone = document.createElement('div');
      phone.classList.add('user-card__phone');
      cardInfoUser.appendChild(phone);

      const phoneIcon = document.createElement('img');
      phoneIcon.src = '/image/phone.webp';
      phoneIcon.classList.add('user-card__phone-icon')
      phone.appendChild(phoneIcon);

      const phoneText = document.createElement('p');
      phoneText.innerHTML = dataUser['phone'];
      phone.appendChild(phoneText);

      const email = document.createElement('div');
      email.classList.add('user-card__email');
      cardInfoUser.appendChild(email);

      const emailIcon = document.createElement('img');
      emailIcon.src = '/image/mail.webp';
      emailIcon.classList.add('user-card__email-icon')
      email.appendChild(emailIcon);

      const emailText = document.createElement('a');
      emailText.innerHTML = dataUser['email'];
      emailText.href = 'mailto:' + dataUser['email'];
      email.appendChild(emailText);

      infoUsersBlock.appendChild(cardInfoUser);
   })
}

function fillPopup(dataUser) {
   userNamePopup.innerHTML = dataUser['name'];
   phoneNumberPopup.innerHTML = dataUser['phone'];
   phoneNumberPopup.href = 'tel:' + dataUser['phone'];
   emailPopup.innerHTML = dataUser['email'];
   emailPopup.href = 'mailto:' + dataUser['email']
   hireDatePopup.innerHTML = dataUser['hire_date'];
   positionNamePopup.innerHTML = dataUser['position_name'];
   departmentPopup.innerHTML = dataUser['department'];
   additionalInformationPopup.innerHTML = 'Разработчики используют Lorem ipsum в качестве заполнителя макета страницы. Так как дополнительной информации в JSON нет, а адрес нигде не ипользуется закину его союда: ' +
      dataUser['address']
}

function errorServerLog() {
   const error = document.createElement('h2');
   error.innerHTML = 'Упс.. Произошла ошибка!';
   infoUsersBlock.appendChild(error);
}

function addEventsToPopup(dataUsers) {
   
   const blocksOpenPopup = document.querySelectorAll('.info-users__user-card');
   
   for (let i = 0; i < blocksOpenPopup.length; i++) {
      let block = blocksOpenPopup[i];
      block.addEventListener('click', (e) => {
         if (e.target.nodeName.toUpperCase() == 'A') { 
            return true;
         }
         fillPopup(dataUsers[i]);
         popupBg.classList.add('active');
      })
   }

   closePopup.addEventListener('click', () => {
      popupBg.classList.remove('active')
   })

   document.addEventListener('click', (e) => {
      if (e.target === popupBg) {
         popupBg.classList.remove('active')
      }
   })
}

function showLoader() {
   const loader = document.createElement('div');
   loader.classList.add('loader');
   infoUsersBlock.appendChild(loader);
}

function hideLoader() {
   const loader = document.querySelector('.loader');
   loader.remove();
}

async function getInfoUsers() {

   showLoader();
   let response;
   try {
      response = await fetch(url);
   } catch {
      errorServerLog();
   } finally {
      hideLoader();
   }
   
   let dataUsers = await response.json();

   if(!response.ok) {
      errorServerLog();
   }

   if (dataUsers.length === 0) {
      noUserPrint();
      return;
   }

   addCardsInfoUsers(dataUsers);
   addEventsToPopup(dataUsers);
}

getInfoUsers();

searchString.addEventListener('input', () => {
   url = 'http://127.0.0.1:3000?term=' + searchString.value;
   while (infoUsersBlock.firstChild) {
      infoUsersBlock.removeChild(infoUsersBlock.lastChild);
   }
   getInfoUsers();
})