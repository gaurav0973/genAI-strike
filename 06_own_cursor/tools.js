import fs from "fs";
import path from "path";

export async function createFile({ filePath, content }) {
  console.log(`📝 Tool Call: createFile(filePath="${filePath}")`);
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    const result = `Success: File created at ${filePath}`;
    console.log(`> Tool Response: ${result}`);
    return result;
  } catch (err) {
    const errorMsg = `Error: ${err.message}`;
    console.log(`> Tool Response: ${errorMsg}`);
    return errorMsg;
  }
}


export async function executeCommand({ command }) {
  console.log(`> 💻 Tool Call: executeCommand(command="${command}")`);
  try {
    // Security check: Prevent dangerous commands
    if (command.includes("rm -rf") || command.includes("format")) {
      return "Error: Command blocked for security.";
    }

    const { stdout, stderr } = await execute(command);
    if (stderr) {
      // Some commands write to stderr even on success, but we log it just in case
      console.log(`> Tool Warning/Error: ${stderr}`);
    }
    const result = `Success: ${stdout.trim()}`;
    // console.log(`> Tool Response: ${result}`); // Optional: Log output
    return result;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}