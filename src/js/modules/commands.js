import HELP from "./help.js";
import escapeHtml from "./escapeHtml.js";

const { localStorage } = window;
const KEY = "VanillaTerm";
const VERSION = "0.1.0";
const DIRS = {
    Desktop: [],
    Documents: ["resume.txt"],
    tools: ["party.sh"],
};

function login_prompt(terminal) {
    terminal.clear();
    terminal.user = "";
    terminal.prompt("login", (name) => {
        terminal.user = name;
        terminal.output(`Hi ${escapeHtml(name)}!`);
        terminal.output("Type <u>help</u> to see a list of commands.");
    });
}

export default {
    clear: (terminal) => terminal.clear(),

    help: (terminal, [command]) => {
        if (command) {
            terminal.output(
                `help: ${HELP[command] || `no help topics match <u>${escapeHtml(command)}</u>`}`,
            );
        } else {
            terminal.output(
                "Type <u>help name</u> to find out more about the function <u>name</u>.",
            );
            terminal.output(Object.keys(HELP).join(", "));
        }
    },

    version: (terminal) => terminal.output(`wllnr.nl terminal v${VERSION}`),

    wipe: (terminal) => {
        terminal.prompt(
            "Are you sure remove all your commands history? Y/N",
            (value) => {
                if (value.trim().toUpperCase() === "Y") {
                    try {
                        localStorage.removeItem(KEY);
                    } catch {
                        // Ignore storage failures.
                    }
                    terminal.history = [];
                    terminal.historyCursor = 0;
                    terminal.output("History of commands wiped.");
                }
            },
        );
    },

    contact: (terminal) => {
        terminal.output(
            'You can mail me at <a href="mailto:jeroen@wllnr.nl">jeroen@wllnr.nl</a>.',
        );
    },

    ps: (terminal) => {
        terminal.output("PID    TTY    TIME     CMD");
        terminal.output("  1    ?       0:00    /bin/bash");
        terminal.output("  2    ?       0:00    /bin/terminal");
        if (terminal.party) {
            terminal.output("  3    ?       0:00    party.sh");
        }
    },

    kill: (terminal, [pid]) => {
        if (!pid) {
            terminal.output("kill: missing operand");
            return;
        }

        if (pid == 1) {
            terminal.output("kill: cannot kill process 1: Operation not permitted");
            return;
        }

        if (pid == 2) {
            terminal.idle();

            setTimeout(() => {
                terminal.output(`kill: sending KILL signal to process ${escapeHtml(pid)}`);

                setTimeout(() => {
                    terminal.DOM.container.style.opacity = 0;
                }, 1000);

                setTimeout(() => {
                    terminal.clear();
                    terminal.DOM.container.style.opacity = 1;
                    terminal.output("Terminal rebooted.");
                    terminal.setPrompt();
                }, 3000);
            }, 1000);

            return;
        }

        if (pid == 3 && terminal.party) {
            clearInterval(terminal.party);
            document.body.style.backgroundColor = "";
            terminal.output("kill: party.sh stopped");
            terminal.party = false;
            return;
        }

        terminal.output("kill: No such process");
    },

    ping: (terminal, [host]) => {
        if (!host) {
            terminal.output("ping: missing operand");
            return;
        }
        const safeHost = escapeHtml(host);
        terminal.idle();
        for (let i = 0; i < 4; i += 1) {
            setTimeout(() => {
                terminal.output(
                    `64 bytes from ${safeHost}: icmp_seq=${i + 1} ttl=64 time=0.3 ms`,
                );
            }, i * 500);
        }

        setTimeout(() => {
            terminal.setPrompt();
        }, 2000);
    },

    logout: (terminal) => {
        login_prompt(terminal);
    },

    exit: (terminal) => {
        login_prompt(terminal);
    },

    ls: (terminal) => {
        if (terminal.directory === "") {
            terminal.output(Object.keys(DIRS).join(" "));
        } else if (DIRS[terminal.directory]) {
            terminal.output(DIRS[terminal.directory].join(" ") || "&nbsp;");
        }
    },

    cd: (terminal, [dir]) => {
        if (!dir) {
            terminal.output("cd: missing operand");
            return;
        }

        if (terminal.directory == "" && DIRS[dir]) {
            terminal.output("");
            terminal.setPrompt(`~/${dir}`);
            terminal.directory = dir;
            return;
        }

        if (dir == ".." || dir === "~") {
            terminal.output("");
            terminal.setPrompt(`~/`);
            terminal.directory = "";
            return;
        }

        terminal.output(`cd: ${escapeHtml(dir)}: No such file or directory`);
    },

    cat: (terminal, [file]) => {
        if (!file) {
            terminal.output("cat: missing operand");
            return;
        }

        const isResume =
            (terminal.directory === "" && file == "Documents/resume.txt") ||
            (terminal.directory == "Documents" && file == "resume.txt");

        if (isResume) {
            terminal.output(
                "Jeroen Wellner\
                <br>-----------------\
                <br>Devops/Software engineer\
                <br>-----------------\
                <br>Skills\
                <br>-----------------\
                <br>Python, Javascript, Docker, Infrastructure, Databases, Networking\
                <br>-----------------\
                <br>Experience\
                <br>-----------------\
                <br>2011 - now\
                <br>Freelance developer at Wellner IT Consultancy\
                <br>-----------------\
                <br>Education\
                <br>-----------------\
                <br>HBO Informatica\
                <br>MBO Informatica\
                <br>-----------------\
            ");
            return;
        }

        terminal.output(`cat: ${escapeHtml(file)}: No such file or directory`);
    },

    whoami: (terminal) => {
        terminal.output(escapeHtml(terminal.user) || "&nbsp;");
    },

    who: (terminal) => {
        terminal.output(
            `${escapeHtml(terminal.user)}   tty1     ${new Date().toUTCString()}`,
        );
    },

    pwd: (terminal) => {
        terminal.output(`~/${terminal.directory}`);
    },

    sudo: (terminal) => {
        terminal.output(
            `${escapeHtml(terminal.user)} is not in the sudoers file. This incident will be reported`,
        );
    },

    "party.sh": (terminal) => {
        if (terminal.directory !== "tools") {
            terminal.output("command not found: party.sh");
            return;
        }

        if (!terminal.party) {
            terminal.party = setInterval(() => {
                const colors = [
                    "black",
                    "red",
                    "orange",
                    "green",
                    "blue",
                    "white",
                    "yellow",
                ];
                const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];
                document.body.style.backgroundColor = randomColor;
            }, 100);

            terminal.output("Let's get this party started! 🎉🎉🎉");
        }
    },

    history: (terminal) => {
        terminal.history.forEach((command, index) => {
            terminal.output(`${index + 1}  ${escapeHtml(command)}`);
        });
    },
};
