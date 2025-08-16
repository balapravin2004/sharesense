function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-gray-700">
        This is your main page. Add your components, cards, charts, or any
        content here.
      </p>
    </div>
  );
}

// Wrap this page in MainLayout
Home.getLayout = (page) => page; // Already wrapped by _app.js default

export default Home;
