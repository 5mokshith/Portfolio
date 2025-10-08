import { Analytics } from '@vercel/analytics/react';
import { Hero } from "./UI/Hero.jsx";
import About from "./UI/About.jsx";
import Projects from "./UI/Projects.jsx";
import Contacts from "./UI/Contacts.jsx";
import Background from "./components/Background.jsx";
import Skills from "./UI/Skills.jsx";
import GitHub from "./UI/GitHub.jsx";
import Footer from "./UI/Footer.jsx";
import SplashCursor from './UI/splashCursor.jsx';

function App() {
  return (
    <>
    <Analytics />
    <SplashCursor></SplashCursor>
      <section className="min-h-screen w-full flex items-center justify-center relative">
        <Background></Background>
        <Hero />
      </section>

      <section id="about" className="min-h-screen w-full">
        <About></About>
      </section>

      <section
        id="projects"
        className="min-h-screen w-full mt-2 md:mt-20 p-3 md:p-6"
      >
        <Projects></Projects>
      </section>

      <section id="skills" className="min-h-screen w-full mt-5 md:mt-10 p-3 md:p-6">
        <Skills></Skills>
      </section>

      <section id="github" className="min-h-screen w-full mt-2 md:mt-0 p-3 md:p-6">
        <GitHub></GitHub>
      </section>

      <section
        id="contact"
        className="min-h-screen w-full mt-10 md:mt-20 p-3 md:p-6"
      >
        <Contacts></Contacts>
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
}

export default App;
