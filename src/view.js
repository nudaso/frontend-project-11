export default (state, elements) => (path, value, preValue) => {
  if (path === 'isValid') {
    switch (value) {
      case true: {
        elements.feedback.textContent = '';
        elements.input.classList.remove('is-invalid');
        elements.input.classList.add('is-valid');
        break;
      };
      case false: {
        elements.feedback.textContent = state.errMessage;
        elements.input.classList.add('is-invalid');
        elements.input.classList.remove('is-valid');
        break;
      };
    }
    console.dir(state);
  }
};
