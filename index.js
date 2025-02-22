document.addEventListener('DOMContentLoaded', () => {
  fetch('silly_sentences.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!data || !data.silly_sentences) throw new Error('Invalid JSON structure');
      const sortedSillySentences = data.silly_sentences.sort((a, b) => a.title.localeCompare(b.title));
      const container = document.getElementById('silly_sentences-container');
      
      // Initialize counter for completed silly sentences
      let completedCount = 0;
      
      // Create cards and count completed silly sentences
      sortedSillySentences.forEach(silly_sentence => {
        const isCompleted = localStorage.getItem(`silly_sentence_${silly_sentence.id}_completed`) === 'true';
        if (isCompleted) {
          completedCount++;
        }
        const card = document.createElement('div');
        card.className = 'silly_sentence-card';
        if (isCompleted) {
          card.classList.add('completed');
        }
        card.onclick = () => window.location.href = `silly_sentence.html?id=${silly_sentence.id}`;
        card.innerHTML = `
          <img src="${silly_sentence.image}" alt="${silly_sentence.title}">
          <h2>${silly_sentence.title}</h2>
        `;
        container.appendChild(card);
      });
      
      // Update completion status display
      document.getElementById('completed-count').textContent = completedCount;
      document.getElementById('total-count').textContent = sortedSillySentences.length;
      
      // Add reset button functionality
      document.getElementById('reset-button').addEventListener('click', () => {
        sortedSillySentences.forEach(silly_sentence => {
          localStorage.removeItem(`silly_sentence_${silly_sentence.id}_completed`);
        });
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error loading silly_sentences.json:', error);
      document.getElementById('silly_sentences-container').innerHTML = '<p>Error loading Silly Sentences. Please try again later.</p>';
    });
});
