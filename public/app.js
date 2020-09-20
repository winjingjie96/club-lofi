//create a synth and connect it to the main output (your speakers)
// const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");
document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})

// BPM Slider
var bpmSlider = document.getElementById("bpmSlider");
var bpmOutput = document.getElementById("bpmValue");
bpmOutput.innerHTML = bpmSlider.value;

bpmSlider.oninput = function() {
  bpmOutput.innerHTML = this.value;
  Tone.Transport.bpm.value = this.value;
}

// New Synth
const synth = new Tone.Synth();
synth.oscillator.type='sine';
const gain = new Tone.Gain(0.1);
synth.connect(gain);
gain.toDestination();

const notes = ['A4', 'C4', 'E4', 'G4', 'A5','C5', 'E5', 'G5']

let index = 0;

Tone.Transport.scheduleRepeat(time => {
    repeat(time);
}, '8n')



function repeat(time) {
    let note = notes [index % notes.length];
    synth.triggerAttackRelease(note, '8n', time);
    index ++
}

Tone.Transport.start()

// Step Sequencer

function sequencer(){
    const kick = new Tone.Player('./Drum/Kick_01.wav').toDestination();
    const snare = new Tone.Player('./Drum/Snare_01.wav').toDestination();
    const loop = new Tone.Player('./Music_Loops/Feel_Pad_Loop_120_CMaj.wav').toDestination();

    let index = 0;

    Tone.Transport.scheduleRepeat(repeat,'8n');
    Tone.Transport.start();

    function repeat () {
        let step = index % 8;
        let kickInputs = document.querySelector(`.kick input:nth-child(${step +1})`);
        let snareInputs = document.querySelector(`.snare input:nth-child(${step +1})`);

        if (kickInputs.checked) {
            kick.start();
        }
        if (snareInputs.checked) {
            snare.start();
        }
        index++
    }
}
sequencer()



// Constructing New Instrument
  
  class Instrument {
    constructor() {
      this.synth = new Tone.PolySynth(3, Tone.FMSynth);
  
      this.filter = new Tone.Filter();
      this.volume = new Tone.Gain();
  
      this.synth.connect(this.filter);
      this.filter.connect(this.volume);
      this.volume.toMaster();
      
      this.filter.frequency.value = 200; // 200 - 15000
      this.volume.gain.value = 0.8; // 0-0.8
    }
  
    toggleSound(value) {
      let method = value === 127 ? 'triggerAttack' : 'releaseAll';
      this.synth[method](['C4', 'E4', 'G4']);
    }
  
    handleVolume(value) { // 0-127
      let val = value / 127 * 0.8;
      this.volume.gain.value = val;
    }
  
    handleFilter(value) { // 0-127
      let val = value / 127 * 14800 + 200;
      this.filter.frequency.value = val;
    }
  }
  
    function onDeviceInput({ input, value }) {
      if (input === 23) inst.toggleSound(value);
      else if (input === 2) inst.handleVolume(value);
      else if (input === 14) inst.handleFilter(value);
      else console.log('onDeviceInput!', input, value);
    }
 