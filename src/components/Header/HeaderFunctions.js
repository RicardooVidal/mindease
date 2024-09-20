export function showUserMenu() {
    const userImg = document.querySelector("#user-menu");

    if (checkStyleDisplay(userImg)) {
        return;
    }

    userImg.style.display = 'block';
}

function checkStyleDisplay(item) {
    if (item.style.display == 'block') {
        item.style.display = 'none';
        return true;
    }

    return false;
}