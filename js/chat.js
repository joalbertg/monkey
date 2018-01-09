class Chat {
  constructor(roomKey, user, containerId, database) {
    this.id = roomKey;
    this.user = user;
    this.database = database;
    this.buildChat(containerId);
    this.setEvents();
  }

  buildChat(containerId) {
    $.tmpl($('#hidden-template'), { id: this.id }).appendTo('#' + containerId);
    this.ref = this.database.ref('/messages/' + this.id);
  }

  setEvents() {
    $('#' + this.id)
      .find('form')
      .on('submit', (event) => {
        event.preventDefault();

        var msg = $(event.target)
          .find('.message')
          .val()
          .trim();

        this.send(msg);

        return false;
      });
    
    this.ref.on('child_added', (data) => this.add(data));
  }

  add(data) {
    var message = data.val();

    var html = `
      <b>${message.name}: </b>
      <span>${message.msg}</span> 
      `;

    var $li = $('<li>')
      .addClass('collection-item')
      .html(html);
    
    $('#' + this.id)
      .find('.messages')
      .append($li);
    
    $('#' + this.id)
      .find('form > .message')
      .val('');
  }

  send(msg) {
    this.ref.push({
      name: this.user.displayName || this.user.email,
      roomId: this.id,
      msg: msg
    });
  }
}
