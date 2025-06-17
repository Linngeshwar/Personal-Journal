import Header from "../components/Header";
import Note from "../components/Note";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="bg-background flex flex-col min-h-screen">
        <div className="flex flex-row justify-between items-center p-4 bg-primary">
          <Header />
          
        </div>
        <Note />
      </div>
    </>
  );
}
<ThemeToggle />;
