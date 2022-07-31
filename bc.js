let wrapper = document.getElementById("bc");
function states(n) {
  const states = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  return states[n];
}
function create_html_div(style) {
  let e = document.createElement("div");
  for (let s in style) {
    e.style[s] = style[s];
  }
  return e;
}
class BeadCounter {
  constructor(n) {
    if (n > 9 || n < 1) {
      n = 9;
    }
    let texts = [
      "亿位",
      "千万位",
      "百万位",
      "十万位",
      "万位",
      "千位",
      "百位",
      "十位",
      "个位",
    ];
    this.texts = [];
    for (let i = 0; i < n; i++) {
      this.texts.push(texts.pop());
    }
    this.swidth = 600 / n + 5;
    wrapper.style = "margin: auto; width: 700px;";
    let container = create_html_div({
      "column-count": n,
      width: "600px",
      height: "550px",
    });
    this.columns = [];
    for (let i = 0; i < n; i++) {
      this.columns.push(states(0));
      let c = this.create_column(i);
      container.appendChild(c);
    }
    let box = create_html_div({
      margin: "auto",
      padding: "10px",
      width: "520px",
    });
    let input_box = document.createElement("input");
    input_box.oninput = () => {
      this.set_value(Number(input_box.value));
      this.refresh();
    };
    input_box.id = "bc-readout";
    input_box.style.fontSize = "28px";
    input_box.style.textAlign = "center";
    input_box.style.width = 500;
    input_box.style.borderRadius = "3px";
    input_box.style.background = "#eeeeee";
    box.appendChild(input_box);
    let container_bottom = create_html_div({
      width: "600px",
      position: "relative",
      top: "-50px",
      height: "25px",
      background: "grey",
      border: "1px solid #333333",
      boxShadow: "-5px 0px 10px rgba(0,0,0,0.25)",
    });
    wrapper.appendChild(container);
    wrapper.appendChild(container_bottom);
    wrapper.appendChild(box);
    for (let i = 0; i < n; i++) {
      let tag = document.createElement("p");
      tag.style = "margin: auto; text-align: center;";
      let text = document.createTextNode(this.texts.pop());
      tag.appendChild(text);
      let element_id = "text-" + i;
      let element = document.getElementById(element_id);
      element.appendChild(tag);
    }
  }
  get_value() {
    let $sum = 0;
    for (let i = 0; i < this.columns.length; i++) {
      $sum +=
        this.columns[i].reduce((partialSum, a) => partialSum + a, 0) *
        Math.pow(10, this.columns.length - i - 1);
    }
    return $sum;
  }
  set_value(n) {
    let $max = 0;
    for (let i = 0; i < this.columns.length; i++) {
      $max += Math.pow(10, this.columns.length - i);
    }
    if (n < $max) {
      let $sum;
      if (n < 0) {
        $sum = 0;
      } else {
        $sum = n;
      }
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i] = states(0);
        let m = Math.pow(10, this.columns.length - i - 1);
        if ($sum < m) {
          continue;
        } else {
          let r = $sum % m;
          this.columns[i] = states(($sum - r) / m);
          $sum = r;
        }
      }
    } else {
      let $sum = $max;
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i] = states(10);
      }
    }
  }
  toggle(col, row) {
    let x = col - 1;
    let y = row - 1;
    let v = this.columns[x][y];
    if (v == 1) {
      for (let i = 0; i < row; i++) {
        this.columns[x][i] = 0;
      }
    } else {
      for (let i = y; i < 10; i++) {
        this.columns[x][i] = 1;
      }
    }
  }
  refresh() {
    for (let x = 0; x < this.columns.length; x++) {
      for (let y = 0; y < 10; y++) {
        let col = x + 1;
        let row = y + 1;
        let bead = document.getElementById("bead-" + col + "-" + row);
        if (this.columns[x][y] == 1) {
          bead.style.transform = "translateY(320px)";
        } else {
          bead.style.transform = "translateY(0px)";
        }
      }
    }
  }
  create_column(x) {
    let column_div = create_html_div({
      height: "550px",
    });
    let column_bar = create_html_div({
      width: "5px",
      height: "500px",
      background: "grey",
      border: "1px solid #333333",
      position: "relative",
      margin: "auto",
      top: "0",
      boxShadow: "-5px 0px 10px rgba(0,0,0,0.25)",
    });
    let column_area = create_html_div({
      position: "absolute",
      width: this.swidth + 10 + "px",
      height: "200px",
      background: "lightgrey",
    });
    let column_text = create_html_div({
      position: "relative",
      width: this.swidth - 10 + "px",
      height: "40px",
      margin: "auto",
      top: "25px",
    });
    column_text.id = "text-" + x;
    for (let y = 0; y < 10; y++) {
      let col = x + 1;
      let row = y + 1;
      let $bead = create_html_div({
        background:
          "radial-gradient(ellipse farthest-corner at 25px 10px, rgba(200,0,9,1), rgba(100,0,9,1))",
        borderRadius: "43%",
        border: "1px solid rgba(0,0,0,0.25)",
        width: "32px",
        height: "16px",
        position: "relative",
        left: "-14px",
        transition: "all 0.5s",
        boxShadow: "rgba(0,0,0,0.2) -5px 5px 8px",
        cursor: "pointer",
      });
      $bead.id = "bead-" + col + "-" + row;
      $bead.onclick = () => {
        this.toggle(col, row);
        document.getElementById("bc-readout").value = this.get_value();
        this.refresh();
      };
      column_bar.appendChild($bead);
    }
    column_div.appendChild(column_area);
    column_div.appendChild(column_bar);
    column_div.appendChild(column_text);
    return column_div;
  }
}
