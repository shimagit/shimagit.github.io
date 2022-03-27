(function(){
  function MAIN(){
    this.get_racket();
    this.get_ball();
    this.set_space();
    this.set_event();
  }

  MAIN.prototype.get_tennis = function(){
    if(!this.tennis){
      this.tennis = document.getElementById("tennis");
    }
    return this.tennis;
  };
  MAIN.prototype.get_racket = function(){
    if(!this.racket){
      this.racket = document.getElementById("racket");
    }
    return this.racket;
  };
  MAIN.prototype.get_ball = function(){
    if(!this.ball){
      this.ball = document.getElementById("ball");
    }
    return this.ball;
  };
  MAIN.prototype.set_space = function(){
    let tennis = this.get_tennis();
    this.space = tennis.getBoundingClientRect();
  };

  MAIN.prototype.set_event = function(){
    // キーボード操作
    window.addEventListener("keydown" , this.keydown.bind(this));
    window.addEventListener("keyup"   , this.keyup.bind(this));

    // マウス操作
    window.addEventListener("mousemove" , this.mousemove.bind(this));

    // スマホ操作
    window.addEventListener("touchstart" , this.touchstart.bind(this));
    window.addEventListener("touchmove"  , this.touchmove.bind(this));
    window.addEventListener("touchend"   , this.touchend.bind(this));

    // ゲームスタート
    this.tennis.addEventListener("click" , this.ball_start.bind(this));
  };

  MAIN.prototype.keydown = function(e){
    // 押しっぱなし防止
    if(e.repeat === true){return;}

    this.racket_offset = 0;
    switch(this.keyType(e.keyCode)){
      case "left": // <
      this.racket_offset = -1;
        break;
      case "right": // >
      this.racket_offset = +1;
        break;
    }
    this.racket_move();
  };
  MAIN.prototype.keyup = function(e){
    if(this.racket_flg){
      clearTimeout(this.racket_flg);
      delete this.racket_flg;
    }
  };
  MAIN.prototype.racket_move = function(){
    let offset = this.racket_offset;
    if(!offset){return;}
    let x = this.get_racket_x();
    let min = 0;
    let max = this.space.width - this.racket.offsetWidth;
    x = x + (offset * 10);
    if(x < min){x = 0;}
    else if(x > max){x = max;}
    this.racket.style.setProperty("left" , x +"px" , "");
    this.racket_flg = setTimeout(this.racket_move.bind(this) , 10);
    if(this.mouse_pos){
      delete this.mouse_pos;
    }
  };

  // lib
  MAIN.prototype.keyType = function(keycode){
    switch(keycode){
      case   0: return "¥";
      case   8: return "backspace";
      case   9: return "tab";
      case  13: return "return";
      case  16: return "shift";
      case  18: return "option";
      case  32: return "space";
      case  37: return "left";
      case  38: return "up";
      case  39: return "right";
      case  40: return "down";
      case  48: return "0";
      case  49: return "1";
      case  50: return "2";
      case  51: return "3";
      case  52: return "4";
      case  53: return "5";
      case  54: return "6";
      case  55: return "7";
      case  56: return "8";
      case  57: return "9";
      case  65: return "a";
      case  66: return "b";
      case  67: return "c";
      case  68: return "d";
      case  69: return "e";
      case  70: return "f";
      case  71: return "g";
      case  72: return "h";
      case  73: return "i";
      case  74: return "j";
      case  75: return "k";
      case  76: return "l";
      case  77: return "m";
      case  78: return "n";
      case  79: return "o";
      case  80: return "p";
      case  81: return "q";
      case  82: return "r";
      case  83: return "s";
      case  84: return "t";
      case  85: return "u";
      case  86: return "v";
      case  87: return "w";
      case  88: return "x";
      case  89: return "y";
      case  90: return "z";
      case  91: return "command";
      case 187: return "^";
      case 189: return "-";
    }
    return null;
  };
  MAIN.prototype.get_racket_x = function(){
    let left = document.defaultView.getComputedStyle(this.racket,'').getPropertyValue("left");
    return left ? Number(left.replace("px" , "")) : 0;
  };
  

  MAIN.prototype.mousemove = function(e){
    if('ontouchstart' in window === true){return;}

    if(typeof this.mouse_pos === "undefined"){
      this.mouse_pos = e.pageX;
    }
    let base_offset = -this.space.left;
    this.racket_mouse_move(e.pageX + base_offset);
  };
  MAIN.prototype.racket_mouse_move = function(x){
    let min = 0;
    let max = this.space.width - this.racket.offsetWidth;
    if(x < min){x = 0;}
    else if(x > max){x = max;}
    this.racket.style.setProperty("left" , x +"px" , "");
    this.mouse_pos = x;
  };


  MAIN.prototype.touchstart = function(e){
    if('ontouchstart' in window === false){return;}

    if(!e.touches || !e.touches.length){return;}
    this.touch_pos = e.touches[0].pageX;

  };
  MAIN.prototype.touchmove = function(e){
    if(typeof this.touch_pos === "undefined"){return}
    let touch_move_pos = e.touches[0].pageX;
    let diff = touch_move_pos - this.touch_pos;
    let x = this.get_racket_x();
    this.racket_mouse_move(x + diff);
    this.touch_pos = touch_move_pos;
  };
  MAIN.prototype.touchend = function(e){
    if(typeof this.touch_pos !== "undefined"){
      delete this.touch_pos;
    }
  };

  // ボール移動開始
  MAIN.prototype.ball_start = function(){
    if(this.start){return;}
    this.start = true;
    let ball_distance = 1;
    this.ball_move(ball_distance);
  };

  // ボール移動処理
  MAIN.prototype.ball_move = function(ball_distance){
    let ball_elm = this.get_ball();
    if(!ball_elm){return;}
    
    // 現在のボールの位置を取得
    let ball_pos_current = this.get_ball_pos_current(ball_elm);

    // 移動先の位置を取得
    let ball_pos_next    = this.get_ball_pos_next(ball_pos_current , ball_distance);

    // 壁を超えている場合は、壁の位置までの距離に修正、通常の場合はnext-posを採用
    let ball_pos = this.get_ball_pos(ball_pos_current , ball_pos_next);
    // game-over
    if(!ball_pos){return;}
    // 表示処理
    ball_elm.style.setProperty("left" , ball_pos.x +"px" , "");
    ball_elm.style.setProperty("top"  , ball_pos.y +"px" , "");
    setTimeout(this.ball_move.bind(this , ball_distance) , 10);
  };

  MAIN.prototype.get_ball_pos = function(ball_pos_current , ball_pos_next){
    let collision = this.ball_collision(ball_pos_next);
    let max,rate,diff;
    switch(collision){
      case "bottom":
        return null;

      case "top":
        max  = 0;
        rate = (max - ball_pos_current.y) / (ball_pos_next.y - ball_pos_current.y);
        diff = ball_pos_next.x - ball_pos_current.x;
        return {
          x : ball_pos_next.x + (diff * rate),
          y : max
        };

      case "right":
        max = this.space.width - this.ball.offsetWidth;
        rate = (max - ball_pos_current.x) / (ball_pos_next.x - ball_pos_current.x);
        diff = ball_pos_next.y - ball_pos_current.y;
        return {
          x : max,
          y : ball_pos_next.y + (diff * rate)
        };

      case "left":
        max = 0;
        rate = (max - ball_pos_current.x) / (ball_pos_next.x - ball_pos_current.x);
        diff = ball_pos_next.y - ball_pos_current.y;
        return {
          x : max,
          y : ball_pos_next.y + (diff * rate)
        };

      case "racket":
        let racket_pos = this.get_racket_pos();
        max = racket_pos.y - this.ball.offsetHeight;
        rate = (max - ball_pos_current.y) / (ball_pos_next.y - ball_pos_current.y);
        diff = ball_pos_next.x - ball_pos_current.x;
        return {
          x : ball_pos_next.x + (diff * rate),
          y : max
        };

      default:
        return ball_pos_next;
    }
  };

  MAIN.prototype.get_ball_pos_next = function(ball_pos_current , ball_distance){
    if(!this.ball_direction){
      this.ball_direction = {
        x : 1,
        y : -1
      };
    }
    else{
      let collision = this.ball_collision(ball_pos_current);
      this.ball_direction = this.get_ball_direction(collision);
    }
    return {
      x : ball_pos_current.x + this.ball_direction.x * ball_distance,
      y : ball_pos_current.y + this.ball_direction.y * ball_distance
    };
  };

  // ボールの進行方向決定 {x:* , y:*}
  MAIN.prototype.get_ball_direction = function(collision){
    let direction = this.ball_direction;
    switch(collision){
      case "top":
        direction.y *= -1;
        break;
      case "left":
      case "right":
        direction.x *= -1;
        break;
      case "top-left":
      case "top-right":
        direction.y *= -1;
        direction.x *= -1;
      case "bottom":
        return null;
      case "racket":
        direction.y *= -1;
    }
    return direction;
  };
  // ボールの当たり判定
  MAIN.prototype.ball_collision = function(ball_pos){
    // check-top
    if(ball_pos.y <= 0){
      return "top";
    }
    // check-right
    else if(ball_pos.x + this.ball.offsetWidth >= this.space.width){
      return "right";
    }
    // check-left
    else if(ball_pos.x <= 0){
      return "left";
    }
    // check-bottom
    else if(ball_pos.y >= this.space.height){
      return "bottom";
    }

    // racket
    let racket_pos = this.get_racket_pos();
    if(ball_pos.y + this.ball.offsetHeight >= racket_pos.y
    && ball_pos.x + this.ball.offsetWidth >= racket_pos.x
    && ball_pos.x <= racket_pos.x + racket_pos.w){
      return "racket";
    }
  };
  // ボールの中心点と関連情報を返す
  MAIN.prototype.get_ball_pos_current = function(ball_elm){
    if(!ball_elm){return;}
    let left = document.defaultView.getComputedStyle(ball_elm,'').getPropertyValue("left");
    let top  = document.defaultView.getComputedStyle(ball_elm,'').getPropertyValue("top");
    let x = left ? Number(left.replace("px" , "")) : 0;
    let y = top  ? Number(top.replace("px" , ""))  : 0;
    return {
      x : x,
      y : y
    };
  };
  MAIN.prototype.get_racket_pos = function(){
    let left = document.defaultView.getComputedStyle(this.racket,'').getPropertyValue("left");
    let top  = document.defaultView.getComputedStyle(this.racket,'').getPropertyValue("top");
    return {
      x : left ? Number(left.replace("px" , "")) : 0,
      y : top  ? Number(top.replace("px" , ""))  : 0,
      w : this.racket.offsetWidth,
      h : this.racket.offsetHeight
    };
  };


  switch(document.readyState){
    case "complete" : new MAIN();break;
    default : window.addEventListener("load" , (function(options){new MAIN()}).bind(this));break;
  }
})();