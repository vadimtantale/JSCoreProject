//элементы разметки
const input = document.querySelector('.search__request');//окно поиска
const variants = document.querySelector('.search__items');//подсказки при поиске
const selectButtons = document.querySelectorAll('.search__result');
const listRepositories = document.querySelector('.result__items');//блок с добавленными репозиториями

const template = document.querySelector('#result')
												 .content
												 .firstElementChild;//блок-шаблон с информацией о репозитории

const debouncedFetch = debounce(fetchResponse, 500);
//обработчики
input.addEventListener('input', (e) => {
	debouncedFetch();
});

document.addEventListener('click', (e) => {
	e.preventDefault();
	const target = e.target;
	if(target.classList.contains('search__result')) {
		createElement(target);
	}
});

document.addEventListener('click', (e) => {
	e.preventDefault();
	const target = e.target;
	if(target.classList.contains('button')) {
		target.closest('.result__item').remove();
	}
});


//функции
function debounce(callback, ms) {
	let timeout;
	return function() {
		const f = () => {
			callback.apply(this, arguments)
		};
		clearTimeout(timeout);
		timeout = setTimeout(f, ms);
	}
};

function fetchResponse() {
	if(input.value) {
		fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=${selectButtons.length}`)
		.then(response => response.json())
		.then(data => getItems(data))
		.then(() => variants.classList.add('search__items--visible'))
	} else {
		variants.classList.remove('search__items--visible');
	};
};

function getItems(data) {
		const arrNecessaryData = data.items.map(item => {
			const {
					name: account = 'unknown',
					owner: {login: owner = 'unknown'},
					stargazers_count: stars = 'unknown',
				} = item;
			return {account, owner, stars};
		});
		
		nameSelectButton(arrNecessaryData);
};

function nameSelectButton(arr) {
	selectButtons.forEach((item, i) => {
		item.textContent = arr[i].account;
		item.dataset.account = arr[i].account;
		item.dataset.owner = arr[i].owner;
		item.dataset.stars = arr[i].stars;
		item.dataset.id = i;
	});

}

function createElement(button) {
	const elem = template.cloneNode(true);
	elem.querySelector('.result__data--account').textContent = `Name: ${button.dataset.account.substring(0, 20)}`;
	elem.querySelector('.result__data--owner').textContent = `Owner: ${button.dataset.owner.substring(0, 20)}`;
	elem.querySelector('.result__data--stars').textContent = `Stars: ${button.dataset.stars.substring(0, 20)}`;
	listRepositories.append(elem);
}