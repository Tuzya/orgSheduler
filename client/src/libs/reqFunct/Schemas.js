export const getSchemas = async (phase = 1) => {
  try {
    return (await fetch(`/api/schemas/${phase}`)).json();
  } catch (err) {
    console.log('Req schema err ', err.message);
  }
};

export const putSchemas = async (key, schema, phase) => {
  try {
    return (
      await fetch(`/api/schemas/${phase}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          grschema: schema,
          phase: phase,
          key: key, //online or offline
        }),
      })
    ).json();
  } catch (err) {
    console.log('Put schema err ', err.message);
  }
};
