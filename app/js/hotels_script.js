const rangeMin = document.querySelector('.range-line__min');
const rangeMax = document.querySelector('.range-line__max');
let rangeValMin = document.querySelector('.range-value__min span');
let rangeValMax = document.querySelector('.range-value__max span');
let filters = document.querySelector('.sort-list__features');
let filtersAsc = document.querySelector('.sort-list__price');
let form = document.querySelector('.filter-form');

const hotels = [
    {
        name: 'Amara Resort & Spa',
        type: 'Гостиница',
        price: 4000,
        rating: 8.5,
        photo: 'img/filter-photo-1.jpg',
        stars: 4,
        infrastructure: ['бассейн', 'парковка', 'wi-fi']
    },
    {
        name: 'Desert Quail Inn',
        type: 'Мотель',
        price: 3000,
        rating: 8.9,
        photo: 'img/filter-photo-2.jpg',
        stars: 3,
        infrastructure: ['бассейн', 'wi-fi']
    },
    {
        name: 'Villas at Poco Diablo',
        type: 'Апартаменты',
        price: 2000,
        rating: 9.2,
        photo: 'img/filter-photo-3.jpg',
        stars: 2,
        infrastructure: ['бассейн']
    },
    {
        name: 'Sedona Paradise',
        type: 'Гостиница',
        price: 4300,
        rating: 8.2,
        photo: 'img/filter-photo-1.jpg',
        stars: 4,
        infrastructure: ['бассейн', 'парковка', 'wi-fi']
    },
    {
        name: 'Villas at Sunset',
        type: 'Апартаменты',
        price: 1500,
        rating: 9.7,
        photo: 'img/filter-photo-3.jpg',
        stars: 2,
        infrastructure: ['wi-fi']
    },
    {
        name: 'Desert Rock',
        type: 'Мотель',
        price: 3200,
        rating: 9.1,
        photo: 'img/filter-photo-2.jpg',
        stars: 3,
        infrastructure: ['бассейн', 'wi-fi']
    },
];

let currentHotels = [
    {
        name: 'Villas at Poco Diablo',
        type: 'Апартаменты',
        price: 2000,
        rating: 9.2,
        photo: 'img/filter-photo-3.jpg',
        stars: 2,
        infrastructure: ['бассейн']
    },
];

function changeRangeValueMin(event) {
    event.preventDefault();
    if (this.value < rangeMax.value) {
        rangeValMin.textContent = this.value;
    } else {
        this.value = rangeValMin.textContent;
    }
}

function changeRangeValueMax(event) {
    event.preventDefault();
    if (this.value > rangeMin.value) {
        rangeValMax.textContent = this.value;
    } else {
        this.value = rangeValMax.textContent;
    }
}

function createHotels() {
    let results = document.querySelector('.section-results');
    if(!results) {
        return
    }
    results.innerHTML = '';
    const template = document.querySelector('#result').content.querySelector('.result');
    if (template) {
        let fragment = document.createDocumentFragment();
        for (let hotel of currentHotels) {
            let node = template.cloneNode(true);
            node.querySelector('.photo img').setAttribute('src', hotel.photo);
            node.querySelector('.photo img').setAttribute('srcset', hotel.photo.slice(0, -4) + '@2x.jpg');
            node.querySelector('.section-title__dark').textContent = hotel.name;
            node.querySelector('.section-text__dark').textContent = hotel.type;
            node.querySelectorAll('.section-text__dark')[1].querySelector('span').textContent = hotel.price;
            node.querySelector('.value .section-text__dark span').textContent = hotel.rating.toLocaleString();
            let stars = node.querySelector('.stars');
            for (let i = 1; i < hotel.stars; i++) {
                stars.appendChild(node.querySelector('.star').cloneNode(true));
            }
            fragment.appendChild(node);
        }
        results.appendChild(fragment);
    }
    document.querySelector('.section-cramps .section-title__dark span').textContent = currentHotels.length;
}

function filterByProperty(property){
    currentHotels.sort(function (a, b) {
        switch (property) {
            case 'price':
            case 'rating':
                return a[property] - b[property];
            case 'type':
                return a[property].localeCompare(b[property])
        }
    });
    if (filtersAsc.querySelector('input[type="radio"]:checked').value === 'maxFirst'){
        currentHotels.reverse();
    }
}

function changeFilter(event) {
    let target = event.target.closest('input[type="radio"]');
    let filterList = this.querySelectorAll('input[type="radio"]');
    filterList.forEach(item => item.parentNode.parentNode.classList.remove('sort-item__active'));
    target.parentNode.parentNode.classList.add('sort-item__active');
    if (target.getAttribute('name') === 'sorting_type') {
        filterByProperty(target.value);
    } else {
        currentHotels.reverse()
    }
    createHotels();
}

function generateHotels(event) {
    event.preventDefault();
    currentHotels = hotels.filter((item) => {
        const infra = Array.from(form.querySelectorAll('.fieldset-infrastructure input[type="checkbox"]:checked')).map(i => i.value);
        return item.infrastructure.some(i => infra.includes(i));
    })
        .filter((item) => {
            const types = Array.from(form.querySelectorAll('.fieldset-apartment input[type="checkbox"]:checked')).map(i => i.value);
            return types.includes(item.type);
        })
        .filter((item) => {
            const minPrice = +form.querySelector('.range-line__min').value;
            const maxPrice = +form.querySelector('.range-line__max').value;
            return item.price < maxPrice && item.price >= minPrice
        });
    filterByProperty(filters.querySelector('input[type="radio"]:checked').value);
    createHotels();
}

if (rangeMin && rangeMax) {
    rangeMin.addEventListener('input', changeRangeValueMin);
    rangeMax.addEventListener('input', changeRangeValueMax);
}

if (filters) {
    filters.addEventListener('input', changeFilter);
    filtersAsc.addEventListener('input', changeFilter);
    form.addEventListener('submit', generateHotels);
}

createHotels();
