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

export const getCRSchemas = async (phase = 1) => {
  try {
    return (await fetch('/api/schemas/crschemas/')).json();
  } catch (err) {
    console.log('Get schema err ', err.message);
  }
};

export const putCRSchemas = async (schema) => {
  try {
    return (
      await fetch('/api/schemas/crschemas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          schema,
        }),
      })
    ).json();
  } catch (err) {
    console.log('Put Code Review schema err ', err.message);
  }
};

export const syncCRSchemas = async (schemaInit) => {
  try {
    return (
      await fetch('/api/schemas/sync', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          schemaInit: schemaInit,
        }),
      })
    ).json();
  } catch (err) {
    console.log('syncCRSchemas err ', err.message);
  }
};

