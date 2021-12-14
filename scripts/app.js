const app = {
  init() {
    app.keys = document.querySelectorAll('.calculator__keyboard__key');
    app.keys.forEach(element => element.addEventListener('click', () => console.log('coucou')));
  },
};

document.addEventListener('DOMContentLoaded', app.init);