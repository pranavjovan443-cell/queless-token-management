export const playChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (e) {
    console.log("Audio play failed: ", e);
  }
};

export const announceToken = (tokenNumber, counterName) => {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(`Token number ${tokenNumber.split('').join(' ')}, please proceed to ${counterName || 'the counter'}`);
    msg.rate = 0.9;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  }
};
