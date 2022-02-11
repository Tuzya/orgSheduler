import { useState } from 'react';

export default function useInput(initialValue, json) {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: (event) => {
        json === 'json'
          ? setValue(event.target.value)
          : setValue(event.target.value.replace(/[^\wа-яА-ЯёЁ,. ]/g, ''));
      },
    },
  };
}
