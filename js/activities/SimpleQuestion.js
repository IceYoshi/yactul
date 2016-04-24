class SimpleQuestion {
  constructor(data) {
      this._data = data;
      this._selected = [null];
      this._submitted = false;
  }

  draw(stage, score) {
    switch (this._data.view) {
      case "student":
        new BackgroundImage(stage, this._data.bg);
        this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
        new DifficultyMeter(stage, this._data.difficulty);
        new Score(stage, "Score: " + score.toString());
        new Title(stage, this._data.text);
        new AnswerButtons(stage, this._data.answers, this.selected.bind(this), this._data.image != undefined);
        new DisplayImage(stage, this._data.image);
        break;
      case "projector":
        new BackgroundImage(stage, this._data.bg);
        this._timer = new Timer(stage, this._data.time, null);
        new DifficultyMeter(stage, this._data.difficulty);
        new Score(stage, this._data.activity);
        new Title(stage, this._data.text);
        new AnswerButtons(stage, this._data.answers, null, this._data.image != undefined);
        new DisplayImage(stage, this._data.image);
        break;
    }
  }

  selected(value) {
    this._selected = value;
    this.submit();
  }

  update(data) {
    switch(data.component) {
      case "timer":
        if(data.type === "absolute")
          this._timer.update(data.value);
        if(data.type === "relative")
          this._timer.change(data.value);
        if(data.type === "pause")
          this._timer.stop();
        if(data.type === "resume")
          this._timer.start();
        break;
      default: throw new Error();
    }
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.activity + '",'
       + '"id" : ' + this._data.id + ','
       + '"selected" : ' + JSON.stringify(this._selected[0])
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}
