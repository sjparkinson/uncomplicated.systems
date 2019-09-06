// Append an anchor link to each article header.
document.querySelectorAll('article h3, article h4, article h5, article h6')
    .forEach(header => {
        if (header.id) {
            header.innerHTML = `${header.innerHTML} <a href="#${header.id}">#</a>`
        }
    });