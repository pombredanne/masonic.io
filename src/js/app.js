$(function() {

  var SECONDS = 1000;
  var cues = {
    cats: 24 * SECONDS,
    curtain: 7 * SECONDS,
    marquee: 22 * SECONDS,
    voice: 20 * SECONDS
  };

  function credits() {
    console.log('credits');
    var names = [
      'Brian',
      'Cy',
      'Dan',
      'Polar Bear',
      'Sebastien',
      'Walrus',
    ];

    var timePerName = (cues.marquee - cues.curtain) / names.length;
    for (var i = 0; i < names.length; i++) {
      var delay = i * timePerName;
      queueCredit(names[i], delay);
    }
  }

  function queueCredit(name, delay) {
    setTimeout(function() {
      showCredit(name);
    }, delay);
  }

  // TODO implement animated text credits
  function showCredit(name) {
    console.log(name);
    var nameElem = $('#name');
    $('#name').html(name.toUpperCase());
  }

  function curtain() {
    console.log('curtain');
    $('#curtain').fadeOut('slow');
  }

  function voice() {
    console.log('voice');
    var audioElement = document.getElementById("welcomeVader");
    audioElement.playbackRate = 0.5;
    audioElement.play();
  }

  function theme() {
    document.getElementById("theme").play();
  }

  function marquee() {
    $('marquee#welcome').css('display', 'block');
  }

  function cats() {
    console.log('meow!');
    $('.leftcat').animate({ left: "0px", bottom: "0px"}, 30 * 1000)
      $('.ritecat').animate({ right: "0px", bottom: "0px"}, 30 * 1000)
  }

  var MAX_ACC = 0.2;
  var w = screen.availWidth;
  var h = screen.availHeight;

  function rocketCat(selection) {
    var x = w + w * Math.random();
    var y = h + h * Math.random();
    var vx = 0;
    var vy = 0;

    return function (tpos) {
      var tx = tpos[0];
      var ty = tpos[1];
      var dx = tx - x;
      var dy = ty - y;
      var fac = Math.pow(dx, 2) + Math.pow(dy, 2);
      fac = Math.sqrt(fac);
      fac *= MAX_ACC;
      vx += dx / fac;
      vy += dy / fac;
      if (x < -w) {
        vx += MAX_ACC / 2;
      }
      if (x > 2*w) {
        vx -= MAX_ACC / 2;
      }
      if (y < -h) {
        vy += MAX_ACC / 2;
      }
      if (y > 2*h) {
        vy -= MAX_ACC / 2;
      }
      x += vx;
      y += vy;

      if (selection) selection.style({top: y, left: x, visibility: "visible"});
      return [x, y]
    }
  }

  function bouncingTarget() {
    var x = 0;
    var y = 0;
    var vx = 12;
    var vy = 10;
    return function() {
      if (x < -w) {
        vx = Math.abs(vx);
      } else if (x > 2*w) {
        vx = -Math.abs(vx);
      }
      if (y < -h) {
        vy = Math.abs(vy)
      } else if (y > 2*h) {
        vy = -Math.abs(vy);
      }
      x += vx;
      y += vy;
      return [x, y]
    }
  }


  function movingTarget() {
    var target;
    var TARGET_DIST = 50;
    var targetCat = rocketCat();

    function randomizeTarget() {
      target = [Math.random() * screen.availWidth, Math.random() * screen.availHeight];
    }
    randomizeTarget();

    function go() {
      var pos = targetCat(target);
      if (Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2)) < TARGET_DIST) {
        randomizeTarget();
      }
      return pos;
    }
    return go;
  }

  function makeRocketCat() {
    var s = d3.select("body").append("img").classed("cat crazcat", true).attr("src", "img/crazed_cat.jepg");
    return rocketCat(s);
  }
  var theRocketCat1 = rocketCat(d3.select("#crazcat1"));
  var theRocketCat2 = rocketCat(d3.select("#crazcat2"));
  var theRocketCat3 = rocketCat(d3.select("#crazcat3"));

  var target1 = movingTarget();
  var target2 = movingTarget();
  var target3 = movingTarget();
  var bt = bouncingTarget();
  var l = [Math.random() * w, Math.random() * h];
  function makeTheCatGo() {
    theRocketCat2(target1());
    theRocketCat1(bt());

  };

  setInterval(makeTheCatGo, 16);

  setTimeout(curtain, cues.curtain);
  setTimeout(credits, cues.curtain);
  setTimeout(voice, cues.voice);
  setTimeout(marquee, cues.marquee);
  setTimeout(cats, cues.marquee);
  theme();
});

