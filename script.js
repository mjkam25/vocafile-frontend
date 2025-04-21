const API_URL = 'https://vocafile-api.onrender.com/process/';

const uploadForm = document.getElementById('uploadForm');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const summary = document.getElementById('summary');
const audioPlayer = document.getElementById('audioPlayer');
const downloadSummary = document.getElementById('downloadSummary');
const downloadAudio = document.getElementById('downloadAudio');
const originalText = document.getElementById('originalText');
const errorDiv = document.getElementById('error');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    result.classList.add('hidden');
    loader.classList.remove('hidden');

    const file = document.getElementById('fileInput').files[0];
    const maxSentences = document.getElementById('maxSentences').value;

    if (!file) {
        showError("Veuillez sélectionner un fichier.");
        loader.classList.add('hidden');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('max_sentences', maxSentences);

    try {
        const response = await fetch(`/process/`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        loader.classList.add('hidden');
        if (data.error) {
            showError(data.error);
            return;
        }
        summary.textContent = data.summary || '';
        originalText.textContent = data.original_text || '';
        downloadSummary.href = `${API_URL}/${data.summary_file}`;
        downloadAudio.href = `${API_URL}/${data.audio_file}`;
        audioPlayer.src = `${API_URL}/${data.audio_file}`;
        result.classList.remove('hidden');
    } catch (err) {
        loader.classList.add('hidden');
        showError("Erreur lors de la connexion à l'API.");
    }
});

function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
}
