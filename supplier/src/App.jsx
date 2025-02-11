import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  // const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <RouterProvider
        router={router({
          // isAuth: !!user?._id,
          // user: user?.userType,
        })}
      />
    </>
  );
}

export default App;

// {
//   "userId": 18,
//   "email": "abhinavg90834@gmail.com",
//   "userName": "Pool4t7",
//   "userType": "Supplier",
//   "supplierId": 43,
//   "supplierBusinessId": 74
// }
