class Map {
  constructor(data) {
      this._data = data;
      this._answer = [];
      this._submitted = false;
  }

  draw(stage) {
    switch (this._data.view) {
      case "student":
        new BackgroundImage(stage, this._data.image);
        new Timer(stage, this._data.time, this.submit.bind(this));
        new Title(stage, this._data.question);
        new InteractiveMap(stage, this._data.map, this.setAnswer.bind(this));
        break;
      case "projector":
        new BackgroundImage(stage, this._data.image);
        new Timer(stage, this._data.time, null);
        new Title(stage, this._data.question);
        new InteractiveMap(stage, this._data.map, null);
        break;
    }
  }

  setAnswer(answers) {
    this._answer = answers;
    this.submit();
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       +'"cmd" : "submit",'
       +'"activity"  : "Map",'
       + '"id" : ' + this._data.id + ','
       +'"answer" : ' + JSON.stringify(this._answer)
       +'}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}