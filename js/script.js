(function (window, document) {
	const words = document.getElementById('words');
	const startBtn = document.getElementById('startBtn');
	const ruWordSel = document.getElementById('ruWords');
	const engWordSel = document.getElementById('engWords');
	const questions = document.getElementById('questions');
	const nextBtn = document.getElementById('nextBtn');
	const word = document.getElementById('word');
	const count = document.getElementById('count');
	const question = document.getElementById('question');
	const output = document.getElementById('output');
	const itog = document.getElementById('itog');
	const restartBtn = document.getElementById('restart');
	const homeBtn = document.getElementById('home');
	let ruWords, engWords, ruWordsArr, engWordsArr, rndmNum, i = 1, trueWord, trueAnswers, hasWords = [];

	startBtn.addEventListener('click', function () {
		if (ruWordSel.value.trim() != '' && engWordSel.value.trim() != '') {
			ruWords = ruWordSel.value.trim();
			engWords = engWordSel.value.trim();
			ruWordsArr = ruWords.split('\n');
			engWordsArr = engWords.split('\n');
			if (ruWordsArr.length != engWordsArr.length) {
				alert('Кол-во русских и английских слов разняться!');
			}
			else {
				questions.style.display = 'block';
				words.style.display = 'none';
				rndmNum = getRandomIntInclusive(1, ruWordsArr.length);
				hasWords.push(rndmNum);
				count.textContent = i + '/' + ruWordsArr.length;
				word.textContent = ruWordsArr[rndmNum - 1];
				// readText(word.textContent);
				trueWord = engWordsArr[rndmNum - 1];
				trueAnswers = ruWordsArr.length;
				words.style.display = 'none';
			}
		}
		else {
			alert('Не допускаются пустые поля!');
		}
	});
	let tr, td;
	nextBtn.addEventListener('click', nextWord);
	document.body.addEventListener('keydown', function (e) {
		if (e.target == this && e.key == 'Enter' && questions.style.display == 'block') {
			nextWord();
		}
	});

	homeBtn.addEventListener('click', function () {
		location.reload();
	});
	restartBtn.addEventListener('click', function () {
		i = 1;
		output.innerHTML = '<tr><th>Неправильно</th><th>Правильно</th><th>Перевод</th></tr>';
		itog.style.display = 'none';
		words.style.display = 'block';
		hasWords = [];
	});

	function nextWord() {
		if (question.value.toLocaleLowerCase().trim() != trueWord.toLocaleLowerCase().trim()) {
			trueAnswers--;
			tr = document.createElement('tr');
			td = document.createElement('td');
			td.textContent = question.value;
			tr.appendChild(td);
			td = document.createElement('td');
			td.textContent = trueWord;
			tr.appendChild(td);
			td = document.createElement('td');
			td.textContent = word.textContent;
			tr.appendChild(td);
			output.appendChild(tr);
		}
		i++;
		count.textContent = i + '/' + ruWordsArr.length;
		question.value = '';
		do {
			rndmNum = getRandomIntInclusive(1, ruWordsArr.length);
		} while ((hasWords.some(function (el) { return el == rndmNum })) && (i <= ruWordsArr.length));
		hasWords.push(rndmNum);
		word.textContent = ruWordsArr[rndmNum - 1];
		// if (i <= ruWordsArr.length) {
		// 	readText(word.textContent);
		// }
		trueWord = engWordsArr[rndmNum - 1];
		if (i > ruWordsArr.length) {
			tr = document.createElement('tr');
			td = document.createElement('td');
			td.textContent = trueAnswers + '/' + ruWordsArr.length + 'кол-во правильных ответов';
			tr.appendChild(td);
			output.appendChild(tr);
			itog.style.display = 'block';
			questions.style.display = 'none';
		}
	}

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min); max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// const synth = window.speechSynthesis;

	// function readText(text) {
	// 	synth.cancel();

	// 	const utterance = new SpeechSynthesisUtterance(text);

	// 	utterance.lang = 'ru-RU';
	// 	utterance.rate = 1;
	// 	utterance.pitch = 1;

	// 	synth.speak(utterance);
	// }

	const speakBtn = document.getElementById('speakBtn');
	const audioContext = new AudioContext();
	const speechRecognition = new webkitSpeechRecognition();
	speechRecognition.lang = 'en-US';
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
			const audioSource = audioContext.createMediaStreamSource(stream);
		});

	speakBtn.addEventListener('click', () => {
		speechRecognition.start();

		speechRecognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;

			const text = transcript;
			question.value = text;
		};

		// audioSource.disconnect();
	});

	ruWordSel.addEventListener('input', resizeArea);

	engWordSel.addEventListener('input', resizeArea);

	function resizeArea() {
		ruWordSel.style.height = ruWordSel.scrollHeight + 'px';
		engWordSel.style.height = ruWordSel.scrollHeight + 'px';
		ruWordSel.style.height = engWordSel.scrollHeight + 'px';
		engWordSel.style.height = engWordSel.scrollHeight + 'px';
	}
})(window, document);