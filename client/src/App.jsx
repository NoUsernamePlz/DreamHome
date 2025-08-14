import HomePage from "../src/routes/homepage/Homepage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./routes/layout/layout";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>
        }
        
      ]
    }
  ]);

  return (

    <RouterProvider router={router}/>
  );
}

export default App;