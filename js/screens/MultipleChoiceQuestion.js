/**
* MultipleChoiceQuestion activity.
* A variant of the Simple Question activity. Additionally, multiple answers
* can be choosen and then submitted.
*/
class MultipleChoiceQuestion {
  constructor(data) {
      this._data = data;
      this._selected = [];
      this._drawable = [];
      this._initialized = false;
      this._submitted = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/quiz-background.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));
    if(this._data.image && this._data.image != "") {
      this._hasDisplayImage = true;
      this._drawable.push(new DisplayImage(this._data.image));
    }

    switch(this._data.view) {
      case "student":
        this._drawable.push(new HeaderDisplay(`Score: ${this._data.score}`));
        this._timer = new TimeDisplay(this._data.time, this.submit.bind(this));
        this._drawable.push(this._timer);
        this._drawable.push(new ButtonPanel(this._data.answers, this._hasDisplayImage, this.selected.bind(this), this._data.stats));
        this._drawable.push(new SubmitButton("Submit", this.submit.bind(this)));
        if(this._data.tooltip && this._data.tooltip != "") this._drawable.push(new TooltipInfo(this._data.tooltip));
        break;
      case "projector":
        this._drawable.push(new HeaderDisplay(this._data.screen));
        this._timer = new TimeDisplay(this._data.time, null);
        this._drawable.push(this._timer);
        this._drawable.push(new ButtonPanel(this._data.answers, this._hasDisplayImage, null, this._data.stats));
        break;
    }
    this._initialized = true;
  }

  draw(screen) {
    if(!this._initialized) this.init();
    this._drawable.forEach(function(component) {
      let container = new createjs.Container();
      container.width = screen.width;
      container.height = screen.height;
      component.addTo(container);
      this.setOrigin(container, screen);
      screen.addChild(container);
    }.bind(this));
  }

  setOrigin(container, screen) {
    let landscape = screen.width >= screen.height;
    switch(container.name) {
      case "BackgroundImage":
        container.x = 0;
        container.y = 0;
        break;
      case "HeaderDisplay":
        container.x = 0;
        container.y = 0;
        break;
      case "TimeDisplay":
        container.x = screen.width;
        container.y = 0;
        break;
      case "TitleDisplay":
        container.x = screen.width / 2;
        container.y = screen.height / 5;
        break;
      case "DifficultyMeter":
        container.x = screen.width / 2;
        container.y = screen.height / 20;
        break;
      case "ButtonPanel":
        container.x = screen.width / 2;
        if(this._hasDisplayImage && landscape) container.x += screen.width / 4;
        container.y = screen.height * 0.65;
        if(this._hasDisplayImage && !landscape) container.y = screen.height * 0.75;
        break;
      case "DisplayImage":
        if(landscape) {
          container.x = screen.width / 4;
          container.y = screen.height * 0.65;
        } else {
          container.x = screen.width / 2;
          container.y = screen.height * 0.45;
        }
        break;
      case "SubmitButton":
        container.x = screen.width;
        container.y = screen.height;
        break;
    }
  }

  update(data) {
    switch(data.component) {
      case "timer":
        if(data.type === "absolute")
          this._timer.updateTime(data.value);
        if(data.type === "relative")
          this._timer.changeTime(data.value);
        if(data.type === "pause")
          this._timer.stopTimer();
        if(data.type === "resume")
          this._timer.startTimer();
        break;
      default: throw new Error();
    }
  }

  selected(value) {
    this._selected = value;
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.screen + '",'
       + '"id" : ' + this._data.id + ','
       + '"selected" : ' + JSON.stringify(this._selected) + ','
       + '"time-left" : ' + this._timer.getTime()
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.handleActivityEnd(this);
    }
  }

}
