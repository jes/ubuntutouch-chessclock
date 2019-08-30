let activeclock = 0;
let clockstarted;
let flagged = 0;
let paused = false;

let startms = 300000;
let incrementms = 5000;
load_config();
let ms = [0, startms, startms];

function load_config() {
    if (localStorage.getItem("startms"))
        startms = parseInt(localStorage.getItem("startms"));
    if (localStorage.getItem("incrementms"))
        incrementms = parseInt(localStorage.getItem("incrementms"));
}

function save_config() {
    localStorage.setItem("startms", startms);
    localStorage.setItem("incrementms", incrementms);
}

$('#clock1').mousedown(function() {
    resolveclock();
    if (activeclock == 1)
        ms[1] += incrementms;
    activeclock = 2;
    redraw();
});
$('#clock2').mousedown(function() {
    resolveclock();
    if (activeclock == 2)
        ms[2] += incrementms;
    activeclock = 1;
    redraw();
});

$('#pause').click(function() {
    resolveclock();
    paused = !paused;
    if (paused) {
        $('#pause').text("▶");
    } else {
        $('#pause').text("▮▮");
    }
});

$('#reset').click(function() {
    ms[1] = startms;
    ms[2] = startms;
    activeclock = 0;
    paused = false;
    $('#pause').text("▮▮");
    flagged = 0;
});

$('#edit').click(function() {
    $('#mins').val(startms / 60000);
    $('#secs').val((startms%60000)/1000);
    $('#incsecs').val(incrementms/1000);
    $('#settings').css('display','block');
});

$('#save-settings').click(function() {
    startms = parseInt($('#mins').val())*60000 + parseInt($('#secs').val())*1000;
    incrementms = parseInt($('#incsecs').val()) * 1000;
    save_config();
    $('#settings').css('display','none');
});

$('#cancel-settings').click(function() {
    $('#settings').css('display','none');
});

function resolveclock() {
    if (activeclock && !paused) {
        ms[activeclock] -= (Date.now() - clockstarted);
        if (ms[activeclock] <= 0 && !flagged) {
            flagged = activeclock
        }
    }
    clockstarted = Date.now();
}

function redraw() {
    if (activeclock == 1) {
        $('#clock1').addClass('active');
        $('#clock2').removeClass('active');
    } else if (activeclock == 2) {
        $('#clock1').removeClass('active');
        $('#clock2').addClass('active');
    } else {
        $('#clock1').removeClass('active');
        $('#clock2').removeClass('active');
    }

    $('#clock1').text(strify(ms[1]) + (flagged == 1 ? " 🚩" : ""));
    $('#clock2').text(strify(ms[2]) + (flagged == 2 ? " 🚩" : ""));
}

function strify(ms) {
    if (ms >= 3600000) { // hours and minutes
        let hours = Math.floor(ms/3600000);
        let mins = Math.floor((ms-hours*3600000)/60000)
        return hours + ":" + pad(mins, 2);
    } else if (ms >= 60000) { // minutes and seconds
        let mins = Math.floor(ms/60000)
        let secs = Math.floor((ms-mins*60000)/1000);
        return mins + ":" + pad(secs, 2);
    } else if (ms >= 3000) { // seconds
        let secs = Math.floor(ms/1000);
        return "0:" + pad(secs, 2);
    } else if (ms > 0) { // seconds and hundredths
        let secs = Math.floor(ms/1000);
        let hundredths = Math.floor((ms-secs*1000)/10);
        return "0:0" + secs + "." + pad(hundredths, 2);
    } else {
        return "0:00.00";
    }
}

// https://stackoverflow.com/a/10073788
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

window.setInterval(function() {
    resolveclock();
    redraw();
}, 100);

redraw();
