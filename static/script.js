var my_list, days;
var currentIndex = 0;


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


function displayNextItem() {
    document.getElementById('itemDisplay').innerText = my_list[currentIndex];
    currentIndex++;
    if (currentIndex > my_list.length) {
        currentIndex = 0;
        document.getElementById('itemDisplay').innerText = 'Congratulations!\n连胜' + days + '天';
        confettiJs();
    }
}


function send_post() {
    var promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/get_review", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                my_list = response.my_list;
                days = response.days;
                resolve([my_list, days]);
            }else{
                reject(xhr.statusText);
            }
        };
        xhr.send();
        console.log("async ing");
    })
    return promise;
}

async function display_review() {
    var data = await send_post();
    my_list = data[0];
    days = data[1];
    displayNextItem();
}

var start_flag = true;

document.addEventListener('click', function () {
    if (start_flag) {
        display_review();
        start_flag = false;
    } else {
        displayNextItem();
    }

});


