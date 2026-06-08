function getCleanerPosition() {

  const cleanerOffset = machine.width / 2 - 5;

  return {
    x: machine.x - Math.cos(machine.angle) * cleanerOffset,
    y: machine.y - Math.sin(machine.angle) * cleanerOffset
  };
}

function cleanIce() {

  cleanCtx.save();

  createRinkPath(cleanCtx);
  cleanCtx.clip();

  const cleaner = getCleanerPosition();

  cleanCtx.fillStyle = "rgba(160, 230, 255, 0.85)";

  cleanCtx.beginPath();
  cleanCtx.arc(
    cleaner.x,
    cleaner.y,
    20,
    0,
    Math.PI * 2
  );
  cleanCtx.fill();

  cleanCtx.restore();
}
