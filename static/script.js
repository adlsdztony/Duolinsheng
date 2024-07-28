var my_list, days;
var currentIndex = 0;
var file_name = 'Karis';
var learn_words = 2;


function confettiJs() {
    const duration = 2 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
}

var audioPlayer = document.getElementById('audioPlayer');
var word_check = 1;

function displayNextItem() {
    var show_word = my_list[currentIndex]
    document.getElementById('itemDisplay').innerText = show_word;
    if (show_word.charAt(0) == '~') {
        var endIndex = show_word.indexOf("\n", 33);
        if (endIndex === -1) {
            endIndex = show_word.length;
        }
        var extracted_word = show_word.substring(33, endIndex);
        audioPlayer.src = "http://dict.youdao.com/dictvoice?type=1&audio=" + extracted_word;
        audioPlayer.play();
    } else {
        if (word_check % 2 == 1) {
            audioPlayer.src = "http://dict.youdao.com/dictvoice?type=1&audio=" + show_word;
            audioPlayer.play();
            word_check++;
        } else {
            word_check++;
        }
    }

    currentIndex++;
    if (currentIndex >= my_list.length) {
        currentIndex = 0;
        document.getElementById('itemDisplay').innerText = 'Congratulations!\n连胜' + days + '天';
        confettiJs();
    }
}


function send_post() {
    var promise = new Promise(function (resolve, reject) {
        var data = JSON.stringify({ file_name: file_name, learn_words: learn_words });
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/get_start", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                my_list = response.my_list;
                days = response.days;
                resolve([my_list, days]);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send(data);
    })
    return promise;
}

async function display_review() {
    var get_data = await send_post();
    my_list = get_data[0];
    days = get_data[1];
    displayNextItem();
}

var start_flag = true;
var select_btn = document.getElementById('radio-buttons');
var btn = document.getElementById('itemDisplay');
var input_learn_words = document.getElementById('input');

btn.addEventListener('click', function () {
    if (start_flag) {
        learn_words = input_learn_words.value;
        document.cookie = "learn_words=" + learn_words;
        display_review();
        start_flag = false;
        select_btn.style.display = 'none';
        input_learn_words.style.display = 'none';
        review_btn.style.display = 'none';
    } else {
        displayNextItem();
    }
});


const radioButtons = document.querySelectorAll('.radio-button input[name="option"]');
let selectedOption;

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            selectedOption = this.value;
            file_name = selectedOption;
            document.cookie = "username=" + selectedOption;
        }
    });
});

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

const username = getCookie('username');
if (username) {
    if (username === 'Karis') {
        file_name = 'Karis';
        radioButtons[0].checked = true;
    } else if (username === 'Tracy') {
        file_name = 'Tracy';
        radioButtons[1].checked = true;
    }
} else {
    console.log("No username cookie found.");
}

var learn_words_cookie = getCookie('learn_words');
if (learn_words) {
    input_learn_words.value = learn_words_cookie;
} else {
    console.log("No learn_words cookie found.");
}

// 
function playAudio() {
    var audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.play();
}


function send_post_to_get_review() {
    var promise = new Promise(function (resolve, reject) {
        var data = JSON.stringify({ file_name: file_name});
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/get_review", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                my_list = response.res;
                days = response.days;
                resolve([my_list, days]);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send(data);
    })
    return promise;
}

async function display_review_to_get_review() {
    var get_data = await send_post_to_get_review();
    my_list = get_data[0];
    // my_list = ['test1', 'test2', 'test3'];
    days = get_data[1];
    if (Array.isArray(my_list)) {
        start_flag = false;
        review_btn.style.display = 'none';
        select_btn.style.display = 'none';
        input_learn_words.style.display = 'none';
        displayNextItem();
    } else {
        alert('Learn it once!');
    }
}

var review_btn = document.getElementById('review_btn');
review_btn.addEventListener('click', function () {
    display_review_to_get_review();
});

