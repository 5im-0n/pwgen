function randPassword(length, includeSpecial, exclude) {
	let pwdChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	if (includeSpecial) {
		pwdChars += '!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~';
	}

	if (exclude) {
		exclude.split('').forEach(c => {
			pwdChars = pwdChars.split(c).join('');
		});
	}

	let randValues = new Uint32Array(length);
	let randPwd = '';
	window.crypto.getRandomValues(randValues);
	for (i = 0; i < length; i++) {
		randPwd += pwdChars[randValues[i] % pwdChars.length];
	}
	return randPwd;
}

function generateLength() {
	return Math.floor(Math.random() * (getParams().lengthMax - getParams().lengthMin + 1) + getParams().lengthMin);
}

function getParams() {
	return {
		lengthMin: parseInt(document.getElementById('length-min').value),
		lengthMax: parseInt(document.getElementById('length-max').value),
		special: document.getElementById('special').checked,
		exclude: document.getElementById('exclude').value,
		directcopy: document.getElementById('directcopy').checked
	};
}

function loadOptions() {
	return browser.storage.local.get({
		lengthMin: 14,
		lengthMax: 17,
		special: true,
		exclude: 'iIl|10o8B3Evu![]{}',
		directcopy: false
	});
}

function saveOptions(options) {
	return browser.storage.local.set(options);
}

function copypasstoclippboard(cb) {
	setTimeout(function() {
		var copyText = document.getElementById('pw');
		copyText.select();
		document.execCommand('copy');
		if (typeof(cb) === 'function') {
			cb();
		}
		fade(document.getElementsByClassName('copied')[0]);
	}, 200);
}

function fade(element) {
	var clone = element.cloneNode(true);
	clone.style.display = 'block';
	element.parentNode.insertBefore(clone, element.nextSibling);

	setTimeout(() => {
		clone.className += ' fadeout';
	}, 500);

	setTimeout(() => {
		clone.remove();
	}, 1600);
}

document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('new').addEventListener('click', (ev) => {
		ev.preventDefault();
		var params = getParams();
		document.getElementById('pw').value = randPassword(generateLength(), params.special, params.exclude);

		if (params.directcopy) {
			copypasstoclippboard();
		}
	});

	document.getElementById('copy').addEventListener('click', (ev) => {
		ev.preventDefault();
		copypasstoclippboard();
	});

	var list = document.getElementsByTagName('input');
	for (var i = 0; i < list.length; i++) {
		list[i].addEventListener('change', (ev) => {
			saveOptions(getParams());
		});
	}

	loadOptions().then((options) => {
		document.getElementById('length-min').value = options.lengthMin;
		document.getElementById('length-max').value = options.lengthMax;
		document.getElementById('special').checked = options.special;
		document.getElementById('exclude').value = options.exclude;
		document.getElementById('directcopy').checked = options.directcopy;
		document.getElementById('pw').value = randPassword(generateLength(), getParams().special, getParams().exclude);

		if (options.directcopy) {
			copypasstoclippboard();
		}
	});

});
