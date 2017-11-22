function randPassword(length, includeSpecial) {
  let pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (includeSpecial) {
    pwdChars += '°^!"§$%&/()=?`´\\}][{²³€|<>-.,;:*+_µ@~';
  }

  let randValues = new Uint32Array(length);
  let randPwd = '';
  window.crypto.getRandomValues(randValues);
  for(i=0; i<length; i++)
  {
    randPwd += pwdChars[randValues[i] % pwdChars.length];
  }
  return randPwd;
}

function getParams() {
  return {
    length: parseInt(document.getElementById('length').value),
    special: document.getElementById('special').checked,
    directcopy: document.getElementById('directcopy').checked
  }
}

function loadOptions() {
  return browser.storage.local.get({
    length: 14,
    special: true,
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
  }, 200);
}

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
        clearInterval(timer);
        element.style.display = 'none';
    }
    element.style.opacity = op;
    op -= op * 0.1;
  }, 50);
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('new').addEventListener('click', (ev) => {
    ev.preventDefault();
    var params = getParams();
    document.getElementById('pw').value = randPassword(params.length, params.special);
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
    document.getElementById('length').value = options.length;
    document.getElementById('special').checked = options.special;
    document.getElementById('directcopy').checked = options.directcopy;
    document.getElementById('pw').value = randPassword(getParams().length, getParams().special);

    if (options.directcopy) {
      copypasstoclippboard(() => {
        let copied = document.getElementById('copied');
        copied.style.display = 'block';
        fade(copied)
      });
    }
  });

});
