import axios from 'axios';

const SITE_URL = 'https://darling-khapse-8ad218.netlify.app';

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    const response = await axios.post(`${SITE_URL}/.netlify/functions/setup-db`);
    console.log('Database setup response:', response.data);
  } catch (error) {
    console.error('Error setting up database:', error.response?.data || error.message);
  }
}

setupDatabase();