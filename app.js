import { websim } from 'https://cdn.jsdelivr.net/npm/websim@latest/+esm';

let selectedVoice = 'en-male';
let currentAudioUrl = null;

// Voice selection
document.querySelectorAll('.voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedVoice = btn.dataset.voice;
    });
});

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const audioFile = document.getElementById('audioFile');
const fileInfo = document.getElementById('fileInfo');

uploadArea.addEventListener('click', () => audioFile.click());

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
});

uploadArea.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

audioFile.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        return;
    }
    
    fileInfo.textContent = `Selected: ${file.name} (${Math.round(file.size / 1024)}KB)`;
    
    // In a real implementation, this would upload to a voice cloning service
    console.log('File selected for voice cloning:', file.name);
}

// Synthesize speech
document.getElementById('synthesizeBtn').addEventListener('click', async () => {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        alert('Please enter some text');
        return;
    }

    const button = document.getElementById('synthesizeBtn');
    button.textContent = 'Synthesizing...';
    button.disabled = true;

    try {
        const result = await websim.textToSpeech({
            text: text,
            voice: selectedVoice
        });

        currentAudioUrl = result.url;
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = result.url;
        
        document.getElementById('audioSection').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error synthesizing speech. Please try again.');
    } finally {
        button.textContent = 'Synthesize Speech';
        button.disabled = false;
    }
});

// Download audio
document.getElementById('downloadBtn').addEventListener('click', () => {
    if (currentAudioUrl) {
        const a = document.createElement('a');
        a.href = currentAudioUrl;
        a.download = 'speech.mp3';
        a.click();
    }
});

