export const validateForm = (... elms) => {

    const [ topic, details ] = elms;

    /**
     * Validating topic
     */
    if (!topic.value) {
        topic.classList.add('is-invalid');
    }

    /**
     * Validating details
     */
    if (!details.value) {
        details.classList.add('is-invalid');
    }


    let valid = true;
    elms.forEach(elm => {
        elm.addEventListener('input', (e) => {
            elm.classList.remove('is-invalid');
        });
        if (elm.classList.contains('is-invalid')) {
            valid = false;
        }
    });

    return valid;

}

export const validateAuth = (... elms) => {

    const [ name, email ] = elms;

    /**
     * Validating name
     */
    if (!name.value) {
        name.classList.add('is-invalid');
    }

    /**
     * Validating email
     */
    const pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email.value || !pattern.test(email.value)) {
        email.classList.add('is-invalid');
    }

    let valid = true;
    elms.forEach(elm => {
        elm.addEventListener('input', (e) => {
            elm.classList.remove('is-invalid');
        });
        if (elm.classList.contains('is-invalid')) {
            valid = false;
        }
    });

    return valid;

}