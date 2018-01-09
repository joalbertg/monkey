; (function() {
  var config = {
    apiKey: 'AIzaSyATxL4VXqWrwII9ejeqL8Dhb4eyuvB4_XE',
    authDomain: 'laboratoria-chat.firebaseapp.com',
    databaseURL: 'https://laboratoria-chat.firebaseio.com',
    projectId: 'laboratoria-chat',
    storageBucket: 'laboratoria-chat.appspot.com',
    messagingSenderId: '852048302713'
  };

  firebase.initializeApp(config);

  var user = null;
  var database = firebase.database();

  var loginBtn = $('#start-login');
  var usuariosConectados = null;
  var conectadoKey = '';
  var rooms = null;

  loginBtn.on('click', googleLogin);
  $(window).on('unload', signOut);

  function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        user = result.user;
        console.log(user);
        $('#login').fadeOut();

        initApp();
      });
  }

  function initApp() {
    usuariosConectados = database.ref('/connected');
    rooms = database.ref('/rooms');

    login(user.uid, user.displayName || user.email);

    usuariosConectados.on('child_added', addUser);
    usuariosConectados.on('child_removed', removeUser);

    rooms.on('child_added', newRoom);
  }

  function login(uid, name) {
    var conectado = usuariosConectados.push({
      uid: uid,
      name: name
    });
    conectadoKey = conectado.key;
  }

  function signOut() {
    database.ref('/connected/' + conectadoKey).remove();
  }

  function addUser(data) {
    if (data.val().uid === user.uid) return;

    var friendId = data.val().uid;
    var $li = $('<li>')
      .addClass('collection-item')
      .html(data.val().name)
      .attr('id', friendId)
      .appendTo('#users');

    $li.on('click', function() {
      var room = rooms.push({
        creator: user.uid,
        friend: friendId
      });

      // new Chat(room.key, user, 'chats', database);
    });
  }

  function removeUser(data) {
    $('#' + data.val().uid).slideUp('fast', function() {
      $(this).remove();
    });
  }

  function newRoom(data) {
    if (data.val().friend === user.uid) {
      new Chat(data.key, user, 'chats', database);
    }

    if (data.val().creator === user.uid) {
      new Chat(data.key, user, 'chats', database);
    }
  }
})();
// Initialize Firebase
