class InteractiveMap {
  constructor(screen, imagePath, callback) {
    var bg = new createjs.Bitmap(imagePath);

    var padding = screen.width / 20;

    bg.x = padding;
    bg.y = screen.height / 2 - padding;

    bg.image.onload = function() {
      bg.scaleX = (9/10 * screen.width) / bg.image.width;
      bg.scaleY = (screen.height / 2) / bg.image.height;
    };

    bg.on("click", handleClick);

    function handleClick(event) {
      if(callback != null) {
        var star = new createjs.Shape();
        star.graphics.beginFill("#000000").drawPolyStar(event.stageX / screen.stage.scaleX, event.stageY / screen.stage.scaleY, 10, 5, 0.6, -90);
        screen.addChild(star);
        callback([Math.round(event.localX), Math.round(event.localY)])
      }
    }
    
    // Add background image at layer 0 (behind other objects)
    screen.addChild(bg);
  }
}
