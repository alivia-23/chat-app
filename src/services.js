export const fetchLogin = (username) => {
  return fetch('/session', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({username}),
  })
  .catch( () => {
    return Promise.reject({error: 'network-error'});
  })
  .then( (response) => {
    if(!response.ok) {
      return response.json().then( result => Promise.reject(result) );
    }
    return response.json();
  });
};

export const fetchLogout = () => {
  return fetch('/session', {
    method: 'DELETE',
  })
  .catch( () => {
    return Promise.reject({error: 'network-error'});
  })
  .then( (response) => {
    if(!response.ok) {
      return response.json().then( result => Promise.reject(result) );
    }
    return response.json();
  });
};

export const fetchChatStatus = () => {
  return fetch('/chatStatus', {
    method: 'GET',
  })
  .catch( () => {
    return Promise.reject({error: 'network-error'})
  })
  .then( (response) => {
    if(!response.ok) {
      return response.json().then( result => Promise.reject(result));
    }
    return response.json();
  });
};

export const fetchAddMessage = (text) => {
  return fetch('/messages', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({text: text})
  })
  .catch( () => {
    return Promise.reject({error: 'network-error'});
  })
  .then( (response) => {
    if(!response.ok) {
      return response.json().then( result => Promise.reject(result) );
    }
    return response.json();
  });
};
