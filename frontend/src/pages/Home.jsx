import ImageGenerator from "../components/ImageGenerator";
import VideoGenerator from "../components/VideoGenerator";

function Home(){

 return(
    <main className="app-shell">

     <section className="hero">
        <h1>Generate Product Images and Videos With AI</h1>
       
     </section>

     <section className="tool-grid">

   <ImageGenerator />

   <VideoGenerator />

     </section>

    </main>
 );
}

export default Home;