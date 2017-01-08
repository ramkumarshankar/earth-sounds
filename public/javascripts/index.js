function toggleOverlay() {
    var overlay = document.getElementById('overlay');
    if (document.querySelector('.open') == null) {
        overlay.classList.add('open');
        overlay.classList.remove('close');
    }
    else {
        overlay.classList.remove('open');
        overlay.classList.add('close');
    }
}

var triggerButton = document.getElementById('overlay-button');
var triggerCloseButton = document.getElementById('overlay-close-button');
triggerButton.addEventListener( "click", toggleOverlay );
triggerCloseButton.addEventListener( "click", toggleOverlay );