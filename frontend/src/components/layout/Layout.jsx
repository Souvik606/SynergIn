import Navbar from "./Navbar.jsx";

const Layout=({children})=>{
  return <div className="min-h-screen bg-base-100">
    <Navbar/>
    <main className="max-w-7xl mx-auto px-4 py-5">
      {children}
    </main>
  </div>
}

export default Layout;