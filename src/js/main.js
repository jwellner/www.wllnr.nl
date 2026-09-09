import Terminal from "./terminal.js";
import escapeHtml from "./modules/escapeHtml.js";

const terminal = new Terminal();

terminal.prompt("login", (name) => {
    terminal.user = name;
    terminal.output(`Hi ${escapeHtml(name)}!`);
    terminal.output("Type <u>help</u> to see a list of commands.");
});
