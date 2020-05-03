
import {
  fetchLogin,
  fetchLogout,
  fetchChatStatus,
  fetchAddMessage
} from './services';

const appState = {
  pollId: null,
  isLoggedIn: false,
  usernames: [],
  messages: [],
  error: '',
  currentUser: ''
};

const errMsgs = {
   'network-error': 'There was a problem connecting to the network, try again',
   'bad-login': "Login cannot be empty or contain all whitespaces or contain 'dog'",
   'missing-uid': 'Please login to continue.',
   'invalid-uid': 'Please login to continue.',
   'empty-message': 'Message cannot be empty'
};

function renderLogin( show ) {
  const loginElem = document.querySelector('.login');
  const logoutElem = document.querySelector('.logout');
  const displayUserElem = document.querySelector('.display-username');
  if( show ) {
     loginElem.innerHTML = `
     <input class="user-name" type="text" value="" placeholder="Enter username"/>
     <button class="login-button" type="button">Login</button>`;
     displayUserElem.innerHTML = ``;
     logoutElem.innerHTML = ``;
  } else {
      loginElem.innerHTML = ``;
      displayUserElem.innerHTML = `<span> Hello ${appState.currentUser}</span>`
      logoutElem.innerHTML = `
      <button class="logout-button" type="button">Logout</button>
     `;
  }
}

function renderErrors( text ) {
  document.querySelector('.status').innerHTML = `<span>${text}</span>`;
}

function renderPage() {
  if(!appState.isLoggedIn) {
    renderMessages([]);
    renderUsernames([]);
  } else {
    renderMessages(appState.messages);
    renderUsernames(appState.usernames);
  }
  renderErrors(appState.error);
}

function poll( shouldPoll ) {
  if( shouldPoll && !appState.pollId ) {
    appState.pollId = setInterval( () => {
      fetchChatStatus()
      .then( (content) => {
        appState.isLoggedIn = true;
        appState.usernames = content['usernames'];
        appState.messages = content['messages'];
        renderPage();
      })
      .catch( (err) => {
        setAppState( err, false);
        clearTimeout(appState.pollId);
        appState.pollId = null;
        renderLogin(true);
        renderPage();
      });
    }, 3000);
  }
  // For when a user logs out:
  if( !shouldPoll && appState.pollId ) {
    clearTimeout(appState.pollId);
    appState.pollId = null;
  }
}

const outgoingElem = document.querySelector('.outgoing');
outgoingElem.addEventListener('click', (e) => {
  if(!e.target.classList.contains('send-button')) {
    return;
  }
const text = document.querySelector('.to-send').value;
  fetchAddMessage( text )
  .then((messages) => {
     document.querySelector('.to-send').value = ''
     renderMessages(messages);
     appState.error = '';
     renderErrors(appState.error);
  })
  .catch((err) => {
    appState.error = errMsgs[err['error']] || err['error'];
    renderErrors(appState.error);
  });
});

const loginElem = document.querySelector('.login');
loginElem.addEventListener('click', (e) => {
  if(!e.target.classList.contains('login-button')) {
    return;
  }
const username = document.querySelector('.user-name').value;
  fetchLogin( username )
  .then( (content) => {
    setAppState( content, true );
    poll(true);
    renderLogin(false);
    renderPage();
    renderOutgoing();
  })
  .catch( (err) => {
    setAppState( err, false);
    renderLogin(true);
    renderPage();
    renderOutgoing();
  });
});

const logoutButtonElem = document.querySelector('.logout');
logoutButtonElem.addEventListener('click', (e) => {
   fetchLogout()
   .then( (content) => {
     appState.isLoggedIn = false;
     appState.error = '';
     poll(false);
     renderLogin(true);
     renderPage();
     renderOutgoing();
     renderErrors(appState.error);
    })
   .catch( () => {
     appState.error = 'logout-failed';
     renderPage();
   });
});

function renderUsernames( usernames ) {
  const html = usernames.map( (username) =>
  `<li>
    <div class="user">
      <span class="username">${username}</span>
    </div>
  </li>`
  ).join('')
  document.querySelector('.usernames').innerHTML = html;
}

function renderMessages( messages ) {
  const messagesElem = document.querySelector('.messages');
  const html = messages.map( (message) =>
    `<li class="message-row">
      <div class="message">
        <div class="meta-info">
           <div class="sender-info">
              <span>${message.sender}</span>
           </div>
           <div class="message-info">
              <span>${message.timestamp}</span>
           </div>
        </div>
        <p class="message-text">${message.text}</p>
      </div>
    </li>`
  ).join('');
  messagesElem.innerHTML = html;
}

function renderOutgoing() {
  const outgoingElem = document.querySelector('.outgoing');
  outgoingElem.innerHTML = `
     <input class="to-send" type="text" value="" required="true" placeholder="Enter your text"/>
     <button class="send-button" type="button">Send</button>`;

  const toSendElem = document.querySelector('.to-send');
  const sendButtonElem = document.querySelector('.send-button');
}

function setAppState( content, isLoggedIn ) {
  if( isLoggedIn ) {
    appState.isLoggedIn = true;
    appState.usernames = content['usernames'];
    appState.messages = content['messages'];
    appState.currentUser = content['currentUser'];
    appState.error = '';
  } else {
    appState.isLoggedIn = false
    appState.usernames = [];
    appState.messages = [];
    appState.currentUser = '';
    appState.error = errMsgs[content['error']] || content['error'] ;
  }
}

// on load
fetchChatStatus()
.then( ( content ) => {
    setAppState(content, true);
    renderLogin(false);
    renderPage();
    renderOutgoing();
    poll(true);
})
.catch( ( content ) => {
    setAppState(content, false);
    renderLogin(true);
    renderPage();
    renderOutgoing();
    poll(false);
    renderErrors('');
});
