import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage'
import ChatProvider from "./Context/ChatProvider";
import PageNotFound from "./Pages/PageNotFound";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ChatProvider>
                <HomePage/>
                </ChatProvider>
    },
    {
      path:'/chat',
      element:<ChatProvider>
                <ChatPage/>
              </ChatProvider>
    }
    ,{
      path:'*',
      element:<PageNotFound/>
    }
  ]);
  return (
    <>
      <div className="App">
          <RouterProvider router={router}/>
      </div>
    </>
  );
}
export default App;


