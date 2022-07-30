const beadSize = 32,
  beadStroke = "rgba(0,0,0,.25)",
  beadFill =
    "radial-gradient(ellipse farthest-corner at 25px 10px, rgba(200,0,9,1),rgba(100,0,9,1))",
  rodStroke = "#333",
  rodThickness = 5,
  rodFill = "grey",
  frameFill = "rgb(82, 82, 82)",
  frameStroke = "#88603f",
  frameThickness = 8,
  width = 400,
  height = 480;
  var $bc;
function initMain() {
  let s =
    '<div id="bc" style="position:relative; width:400px; height:600px; margin:auto; display:block;"></div>';
  document.write(s);
  createHTML();
  $bc = new BeadCounter();
}
function createDiv(style) {
  let e = document.createElement("div");
  for (let s in style) {
    e.style[s] = style[s];
  }
  return e;
}
function createHTML() {
  var $bcWrapper = document.getElementById("bc");
  var $bcBorder = createDiv({
    width: width + frameThickness * 2 + "px",
    borderRadius: "6px",
    border: "8px outset " + frameStroke,
    background: frameStroke,
  });
  var $bcContainer = createDiv({
    border: frameThickness + "px inset " + frameStroke,
    background: frameFill,
    background: "linear-gradient(to top left,rgb(88, 66, 46),rgb(113, 79, 51))",
    display: "flex",
    borderRadius: "5px",
    position: "relative",
    width: width + "px",
  });
  var $bcDivider = createDiv({
    position: "absolute",
    top: height / 3 + "px",
    left: 0 + "px",
    width: width - 2 + "px",
    height: frameThickness + "px",
    border: "1px solid rgba(0,0,0,.25)",
    background: frameStroke,
    boxShadow: "0px 5px 10px rgba(0,0,0,.25)",
  });
  for (let i = 0; i < 5; i++) {
    $bcContainer.appendChild(createColumnHTML(i));
  }
  $bcContainer.appendChild($bcDivider);
  $bcBorder.appendChild($bcContainer);
  $bcWrapper.appendChild($bcBorder);
  $bcWrapper.appendChild(createInputHTML());
}
function createInputHTML() {
  var $textContainer = createDiv({ margin: "auto", padding: "10px" });
  let e = document.createElement("input");
  e.oninput = function () {
    $bc.setValue(Number(e.value));
    refresh();
  };
  e.id = "bc-readout";
  e.style.fontSize = "28px";
  e.style.textAlign = "center";
  e.style.width = width + frameThickness * 2;
  e.style.borderRadius = "3px";
  e.style.background = "#eee";
  $textContainer.appendChild(e);
  return $textContainer;
}
function createBeadHTML(col, row) {
  var $bead = createDiv({
    background: beadFill,
    borderRadius: "43%",
    border: "1px solid " + beadStroke,
    width: beadSize + "px",
    height: beadSize / 2 + "px",
    transition: "all .5s",
    boxShadow: "rgba(0,0,0,.2) -5px 5px 8px",
    cursor: "pointer",
  });
  $bead.id = "bead-" + col + "-" + row;
  $bead.onclick = function () {
    $bc.toggleBead(col, row);
    document.getElementById("bc-readout").value = $bc.getValue();
    refresh();
  };
  return $bead;
}
function createColumnHTML(idx) {
  var $col = createDiv({
    height: height + "px",
    border: "",
    position: "relative",
    flex: 1,
  });
  var $bar = createDiv({
    width: rodThickness + "px",
    height: height - 2 + "px",
    background: rodFill,
    border: "1px solid " + rodStroke,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "-5px 0px 10px rgba(0,0,0,.25)",
  });
  var $top = createDiv({
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
  });
  var $bottom = createDiv({
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
  });
  for (let i = 0; i < 7; i++) {
    let b = createBeadHTML(idx, i);
    if (i < 2) { $top.appendChild(b) }
    else { $bottom.appendChild(b) };
  }
  $col.appendChild($bar);
  $col.appendChild($top);
  $col.appendChild($bottom);
  return $col;
}
function refresh() {
  for (var col = 0; col < $bc.columns.length; col++) {
    if (!$bc.columns[col]) {
      console.log("ERROR. COlumn does not exist");
      return;
    }
    for (var row = 0; row < $bc.columns[col].length; row++) {
      var $bead = document.getElementById("bead-" + col + "-" + row);
      var $toggled = $bc.columns[col][row];
      if (row < 2) {
        $bead.style.transform = $toggled ? "translateY(34px)" : "translateY(0px)";
      } else {
        $bead.style.transform = $toggled
          ? "translateY(-41px)"
          : "translateY(0px)";
      }
    }
  }
}
class BeadCounter {
  constructor() {
    function getDisplayStates(n) {
      var states = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
      ];
      return states[n];
    }
    this.columns = [];
    for (var i = 0; i < 5; i++) {
      this.columns.push([0, 0, 0, 0, 0, 0, 0]);
    }
    function colVal(arr) {
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == false)
          continue;
        if (i < 2)
          sum += 5;
        else
          sum += 1;
      }
      return sum;
    }
    this.getValue = function () {
      var sum = 0;
      for (var i = 0; i < this.columns.length; i++) {
        var place = Math.pow(10, this.columns.length - i - 1);
        sum += colVal(this.columns[i]) * place;
      }
      return sum;
    };
    this.setValue = function (n) {
      var sum = n;
      for (var i = 0; i < this.columns.length; i++) {
        var m = Math.pow(10, this.columns.length - i - 1);
        this.columns[i] = getDisplayStates(0);
        if (sum < m) {
          continue;
        } else {
          var remainder = sum % m;
          this.columns[i] = getDisplayStates((sum - remainder) / m);
          sum = remainder;
        }
      }
      if (sum != 0) {
        console.log("Error: Number too large to display");
      }
    };
    this.toggleBead = function (col, row) {
      var arr = this.columns[col];
      var toggled = !arr[row];
      arr[row] = toggled;
      if (row == 0 && toggled) {
        arr[1] = true;
      } else if (row == 1 && !toggled) {
        arr[0] = false;
      } else if (row > 1 && !toggled) {
        for (var i = arr.length - 1; i > row; i--) {
          arr[i] = false;
        }
      } else if (row > 1 && toggled) {
        for (var i = row; i > 1; i--) {
          arr[i] = true;
        }
      }
    };
  }
}
