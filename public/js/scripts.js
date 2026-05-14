// Toggle menu visibility
const navToggle = document.querySelector('.nav-toggle');
const navigation = document.getElementById('hamButton');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  navigation.classList.toggle('show');
});
