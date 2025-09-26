import HomePage from "../src/routes/homepage/Homepage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import  {Layout, RequireAuth } from "./routes/layout/layout";
import ListPage from "./routes/listPage/listPage";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Register from "./routes/register/register";
import Login from "./routes/login/login";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import About from "./routes/about/About";
import Contact from "./routes/contact/ContactUs";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/about",
          element:<About/>
        },
         {
          path:"/contact",
          element:<Contact/>
        },
        {
        
          path:"/list",
          element:<ListPage/>,
          loader:listPageLoader
        },
        {
          path:"/:id",
          element:<SinglePage/>,
          loader: singlePageLoader
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
        
      ]
    },{
      path:"/",
      element:<RequireAuth/>,
      children:[
        { path:"/profile", 
          element:<ProfilePage/>,
          loader: profilePageLoader
        },
          

          { path:"/profile/update", 
          element:<ProfileUpdatePage/>},

          {
          path: "/add",
          element: <NewPostPage />,
        },




      ]
    }
  ]);

  return (

    <RouterProvider router={router}/>
  );
}

export default App;