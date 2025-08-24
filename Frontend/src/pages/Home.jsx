import { useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import '../styles/theme.css';

const Home = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // You can add any home page initialization logic here
    document.title = 'Home | Your App Name';
  }, []);

  return (
    <div className="home-container" style={{ padding: '20px' }}>
      <h1>Welcome to Our App</h1>
      <button className="theme-button" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      
      {/* Main content section */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Featured Content</h2>
        <p>This is where your main content will go. The theme will automatically adjust based on user preference.</p>
      </section>
    </div>
  );
};

export default Home;
