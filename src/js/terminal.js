import { cloneCommandNode, COMMANDS, escapeHtml, markup } from "./modules/index.js";

const KEY = "VanillaTerm";
const MAX_HISTORY = 100;

const loadHistory = () => {
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
    } catch {
        return [];
    }
};

const saveHistory = (history) => {
    try {
        window.localStorage.setItem(
            KEY,
            JSON.stringify(history.slice(-MAX_HISTORY)),
        );
    } catch {
        // Ignore quota / private-mode failures.
    }
};

class Terminal {
    constructor(props = {}) {
        const {
            container = "vanilla-terminal",
            commands = {},
            welcome = 'Hello welcome to <a href="https://www.wllnr.nl">wllnr.nl</a>.\n',
            prompt = "~/",
            separator = "$",
        } = props;
        this.commands = Object.assign({}, commands, COMMANDS);
        this.history = loadHistory();
        this.historyCursor = this.history.length;
        this.welcome = welcome;
        this.shell = { prompt, separator };
        this.directory = "";
        this.user = "";
        this.party = false;

        const el = document.getElementById(container);
        if (el) {
            this.el = el;
            this.cacheDOM(el);
            this.addListeners();
            if (welcome) {
                this.output(welcome);
                this.output();
            }
        } else throw Error(`Container #${container} doesn't exists.`);
    }

    state = {
        prompt: undefined,
        idle: undefined,
    };

    cacheDOM = (el) => {
        el.classList.add(KEY);
        el.insertAdjacentHTML("beforeEnd", markup(this));

        const container = el.querySelector(".container");
        this.DOM = {
            container,
            output: container.querySelector("output"),
            command: container.querySelector(".command"),
            input: container.querySelector(".command .input"),
            prompt: container.querySelector(".command .prompt"),
        };
    };

    addListeners = () => {
        const { DOM, el } = this;

        const observer = new MutationObserver(() => {
            setTimeout(() => DOM.input.scrollIntoView(), 10);
        });
        observer.observe(DOM.output, { childList: true });

        el.addEventListener("click", () => DOM.input.focus(), false);
        DOM.output.addEventListener(
            "click",
            (event) => event.stopPropagation(),
            false,
        );
        DOM.input.addEventListener("keydown", this.onKeyDown, false);
        DOM.command.addEventListener("click", () => DOM.input.focus(), false);
    };

    onKeyDown = (event) => {
        const { key } = event;
        const { commands = {}, DOM, history, onInputCallback, state } = this;

        if (key === "Escape") {
            DOM.input.value = "";
            event.preventDefault();
            return;
        }

        if (key === "ArrowUp" || key === "ArrowDown") {
            if (key === "ArrowUp" && this.historyCursor > 0) {
                this.historyCursor -= 1;
            }
            if (key === "ArrowDown" && this.historyCursor < history.length - 1) {
                this.historyCursor += 1;
            }
            if (history[this.historyCursor]) {
                DOM.input.value = history[this.historyCursor];
            }
            event.preventDefault();
            return;
        }

        if (key !== "Enter") return;

        const commandLine = DOM.input.value.trim();
        if (!commandLine) return;

        const [command, ...parameters] = commandLine.split(" ");

        if (state.prompt) {
            state.prompt = false;
            this.onAskCallback(command);
            this.setPrompt();
            this.resetCommand();
            return;
        }

        history.push(commandLine);
        saveHistory(history);
        this.historyCursor = history.length;

        DOM.output.appendChild(cloneCommandNode(DOM.command));

        DOM.command.classList.add("hidden");
        DOM.input.value = "";

        if (Object.keys(commands).includes(command)) {
            const callback = commands[command];
            if (callback) callback(this, parameters);
            if (onInputCallback) onInputCallback(command, parameters);
        } else {
            this.output(`<u>${escapeHtml(command)}</u>: command not found.`);
        }
    };

    resetCommand = () => {
        const { DOM } = this;

        DOM.input.value = "";
        DOM.command.classList.remove("input");
        DOM.command.classList.remove("hidden");
        if (DOM.input.scrollIntoView) DOM.input.scrollIntoView();
    };

    clear() {
        this.DOM.output.innerHTML = "";
        this.resetCommand();
    }

    idle() {
        const { DOM } = this;

        DOM.command.classList.add("idle");
        DOM.prompt.innerHTML = '<div class="spinner"></div>';
    }

    unidle() {
        this.DOM.command.classList.remove("idle");
    }

    prompt(prompt, callback = () => {}) {
        this.state.prompt = true;
        this.onAskCallback = callback;
        this.DOM.prompt.innerHTML = `${prompt}:`;
        this.resetCommand();
        this.DOM.command.classList.add("input");
    }

    onInput(callback) {
        this.onInputCallback = callback;
    }

    output(html = "&nbsp;") {
        this.DOM.output.insertAdjacentHTML("beforeEnd", `<span>${html}</span>`);
        this.resetCommand();
    }

    setPrompt(prompt = this.shell.prompt) {
        const {
            DOM,
            shell: { separator },
        } = this;

        this.shell = { prompt, separator };
        DOM.command.classList.remove("idle");
        DOM.prompt.innerHTML = `${prompt}${separator}`;
        DOM.input.focus();
    }
}

if (window) window.VanillaTerminal = Terminal;

export default Terminal;
