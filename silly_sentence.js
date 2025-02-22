document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const silly_sentenceId = urlParams.get('id');
  if (!silly_sentenceId) {
    document.getElementById('silly_sentence-title').textContent = 'No Silly Sentence ID specified';
    console.error('No ID found in URL');
    return;
  }

  fetch('silly_sentences.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!data || !data.silly_sentences) throw new Error('Invalid JSON structure');
      const silly_sentence = data.silly_sentences.find(m => m.id === silly_sentenceId);
      if (silly_sentence) {
        document.getElementById('silly_sentence-title').textContent = silly_sentence.title;

        const form = document.getElementById('silly_sentence-form');
        silly_sentence.inputs.forEach(input => {
          const inputElement = document.createElement('input');
          inputElement.type = 'text';
          inputElement.className = 'silly_sentence-input';
          inputElement.dataset.placeholder = input.type;
          inputElement.placeholder = input.placeholder;
          form.appendChild(inputElement);
        });

        document.getElementById('silly_sentence-image').src = silly_sentence.image;

        const storyDiv = document.getElementById('story');
        storyDiv.innerHTML = silly_sentence.story.replace(/{(\w+)}/g, (match, p1) => {
          return `<span class="placeholder" data-placeholder="${p1}">{${p1}}</span>`;
        });

        const inputs = document.querySelectorAll('.silly_sentence-input');
        const revealButton = document.getElementById('reveal-button');
        const revealContainer = document.querySelector('.reveal-container');
        const inputsSection = document.querySelector('.inputs-section');
        const tryAgainButton = document.getElementById('try-again-button');

        inputs.forEach(input => {
          input.addEventListener('input', () => {
            const placeholder = input.dataset.placeholder;
            const spans = document.querySelectorAll(`.placeholder[data-placeholder="${placeholder}"]`);
            console.log(`Updating ${placeholder} with value: "${input.value}", spans found: ${spans.length}`);
            spans.forEach(span => {
              span.textContent = input.value || `{${placeholder}}`;
            });
            checkAllFilled();
          });

          input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (checkAllFilled()) triggerReveal();
            }
          });
        });

        function checkAllFilled() {
          const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
          revealButton.disabled = !allFilled;
          return allFilled;
        }

        function triggerReveal() {
          console.log('Reveal triggered');
          if (!revealButton.disabled) {
            inputs.forEach(input => {
              const placeholder = input.dataset.placeholder;
              const spans = document.querySelectorAll(`.placeholder[data-placeholder="${placeholder}"]`);
              spans.forEach(span => {
                span.textContent = input.value || `{${placeholder}}`;
                span.classList.add('substituted');
              });
            });
            inputsSection.style.display = 'none';
            revealContainer.classList.add('visible');
            // Save completion status to localStorage
            localStorage.setItem(`silly_sentence_${silly_sentenceId}_completed`, 'true');

            let duration = 3000;
            let end = Date.now() + duration;
            (function frame() {
              confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
              confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
              if (Date.now() < end) requestAnimationFrame(frame);
            })();
          }
        }

        revealButton.addEventListener('click', triggerReveal);

        tryAgainButton.addEventListener('click', () => {
          inputsSection.style.display = 'block';
          inputs.forEach(input => { input.value = ''; });
          storyDiv.innerHTML = silly_sentence.story.replace(/{(\w+)}/g, (match, p1) => {
            return `<span class="placeholder" data-placeholder="${p1}">{${p1}}</span>`;
          });
          revealContainer.classList.remove('visible');
          revealButton.disabled = true;
        });
      } else {
        document.getElementById('silly_sentence-title').textContent = 'Silly Sentence not found';
        console.error(`No Silly Sentence found with ID: ${silly_sentenceId}`);
      }
    })
    .catch(error => {
      console.error('Error loading silly_sentences.json:', error);
      document.getElementById('silly_sentence-title').textContent = 'Error loading Silly Sentence';
    });
});
