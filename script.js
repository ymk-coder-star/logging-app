function addNewItem() {
	const dateNum = new Date().getTime();
	addToDOM(dateNum);
	addToStorage(dateNum);
	updateFormat();
}

function addToDOM(dateNum) {
	const li = document.createElement('li');
	li.setAttribute('data-timestamp', dateNum);
	li.innerHTML = 'Now';
	document.querySelector('.list').appendChild(li);
}

function addToStorage(item) {
	const listFromStorage = getFromStorage('list') ? getFromStorage('list') : [];
	listFromStorage.push(item);
	localStorage.setItem('list', JSON.stringify(listFromStorage));
}

function loadFromStorage() {
	if (getFromStorage('list')) {
		const listFromStorage = getFromStorage('list');
		listFromStorage.forEach((item) => addToDOM(item));
	}
}
function getFromStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

function deleteList() {
	if (confirm('This will permanently delete the entire list!')) {
		document.querySelector('.list').innerHTML = '';
		localStorage.removeItem('list');
	}
}

function updateFormat() {
	const items = document.querySelectorAll('.list li');
	items.forEach((item) => {
		const now = new Date();
		const timestamp = Number(item.dataset.timestamp);
		const timestampDate = new Date(timestamp);
		const diff = now - timestamp;
		const dayDiff = now.getDay() - timestampDate.getDay();
		const yearDiff = now.getFullYear() - timestampDate.getFullYear();
		switch (true) {
			case diff < 60000: //Less than a minute ago
				item.innerHTML = `${Math.floor(diff / 1000) === 1 ? '1 second ago' : `${Math.floor(diff / 1000)} seconds ago`}`;
				break;
			case diff < 3600000: //Less than an hour ago
				item.innerHTML = `${Math.floor(diff / 60000) === 1 ? '1 minute ago' : `${Math.floor(diff / 60000)} minutes ago`}`;
				break;
			case dayDiff === 0: //Today
				item.innerHTML = `${timestampDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
				break;
			case dayDiff === 1 || dayDiff === -6: //Yesterday
				item.innerHTML = `Yesterday ${timestampDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
				break;
			case diff / 604800000 < 1 && dayDiff !== 0: //Less than a week ago
				item.innerHTML = `${timestampDate.toLocaleDateString(undefined, { weekday: 'long' })}`;
				break;
			case yearDiff === 0: //This year
				item.innerHTML = `${timestampDate.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}`;
				break;
			default:
				item.innerHTML = `${timestampDate.toLocaleDateString()}`;
				break;
		}
	});
}

function init() {
	document.querySelector('.add-btn').addEventListener('click', addNewItem);
	document.querySelector('.clear-btn').addEventListener('click', deleteList);
	loadFromStorage();
	setInterval(updateFormat, 1000);
}

document.addEventListener('DOMContentLoaded', init);
