import chalk from "chalk";

export function receiveFile(nickname) {
    console.log(chalk.green(`Listening for files from '${nickname}'...`));
    console.log(
        chalk.gray(
            "Run `grtr serve <yourname>` on this device to accept transfers."
        )
    );
}
