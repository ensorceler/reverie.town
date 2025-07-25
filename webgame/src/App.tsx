import { Chatboard } from './components/chatboard';
import { PhaserGame } from './PhaserGame';


function App() {
    // The sprite can only be moved in the MainMenu Scene
    return (
        <div className="h-screen w-full max-w-7xl ml-auto mr-auto flex flex-row gap-4 bg-gray-900 border-gray-400">
            <div className="flex flex-col justify-center h-full ">
                <PhaserGame />
            </div>
            <div className="min-w-sm h-full">
                <Chatboard />
            </div>
        </div>
    )
}

export default App


/*

        <div className={cn("h-screen", "flex flex-row")}>
            <PhaserGame />
            <Chatboard />
        </div>
*/