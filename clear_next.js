const fs = require('fs');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log("Successfully removed .next folder!");
  } else {
    console.log(".next folder does not exist.");
  }
} catch (e) {
  console.error("Failed to delete .next folder:", e);
}
