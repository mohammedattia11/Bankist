'use strict';
document.addEventListener('DOMContentLoaded', () => window.scrollTo(0, 0));
/////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const ltBtn = document.querySelector('.slider__btn--left');
const rtBtn = document.querySelector('.slider__btn--right');
const scrollBtn = document.querySelector('.btn--scroll-to');

const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const operationsTab = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const sections = document.querySelectorAll('.section');
const lazyImgs = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

// ? working with modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// *Working with slider
const creatingDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide="${i}"></button>`
    );
  });
};
creatingDots();

const activeDot = function (slide) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};
activeDot(0);

const goSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goSlide(currentSlide);
  activeDot(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goSlide(currentSlide);
  activeDot(currentSlide);
};
goSlide(0);

// * modal handler

btnOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// * working with cookies

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'we used cookies for improving functionality <button class = "btn btn--close--cookie">Got it!</button>';
header.append(message);
const closeCookies = document.querySelector('.btn--close--cookie');
closeCookies.addEventListener('click', () => message.remove());
// * applying Scroll
scrollBtn.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
  e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// * implementing tab component

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  operationsTab.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//* implementing hover effect on nav

nav.addEventListener('mouseover', hoverHandler.bind(0.5));
nav.addEventListener('mouseout', hoverHandler.bind(1));
const stickNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
// * sticky nav bar
const headerObserver = new IntersectionObserver(stickNav, {rootMargin : '-200px'});
headerObserver.observe(header);

const sectionsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
  });
});
sections.forEach(section => {
  sectionsObserver.observe(section);
});
// * Lazy load handler
const imgObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: '200px' }
);
lazyImgs.forEach(img => imgObserver.observe(img));
//* slider handler /////
rtBtn.addEventListener('click', function () {
  nextSlide();
});

ltBtn.addEventListener('click', function () {
  prevSlide();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
});

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const { slide } = e.target.dataset;
  goSlide(slide);
  activeDot(currentSlide);
});
