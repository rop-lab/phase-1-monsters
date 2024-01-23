document.addEventListener('DOMContentLoaded', () => {
    const monsterContainer = document.getElementById('monster-container');
    const form = document.getElementById('monster-form');
    const loadMoreButton = document.getElementById('load-more');
  
    let page = 1;
  
    // Function to fetch monsters from the API
    const fetchMonsters = async () => {
      const limit = 50;
      try {
        const response = await fetch(`http://localhost:3000/monsters/?_limit=${limit}&_page=${page}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch monsters. Status: ${response.status}`);
        }
        const monsters = await response.json();
        return monsters;
      } catch (error) {
        console.error(error);
        alert('Failed to fetch monsters. Please try again later.');
        return [];
      }
    };
  
    // Function to render monsters
    const renderMonsters = (monsters) => {
      monsters.forEach((monster) => {
        const monsterCard = document.createElement('div');
        monsterCard.innerHTML = `
          <h2>${monster.name}</h2>
          <p>Age: ${monster.age}</p>
          <p>Description: ${monster.description}</p>
        `;
        monsterContainer.appendChild(monsterCard);
      });
    };
  
    // Function to handle form submission
    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      const name = form.elements['name'].value;
      const age = form.elements['age'].value;
      const description = form.elements['description'].value;
  
      // Validate form input
      if (name && age && description) {
        // Create monster object
        const monsterData = { name, age, description };
  
        try {
          // Send POST request to create a new monster
          const response = await fetch('http://localhost:3000/monsters', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(monsterData),
          });
  
          if (!response.ok) {
            throw new Error(`Failed to create monster. Status: ${response.status}`);
          }
  
          // Clear form fields
          form.reset();
  
          // Reload the page to show the new monster (this can be improved by appending the new monster without reloading)
          location.reload();
        } catch (error) {
          console.error(error);
          alert('Failed to create monster. Please try again later.');
        }
      } else {
        alert('Please fill in all fields');
      }
    };
  
    // Function to handle "Load More" button click
    const handleLoadMoreClick = async () => {
      page++;
      const monsters = await fetchMonsters();
      renderMonsters(monsters);
    };
  
    // Attach event listeners
    form.addEventListener('submit', handleFormSubmit);
    loadMoreButton.addEventListener('click', handleLoadMoreClick);
  
    // Initial load of monsters
    const initialMonsters = fetchMonsters();
    renderMonsters(initialMonsters);
  });
  