interface App {
  leftOperand: string | undefined;
  rightOperand: string | undefined;
  operator: string | undefined;
  result: number | undefined;
  keys?: NodeListOf<HTMLElement>;
  screenUpperLine?: ScreenField;
  screenMainLine?: ScreenField;
  useCalculator(key: HTMLElement): void;
  handleClick(event: Event): void;
  handlePressKey(event: Event): void;
  listenToActions(): void;
  init(): void;
}

enum KeyDesignation {
  NUMERAL,
  OPERATOR,
  RESET,
  DELETE,
  EQUAL,
}

class ScreenField {
  #element: HTMLElement;

  constructor(HTMLElement: HTMLElement) {
    this.#element = HTMLElement;
  }

  update(data: string | number) {
    this.#element.textContent = data.toString();
  }
}

const app: App = {
  leftOperand: "",
  operator: "",
  rightOperand: "",
  result: 0,

  useCalculator(key: HTMLElement) {
    key.classList.add("pressed");
    let keyType: KeyDesignation = KeyDesignation.NUMERAL;
    if (key.classList.contains("operator")) keyType = KeyDesignation.OPERATOR;
    else if (key.classList.contains("reset")) keyType = KeyDesignation.RESET;
    else if (key.classList.contains("delete")) keyType = KeyDesignation.DELETE;
    else if (key.classList.contains("equal")) keyType = KeyDesignation.EQUAL;
    if (app.result) keyType = KeyDesignation.RESET;
    switch (keyType) {
      case KeyDesignation.NUMERAL:
        if (app.operator) {
          app.rightOperand = app.rightOperand + key.dataset.key;
          app.screenMainLine.update(app.rightOperand);
        } else {
          app.leftOperand = app.leftOperand + key.dataset.key;
          app.screenMainLine.update(app.leftOperand);
        }
        break;
      case KeyDesignation.RESET:
        app.leftOperand = "";
        app.rightOperand = "";
        app.operator = "";
        app.result = 0;
        app.screenMainLine.update("0");
        app.screenUpperLine.update("");
        break;
      case KeyDesignation.DELETE:
        if (app.operator) {
          app.rightOperand = app.rightOperand.slice(
            0,
            app.rightOperand.length - 1
          );
          app.screenMainLine.update(app.rightOperand || 0);
        } else {
          app.leftOperand = app.leftOperand.slice(
            0,
            app.leftOperand.length - 1
          );
          app.screenMainLine.update(app.leftOperand || 0);
        }
        break;
      case KeyDesignation.OPERATOR:
        if (app.leftOperand) {
          app.operator = key.dataset.key;
          app.screenUpperLine.update(`${app.leftOperand} ${app.operator}`);
        }
        break;
      case KeyDesignation.EQUAL:
        if (app.leftOperand && app.operator && app.rightOperand) {
          app.screenUpperLine.update(
            `${app.leftOperand} ${app.operator} ${app.rightOperand}`
          );
          switch (app.operator) {
            case "+":
              app.result = Number(app.leftOperand) + Number(app.rightOperand);
              break;
            case "-":
              app.result = Number(app.leftOperand) - Number(app.rightOperand);
              break;
            case "*":
              app.result = Number(app.leftOperand) * Number(app.rightOperand);
              break;
            case "/":
              app.result = Number(app.leftOperand) / Number(app.rightOperand);
              break;
          }
          app.screenMainLine.update(+app.result.toFixed(4));
        }
        break;
    }
  },

  handleClick(event: MouseEvent) {
    const key = event.target as HTMLElement;
    app.useCalculator(key);
    key.addEventListener("mouseout", () => key.classList.remove("pressed"));
    key.addEventListener("mouseup", () => key.classList.remove("pressed"));
  },

  handlePressKey(event: KeyboardEvent) {
    const key = Array.from(app.keys).find(
      (key) => key.dataset.key === event.key
    );
    if (key) {
      app.useCalculator(key);
      document.addEventListener("keyup", () => key.classList.remove("pressed"));
    }
  },

  listenToActions() {
    for (const key of app.keys) {
      key.addEventListener("mousedown", app.handleClick);
      document.addEventListener("keydown", app.handlePressKey);
    }
  },

  init() {
    app.keys = document.querySelectorAll(".calculator__keyboard__key");
    app.screenUpperLine = new ScreenField(
      document.querySelector(".calculator__screen--upperline")
    );
    app.screenMainLine = new ScreenField(
      document.querySelector(".calculator__screen--mainline")
    );
    app.listenToActions();
  },
};

document.addEventListener("DOMContentLoaded", app.init);
