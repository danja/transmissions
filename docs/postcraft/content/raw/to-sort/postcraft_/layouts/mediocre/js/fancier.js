const themeSelect = document.getElementById('theme-select');

themeSelect.addEventListener('change', () => {
    const bodyStyle = window.getComputedStyle(document.body);
    console.log(bodyStyle);
    const backgroundColor = bodyStyle.getPropertyValue('--background');
    const textColor = bodyStyle.getPropertyValue('--text-color');

    if (themeSelect.value === 'dark') {
        document.body.style.background = 'black';
        document.body.style.color = 'white';
    } else {
        document.body.style.background = 'white';
        document.body.style.color = 'black';
    }
});

// https://www.freecodecamp.org/news/use-local-storage-in-modern-applications/#heading-code-example-for-local-storage

/*
themeSelect.addEventListener('change', () => {
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('light-theme');
    if (themeSelect.value === 'dark') {
        document.body.classList.add('dark-theme');
    }
    if (themeSelect.value === 'light') {
        document.body.classList.add('light-theme');
    }
});
*/
