// App root — single page, all boards stacked
const { useEffect, useState } = React;

function App() {
  const path = window.location.pathname;
  if (path !== "/" && path !== "") return <NotFound />;

  return (
    <div style={{position:"relative", minHeight:"100vh"}}>
      <HomeBoard />
      <AboutBoard />
      <WorkBoard />
      <NsbmBoard />
      <ToolkitBoard />
      <ContactBoard />
      <footer style={{textAlign:"center", padding:"40px 20px 80px", color:"var(--ink-soft)", fontFamily:"'Patrick Hand'"}}>
        made with sticky notes & caffeine · raminda · 2025
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
