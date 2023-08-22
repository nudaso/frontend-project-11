export default (state, elements, i18nextInstance) => (path, value, preValue) => {
  switch (path) {
    case 'uiState.form.messageKey': {
      if (value === 'successMessage') {
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
        elements.feedback.textContent = i18nextInstance.t(value);
      } else {
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
        elements.feedback.textContent = i18nextInstance.t(value);
      }
    }
  }
};
