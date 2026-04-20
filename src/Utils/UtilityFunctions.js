import { t } from 'i18next';

/* Pagination Button */
export const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
        return <b>PREV</b>;
    }
    if (type === 'next') {
        return <b>NEXT</b>;
    }
    return originalElement;
};

export const validate = (_, value) => {
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return Promise.reject(t('toastMessage.passwordValidation'));
    }
    return Promise.resolve();
}

export const capitalizeFirstLetter = (str) => {
    if (typeof str !== 'string' || str.length === 0) {
        return str; // Return the original value if it's not a string or it's empty
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const htmlDecode = (input) => {
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
}

export const validateImage = image => {
    let isImage = false
    if (
      image?.type.indexOf('jpg') != -1 ||
      image?.type.indexOf('png') != -1 ||
      image?.type.indexOf('jpeg') != -1 ||
      image?.type.indexOf('jfif') != -1
    ) {
      isImage = true
    } else {
      isImage = false
    }
    return isImage
  }
  