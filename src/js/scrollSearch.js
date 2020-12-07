export function searchRemove() {
    const searchBtn = document.querySelector(".search");
    if (document.querySelector(".card-section").scrollTop > 120) {
        searchBtn.classList.add("blurred");
    } else if (document.querySelector(".card-section").scrollTop === 0) {
        searchBtn.classList.remove("blurred");
    }
    searchBtn.addEventListener('click', () => {
        searchBtn.classList.remove('blurred');
    });
}